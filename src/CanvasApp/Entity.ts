
export type IEntityMouseEvent = {
    clientX: number;
    clientY: number;
    type: 'mousedown' | 'mouseup' | 'mousemove' | 'mouseleave';
}

class Entity {

    public readonly name: string;
    public readonly ctx: CanvasRenderingContext2D;
    public children: Entity[] = [];

    constructor(name: string, ctx: CanvasRenderingContext2D) {
        this.name = name;
        this.ctx = ctx;
    }

    /**
     * Called from parent when the entity should resize
     */
    onResize(_width: number, _height: number) {

    }

    addChild(child: Entity) {
        this.children.push(child);
    }

    // If event is handled by this entity, return true to stop propagation to other entities
    onEvent(event: IEntityMouseEvent): boolean {
        for (const child of [...this.children].reverse()) {
            if (child.onEvent(event)) {
                return true;
            }
        }
        return false;
    }

    removeChild(child: Entity) {
        const index = this.children.indexOf(child);
        if (index !== -1) {
            this.children.splice(index, 1);
        }
    }

    /**
     * Called on each frame update
     * @param _dt Delta time in milliseconds
     */
    tick(_dt: number, ..._args: any[]): void {

    }
}

export { Entity };