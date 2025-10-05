import type { IVertex, IVertices } from "./ITransofrmBox";

export function getCenter(verts: IVertices) {
    const centerX = (verts[0].x + verts[1].x + verts[2].x + verts[3].x) / 4;
    const centerY = (verts[0].y + verts[1].y + verts[2].y + verts[3].y) / 4;
    return { x: centerX, y: centerY };
}

export function getAngle(verts: IVertices) {
    const deltaY = verts[1].y - verts[0].y;
    const deltaX = verts[1].x - verts[0].x;
    return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
}


export function rotatePoint(point: IVertex, center: IVertex, angle: number): IVertex {
    const rad = angle * (Math.PI / 180);
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const x = point.x - center.x;
    const y = point.y - center.y;

    // https://en.wikipedia.org/wiki/Rotation_matrix
    return {
        x: x * cos - y * sin + center.x,
        y: x * sin + y * cos + center.y,
    };
}

export function rotateVertices(verts: IVertices, angle: number) {
    const center = getCenter(verts);

    return {
        0: rotatePoint(verts[0], center, angle),
        1: rotatePoint(verts[1], center, angle),
        2: rotatePoint(verts[2], center, angle),
        3: rotatePoint(verts[3], center, angle),
    };
}

export function translateVertices(verts: IVertices, delta: IVertex) {
    return {
        0: { x: verts[0].x + delta.x, y: verts[0].y + delta.y },
        1: { x: verts[1].x + delta.x, y: verts[1].y + delta.y },
        2: { x: verts[2].x + delta.x, y: verts[2].y + delta.y },
        3: { x: verts[3].x + delta.x, y: verts[3].y + delta.y },
    };
}

export function scaleVertices(verts: IVertices, scale: number) {
    const center = getCenter(verts);

    const scalePoint = (point: IVertex) => {
        return {
            x: center.x + (point.x - center.x) * scale,
            y: center.y + (point.y - center.y) * scale,
        };
    };

    return {
        0: scalePoint(verts[0]),
        1: scalePoint(verts[1]),
        2: scalePoint(verts[2]),
        3: scalePoint(verts[3]),
    };
}

export function dotProduct(v1: IVertex, v2: IVertex) {
    return v1.x * v2.x + v1.y * v2.y;
}

export function getDistance(p1: IVertex, p2: IVertex) {
    return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

export function vec2Subtract(v1: IVertex, v2: IVertex): IVertex {
    return { x: v1.x - v2.x, y: v1.y - v2.y };
}

export function getDimensions(verts: IVertices): { width: number; height: number } {
    const angle = getAngle(verts);
    const rotatedVerts = rotateVertices(verts, -angle);
    const width = rotatedVerts[1].x - rotatedVerts[0].x;
    const height = rotatedVerts[3].y - rotatedVerts[0].y;
    return { width, height };
}

export function isPointALeftOfLine(point: IVertex, lineStart: IVertex, lineEnd: IVertex): boolean {
    const crossProduct = (lineEnd.x - lineStart.x) * (point.y - lineStart.y) - (lineEnd.y - lineStart.y) * (point.x - lineStart.x);
    return crossProduct > 0;
}

export function isPointInRect(point: IVertex, rectVerts: IVertices): boolean {
    const [A, B, C, D] = [rectVerts[0], rectVerts[1], rectVerts[2], rectVerts[3]];
    return isPointALeftOfLine(point, A, B) &&
        isPointALeftOfLine(point, B, C) &&
        isPointALeftOfLine(point, C, D) &&
        isPointALeftOfLine(point, D, A);
}