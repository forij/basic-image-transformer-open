import { Entity } from "./Entity";
import { RotationControls } from "./RotationControls";
import { TranslationControls } from "./TranslationControls";
import { ScaleControls } from "./ScaleControls";
import { DEFAULT_TRANSFORM_BOX_SIZE, COLOR_PALETTE } from "./constant";
import type { IVertices } from "./ITransofrmBox";
import { getAngle, getCenter, rotateVertices } from "./verticesUtils";

class TransformBox extends Entity {

    /**
     * Vertices default mapping:
     * 0------------1
     * |            |
     * |            |
     * 3------------2
     */
    private vertices: IVertices = {
        0: { x: 0, y: 0 },
        1: { x: 0, y: 0 },
        2: { x: 0, y: 0 },
        3: { x: 0, y: 0 },
    };
    private image: HTMLImageElement | null = null;
    private rotationControls: RotationControls;
    private translationControls: TranslationControls;

    constructor(imageSrc: string, ctx: CanvasRenderingContext2D) {
        super("TransformBox", ctx);

        this.image = this.createImage(imageSrc);
        this.vertices = this.getDefaultVertices();

        this.translationControls = new TranslationControls(ctx, this.updateVertices.bind(this));
        this.addChild(this.translationControls);

        // Add scale controls for each vertex
        for (let i = 0; i < 4; i++) {
            const scaleControl = new ScaleControls(ctx, this.updateVertices.bind(this), i as keyof IVertices);
            this.addChild(scaleControl);
        }

        this.rotationControls = new RotationControls(ctx, this.updateVertices.bind(this));
        this.addChild(this.rotationControls);

    }

    updateVertices(verts: IVertices) {
        this.vertices = verts;
    }

    getDefaultVertices() {
        const canvasW = this.ctx.canvas.width;
        const canvasH = this.ctx.canvas.height;

        const w = DEFAULT_TRANSFORM_BOX_SIZE.width;
        const h = DEFAULT_TRANSFORM_BOX_SIZE.height;

        return {
            0: { x: (canvasW - w) / 2, y: (canvasH - h) / 2 },
            1: { x: (canvasW + w) / 2, y: (canvasH - h) / 2 },
            2: { x: (canvasW + w) / 2, y: (canvasH + h) / 2 },
            3: { x: (canvasW - w) / 2, y: (canvasH + h) / 2 },
        }
    }

    getAdjustedVerticesBasedOnImage() {
        if (!this.image) {
            return this.getDefaultVertices();
        }

        const canvasW = this.ctx.canvas.width;
        const canvasH = this.ctx.canvas.height;

        const originalImgW = this.image.width;
        const originalImgH = this.image.height;

        // Image w should be equal to default box w
        const imgW = DEFAULT_TRANSFORM_BOX_SIZE.width;
        const imgH = originalImgH * (imgW / originalImgW);

        const scale = Math.min(canvasW / imgW, canvasH / imgH, 1);

        const w = imgW * scale;
        const h = imgH * scale;

        return {
            0: { x: (canvasW - w) / 2, y: (canvasH - h) / 2 },
            1: { x: (canvasW + w) / 2, y: (canvasH - h) / 2 },
            2: { x: (canvasW + w) / 2, y: (canvasH + h) / 2 },
            3: { x: (canvasW - w) / 2, y: (canvasH + h) / 2 },
        }
    }



    createImage(imageSrc: string) {
        const img = new Image();
        img.src = imageSrc;
        console.log("Image loading:", img.src);
        img.onload = () => {
            this.image = img;
            this.vertices = this.getAdjustedVerticesBasedOnImage();
        };
        return img;
    }

    // using vertices to draw a rectangle
    drawRect() {
        this.ctx.strokeStyle = COLOR_PALETTE.accent;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        const verts = this.vertices;
        this.ctx.moveTo(verts[0].x, verts[0].y);
        this.ctx.lineTo(verts[1].x, verts[1].y);
        this.ctx.lineTo(verts[2].x, verts[2].y);
        this.ctx.lineTo(verts[3].x, verts[3].y);
        this.ctx.lineTo(verts[0].x, verts[0].y);

        this.ctx.closePath();
        this.ctx.stroke();
    }

    drawImage() {
        if (!this.image?.complete) {
            // Image not loaded yet
            const center = getCenter(this.vertices);
            this.ctx.textAlign = "center";
            this.ctx.fillText("Loading...", center.x, center.y);
            return;
        }

        const angle = getAngle(this.vertices);
        const originalVertices = rotateVertices(this.vertices, -angle);
        const c = getCenter(this.vertices);
        const imageW = originalVertices[1].x - originalVertices[0].x;
        const imageH = originalVertices[3].y - originalVertices[0].y;

        this.ctx.translate(c.x, c.y);
        this.ctx.rotate(angle * Math.PI / 180);
        this.ctx.drawImage(this.image, -imageW / 2, -imageH / 2, imageW, imageH);
        this.ctx.rotate(-angle * Math.PI / 180);
        this.ctx.translate(-c.x, -c.y);
    }

    tick(dt: number) {
        this.drawImage();

        this.children.forEach(child => {
            child.tick(dt, this.vertices);
        });

        // const rotatedVertices = rotateVertices(this.vertices, 1);
        // this.vertices = rotatedVertices;
    }

}

export { TransformBox };