/**
 * A TransformNode which extends from the base GroupNode and holds a transformation Matrix
 */
class TransformNode extends GroupNode{
    constructor(pMatrix) {
        super();
        this.setMatrix(pMatrix);
        this.mNodeType = "Transform";
    }

    //#region Accessors

    getMatrix() {
        return this.mMatrix;
    }

    setMatrix(pMatrix) {
        this.mMatrix = pMatrix;
    }

    //#endregion
}