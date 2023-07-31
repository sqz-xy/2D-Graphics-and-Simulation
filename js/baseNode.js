/**
 * A base node class which holds a node type and an accept function, used strictly for inheritance
 */
class BaseNode {
    constructor() {
        this.mNodeType = "";
        if (this.constructor === BaseNode) {
            throw new Error("Abstract classes can't be instantiated");
        }
    }

    /**
     * Accepts the visit
     * @param {*} pVisitor - The Visitor
     */
    accept(pVisitor) {
        pVisitor.visit(this);
    }

    /**
     * Returns the Node type
     * @returns - The Node type as string
     */
    getNodeType() {
    return this.mNodeType;
    }
}