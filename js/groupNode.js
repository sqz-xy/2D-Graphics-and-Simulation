/**
 * A GroupNode which extends BaseNode and can have other nodes as children, I decided to treat group as a more abstract class type
 */
class GroupNode extends BaseNode {
    constructor() {
        super();
        this.mChildren = [];
        this.mNodeType = "Group";
    }

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
}