import { Entity, type IEntityMouseEvent } from "./Entity";
import { TransformBox } from "./TransformBox";

class CanvasApp extends Entity {

    private canvas: HTMLCanvasElement;
    private listeners: Array<{ event: string; handler: EventListenerOrEventListenerObject }> = [];

    constructor(canvas: HTMLCanvasElement, imageSrc: string) {
        super("root", canvas.getContext("2d")!);
        this.canvas = canvas;
        this.onResize();

        const transformBox = new TransformBox(imageSrc, this.ctx);

        this.addChild(transformBox);

        this.subscribeToEvent('mousedown', (e) => this.onCanvasOriginalEvent(e));
        this.subscribeToEvent('mousemove', (e) => this.onCanvasOriginalEvent(e));
        this.subscribeToEvent('mouseup', (e) => this.onCanvasOriginalEvent(e));
        this.subscribeToEvent('mouseleave', (e) => this.onCanvasOriginalEvent(e));
    }

    onCanvasOriginalEvent(event: Event) {
        if (!(event instanceof MouseEvent)) {
            return;
        }

        this.onEvent({
            type: event.type as IEntityMouseEvent['type'],
            clientX: event.clientX * devicePixelRatio,
            clientY: event.clientY * devicePixelRatio
        });
    }

    onEvent(event: IEntityMouseEvent): boolean {
        return super.onEvent(event);
    }

    tick(dt: number): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.children.forEach(child => child.tick(dt));
    }

    subscribeToEvent(event: string, handler: EventListenerOrEventListenerObject) {
        this.listeners.push({ event, handler });
        this.canvas.addEventListener(event, handler);
    }

    onResize() {
        this.canvas.width = this.canvas.clientWidth * devicePixelRatio;
        this.canvas.height = this.canvas.clientHeight * devicePixelRatio;

        const ctx = this.canvas.getContext("2d");
        if (ctx) {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    destroy() {
        // Cleanup if necessary
        // remove event listeners, free resources, etc.
    }
}

export { CanvasApp };