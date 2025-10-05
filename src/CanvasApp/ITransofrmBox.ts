export type IVertex = {
    x: number;
    y: number;
}

/**
   * Vertices default mapping: \n
   * 0------------1
   * |            |
   * |            |
   * 3------------2
   */
export type IVertices = {
    0: IVertex;
    1: IVertex;
    2: IVertex;
    3: IVertex;
}
