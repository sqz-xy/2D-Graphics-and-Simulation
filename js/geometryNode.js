/**
 * Acts as a container for a drawable object, sets transform to the current worldmatrix
 * then invokes the draw function of the drawable object
 */
class GeometryNode extends BaseNode{

    constructor(pPolygon) {
        super();
        this.setPolygon(pPolygon);
        this.mNodeType = "Geometry";
    }

    //#region Accessors

    getPolygon() {
        return this.mPolygon;
    }
    setPolygon(pPolygon) {
        this.mPolygon = pPolygon;
    }
    
    //#endregion

    /**
     * Sets transform to the current world matrix and calls draw on the stored drawable object
     * @param {*} pContext - The current canvas context
     */
    draw(pContext) {
        this.mPolygon.drawPolygon(pContext);
    }
}