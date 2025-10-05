import { Entity, type IEntityMouseEvent } from "./Entity";
import type { IVertices } from "./ITransofrmBox";
import { getCenter, vec2Subtract, isPointInRect, translateVertices } from "./verticesUtils";
import { COLOR_PALETTE } from "./constant";

type TranslationControlsState = 'idle' | 'hover' | 'active';

class TranslationControls extends Entity {

    private state: TranslationControlsState = 'idle';
    private prevBoxVertices: IVertices | null = null;
    private prevDragPoint: { x: number; y: number } | null = null;

    private updateVertices: ((verts: IVertices) => void);

    constructor(ctx: CanvasRenderingContext2D, updateVertices: (verts: IVertices) => void) {
        super("TranslationControls", ctx);
        this.updateVertices = updateVertices;
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

        this.ctx.strokeStyle = this.getColors().bg;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(vertices[0].x, vertices[0].y);
        this.ctx.lineTo(vertices[1].x, vertices[1].y);
        this.ctx.lineTo(vertices[2].x, vertices[2].y);
        this.ctx.lineTo(vertices[3].x, vertices[3].y);
        this.ctx.lineTo(vertices[0].x, vertices[0].y);

        this.ctx.closePath();
        this.ctx.stroke();
    }

    onEvent(event: IEntityMouseEvent): boolean {
        if (!this.prevBoxVertices) {
            return false;
        }

        if (event.type == 'mouseup' || event.type == 'mouseleave') {
            this.state = 'idle';
            this.prevDragPoint = null;
        }

        const isInRect = isPointInRect({ x: event.clientX, y: event.clientY }, this.prevBoxVertices);

        if (event.type == 'mousedown' && isInRect) {
            this.state = 'active';
            this.prevDragPoint = { x: event.clientX, y: event.clientY };

            return true;
        }

        if (event.type == 'mousemove' && this.state !== 'active') {
            this.state = isInRect ? 'hover' : 'idle';

            return isInRect;
        }

        if (event.type == 'mousemove' && this.state === 'active' && this.prevDragPoint) {
            const translateVec2 = vec2Subtract({
                x: event.clientX,
                y: event.clientY
            }, this.prevDragPoint);
            this.prevDragPoint = { x: event.clientX, y: event.clientY };


            this.updateVertices(translateVertices(this.prevBoxVertices, translateVec2));

            return true;
        }

        return false;
    }

    tick(dt: number, vertices: IVertices): void {
        this.draw(vertices);
    }
}

export { TranslationControls };