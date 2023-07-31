/**
 * Visitor object which visits nodes
 */
class RenderVisitor {

    constructor(pContext) {
        this.mStack = [];
        this.setContext(pContext);
    }

    //#region Accessors

    getContext() {
        return this.mContext;
    }

    setContext(pContext) {
        this.mContext = pContext;
    }

    //#endregion

    /**
     * Checks the node type and deals with it based on that
     * @param {*} pNode - The node you want to visit
     */
    visit(pNode) {
        if (pNode.getNodeType() === "Group") {
            this.visitGroup(pNode);
        }
        else if (pNode.getNodeType() === "Transform") {
            this.visitTransform(pNode);
        }
        else if (pNode.getNodeType() === "Geometry") {
            this.visitGeometry(pNode);
        }
    }

    /**
     * Visits all children of a node
     * @param {*} pNode - The node whose children you want to visit
     */
    visitGroup(pNode) {
        let index, child;

        for(index = 0; index < pNode.getNumberOfChildren(); index++) {
            child = pNode.getChildAt(index);
            child.accept(this);
        }
    }

    /**
     * Pushes the local transform to the stack and visits the nodes children
     * @param {*} pNode - The node to be visited
     */
    visitTransform(pNode) {
        // Node needs getTransform function
        this.push(pNode.getMatrix()); // adds the nodes transform matrix to the top of the stack
        this.visitGroup(pNode); // Visits the nodes children
        this.pop(); 
    }

    /**
     * Visits a geometry Node, sets the transform and draws the polygon
     */
    visitGeometry(pNode) {
        let polygon, matrix;

        polygon = pNode.getPolygon();
        matrix = this.peek();
        matrix.setTransform(this.mContext);
        polygon.draw(this.mContext, matrix);
    }

    /**
     * Removes the top item off the stack and returns it
     * @returns - A transformation matrix 
     */
    pop() {
        return this.mStack.pop();
    }

    /**
     * Returns the top item of the stack without removing it
     * @returns - A transformation matrix
     */
    peek() {
        return this.mStack[this.mStack.length - 1];
    }

    /**
     * Adds a transformation matrix to the top of the stack
     * @param {*} pMatrix - The matrix to be added
     */
    push(pMatrix) {
        let newMatrix;

        // If the stack is empty it is added straight on
        if (this.mStack.length === 0) {
            this.mStack.push(pMatrix);
        }
        // The top matrix will always be the world matrix
        // Multiplies the new matrix with the world matrix and adds it to the top 
        else {
            newMatrix = this.peek().multiply(pMatrix);
            this.mStack.push(newMatrix);
        }
    }
}