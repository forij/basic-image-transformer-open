import { Entity, type IEntityMouseEvent } from "./Entity";
import type { IVertices } from "./ITransofrmBox";
import { getAngle, getCenter, getDistance, rotateVertices } from "./verticesUtils";
import { BTN_RADIUS, ROTATION_BTN_MARGIN, COLOR_PALETTE } from "./constant";

type RotationControlsState = 'idle' | 'hover' | 'active';

class RotationControls extends Entity {

    private rotationCharacter = "⟳";
    private state: RotationControlsState = 'idle';
    private prevBoxVertices: IVertices | null = null;
    private updateVertices: ((verts: IVertices) => void);

    constructor(ctx: CanvasRenderingContext2D, updateVertices: (verts: IVertices) => void) {
        super("RotationControls", ctx);
        this.updateVertices = updateVertices;
    }

    getBtnCenter(vertices: IVertices) {
        const boxCenter = getCenter(vertices);
        const boxAngle = getAngle(vertices); // 90 degrees offset to point upwards
        const originalVertices = rotateVertices(vertices, -boxAngle);
        const btnAngle = boxAngle + 90;
        const btnRotationDistance = (originalVertices[3].y - originalVertices[0].y) / 2 + ROTATION_BTN_MARGIN;

        return {
            x: boxCenter.x + (btnRotationDistance * Math.cos((btnAngle * Math.PI) / 180)),
            y: boxCenter.y + (btnRotationDistance * Math.sin((btnAngle * Math.PI) / 180)),
        };
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
        const btnCenter = this.getBtnCenter(vertices);
        const { bg, text } = this.getColors();

        // draw circle
        this.ctx.beginPath();
        this.ctx.arc(btnCenter.x, btnCenter.y, BTN_RADIUS, 0, Math.PI * 2);
        this.ctx.fillStyle = bg;
        this.ctx.fill();
        this.ctx.closePath();

        // draw rotation character
        this.ctx.font = "30px Arial";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillStyle = text;
        this.ctx.fillText(this.rotationCharacter, btnCenter.x, btnCenter.y);
    }

    onEvent(event: IEntityMouseEvent): boolean {
        if (!this.prevBoxVertices) {
            return false;
        }

        if (event.type == 'mouseup' || event.type == 'mouseleave') {
            this.state = 'idle';
        }

        if (event.type == 'mousedown') {
            const center = this.getBtnCenter(this.prevBoxVertices);
            const distance = getDistance(center, { x: event.clientX, y: event.clientY });

            this.state = distance < BTN_RADIUS ? 'active' : 'idle';
        }

        if (event.type == 'mousemove' && this.state !== 'active') {
            const center = this.getBtnCenter(this.prevBoxVertices);
            const distance = getDistance(center, { x: event.clientX, y: event.clientY });

            this.state = distance < BTN_RADIUS ? 'hover' : 'idle';
        }

        if (event.type == 'mousemove' && this.state === 'active') {
            const boxCenter = getCenter(this.prevBoxVertices);
            const currAngle = getAngle(this.prevBoxVertices);
            const deltaY = event.clientY - boxCenter.y;
            const deltaX = event.clientX - boxCenter.x;
            const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) - 90 - currAngle; // 90 degrees offset to point upwards

            const newVertices = rotateVertices(this.prevBoxVertices, angle);
            this.updateVertices(newVertices);

        }
        return false;
    }

    tick(dt: number, vertices: IVertices): void {
        this.draw(vertices);
    }
}

export { RotationControls };