import { Entity, type IEntityMouseEvent } from "./Entity";
import type { IVertices, IVertex } from "./ITransofrmBox";
import { getAngle, getCenter, getDimensions, getDistance, rotatePoint, rotateVertices, scaleVertices, translateVertices } from "./verticesUtils";
import { BTN_RADIUS, COLOR_PALETTE } from "./constant";

type ScaleControlsState = 'idle' | 'hover' | 'active';

class ScaleControls extends Entity {

    private state: ScaleControlsState = 'idle';
    private prevBoxVertices: IVertices | null = null;
    private vertexKey: keyof IVertices;

    private updateVertices: ((verts: IVertices) => void);

    constructor(ctx: CanvasRenderingContext2D, updateVertices: (verts: IVertices) => void, vertexKey: keyof IVertices) {
        super("ScaleControls", ctx);
        this.updateVertices = updateVertices;
        this.vertexKey = vertexKey;
    }

    getBtnCenter(vertices: IVertices) {
        return vertices[this.vertexKey];
    }

    getColors() {
        switch (this.state) {
            case 'idle':
                return { bg: COLOR_PALETTE.btnBg, text: COLOR_PALETTE.btnText };
            case 'hover':
                return { bg: COLOR_PALETTE.btnBgHover, text: COLOR_PALETTE.btnTextHover };
            case 'active':
                return { bg: COLOR_PALETTE.btnBgActive, text: COLOR_PALETTE.btnTextActive };
        }
    }

    draw(vertices: IVertices) {
        this.prevBoxVertices = vertices;
        const btnCenter = vertices[this.vertexKey];
        const { bg } = this.getColors();

        // draw circle
        this.ctx.beginPath();
        this.ctx.arc(btnCenter.x, btnCenter.y, BTN_RADIUS, 0, Math.PI * 2);
        this.ctx.fillStyle = bg;
        this.ctx.fill();
        this.ctx.closePath();
    }

    getOppositeVertexKey(): keyof IVertices {
        switch (this.vertexKey) {
            case 0: return 2;
            case 1: return 3;
            case 2: return 0;
            case 3: return 1;
        }
    }

    getScaledW(vertices: IVertices, point: IVertex, currVertexKey: keyof IVertices) {
        if(currVertexKey === 0) {
            return  vertices[1].x - point.x;
        }
        if(currVertexKey === 1) {
            return point.x - vertices[0].x;
        }
        if(currVertexKey === 2) {
            return  point.x - vertices[0].x;
        }

        return vertices[1].x - point.x;
    }

    getScaledH(vertices: IVertices, point: IVertex, currVertexKey: keyof IVertices) {
        if(currVertexKey === 0) {
            return  vertices[3].y - point.y;
        }
        if(currVertexKey === 1) {
            return vertices[2].y - point.y;
        }
        if(currVertexKey === 2) {
            return point.y - vertices[1].y;
        }

        return point.y - vertices[0].y;
    }

    onEvent(event: IEntityMouseEvent): boolean {
        if (!this.prevBoxVertices) {
            return false;
        }

        if (event.type == 'mouseup' || event.type == 'mouseleave') {
            this.state = 'idle';
        }

        const center = this.getBtnCenter(this.prevBoxVertices);
        const distance = getDistance(center, { x: event.clientX, y: event.clientY });

        const inBtn = distance < BTN_RADIUS;

        if (event.type == 'mousedown' && inBtn) {
            this.state = 'active';

            return true;
        }

        if (event.type == 'mousemove' && this.state !== 'active') {
            this.state = inBtn ? 'hover' : 'idle';
            return inBtn;
        }

        if (event.type == 'mousemove' && this.state === 'active') {
            const dimension = getDimensions(this.prevBoxVertices);

            // Rotate in opposite direction box and mouse point to properly calculate scale
            const center = getCenter(this.prevBoxVertices);
            const angle = getAngle(this.prevBoxVertices);
            const verticesWithoutRotation = rotateVertices(this.prevBoxVertices, -angle);

            const rotatedDragPoint = rotatePoint({ x: event.clientX, y: event.clientY }, center, -angle);

            const scaledW = this.getScaledW(verticesWithoutRotation, rotatedDragPoint, this.vertexKey);
            const scaledH = this.getScaledH(verticesWithoutRotation, rotatedDragPoint, this.vertexKey);

            // Set minimal size
            if (scaledW < BTN_RADIUS * 2 || scaledH < BTN_RADIUS * 2) {
                return true;
            }

            let scale = 1;

            if (scaledW / scaledH < dimension.width / dimension.height) {
                scale = scaledW / dimension.width;
            } else {
                scale = scaledH / dimension.height;
            }

            const resScale = 1 + (scale - 1) / 2;

            const newScaledVertices = scaleVertices(this.prevBoxVertices, resScale);

            // In example video opposite vertex is fixed during scaling, for this reason should apply translation to compensate movement
            const translateVec2 = {
                x: newScaledVertices[this.vertexKey].x - this.prevBoxVertices[this.vertexKey].x,
                y: newScaledVertices[this.vertexKey].y - this.prevBoxVertices[this.vertexKey].y,
            }
            const newVertices = translateVertices(newScaledVertices, translateVec2);

            this.updateVertices(newVertices);

            return true;
        }

        return false;
    }

    tick(_dt: number, vertices: IVertices): void {
        this.draw(vertices);
    }
}

export { ScaleControls };