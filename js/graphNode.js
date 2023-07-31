/**
 * Class to create nodes for the scene graph (NOT USED ANYMORE DUE TO ADVANCED SCENE GRAPH)
 */
class GraphNode {
    constructor(pMatrix) {
        this.setMatrix(pMatrix);
        this.mChildren = [];
    }

    //#region Accessors

    getMatrix() {
        return this.mLocalMatrix;
    }
    setMatrix(pMatrix) {
        this.mLocalMatrix = pMatrix;
    }

    //#endregion

    /**
     * gets the number of children this node has
     * @returns the length of the array of children
     */
    getNumberOfChildren() {
        return this.mChildren.length;
    }

    /**
     * Returns a child node at a desired index
     * @param {*} pIndex - The index of the child node you want (0 Indexed)
     * @returns A GraphNode object
     */
    getChildAt(pIndex) {
        return this.mChildren[pIndex];
    }

    /**
     * Appends a child node to the end of the array of children
     * @param {*} pChild - The child node you want to add to the end of the array
     */
    addChild(pChild) {
        this.mChildren.push(pChild);
    }

    /**
     * Multiplies the world matrix with the local matrix and then loops through all the children recursively
     * @param {*} pContext - The current context 
     * @param {*} pWorldMatrix - The world matrix
     */
    draw(pContext, pWorldMatrix) {
        let resultantMatrix;

        resultantMatrix = pWorldMatrix.multiply(this.mLocalMatrix);
        resultantMatrix.setTransform(pContext);

        for (let childIndex = 0; childIndex < this.getNumberOfChildren(); childIndex++) {
            this.mChildren[childIndex].draw(pContext, resultantMatrix);
        }

        pWorldMatrix.setTransform(pContext);
    }
}