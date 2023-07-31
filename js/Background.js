/**
 * Class to draw the background of the scene
 */
class Background {
    constructor(pPosition, pGradient) {
        this.setPosition(pPosition);
        this.setGradient(pGradient);
        this.initialiseSceneGraph();
    }

    //#region Accessors

    getGradient() {
        return this.mGradient
    }
    setGradient(pGradient) {
        this.mGradient = pGradient;
    }

    getPosition() {
        return this.mPosition;
    }

    setPosition(pPosition) {
        this.mPosition = pPosition;
    }

    getNode() {
        return this.mNode;
    }

    setNode(pNode) {
        this.mNode = pNode;
    }
    //#endregion

    /**
     * Initialises the scene graph for the background
     */
    initialiseSceneGraph() {
        let translationNode;

        translationNode = new TransformNode(Matrix.createTranslation(new Vector(this.mPosition)));
        translationNode.addChild(new GeometryNode(new Polygon(this.drawBackground(), this.mGradient)));
        this.setNode(translationNode);
    }

    /**
     * Creates the vectors for the background drawing
     * @returns - An array of vectors
     */
    drawBackground() {
        let vectors = [];

        vectors.push(new Vector(-400, -300, 1));
        vectors.push(new Vector(400, -300, 1));
        vectors.push(new Vector(400, 300, 1));
        vectors.push(new Vector(-400, 300, 1));
        vectors.push(new Vector(-400, -300, 1));

        return vectors;
    }

}