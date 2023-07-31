/**
 * Class to draw a line object
 */
class Line extends ObjectBase{
    constructor(pPosition, pScale, pAngle, pVelocity, pRotationRate, pScaleRate, pMass, pGravity, pFriction, pHorizontal, pLength) {
        super(pPosition, pScale, pAngle, pVelocity, pRotationRate,pScaleRate, pMass, pGravity, pFriction);
        this.setHorizontal(pHorizontal);
        this.setLength(pLength);
        this.initialiseSceneGraph();
    }

    //#region Accessors
    getLength() {
        return this.mLength;
    }
    setLength(pLength) {
        this.mLength = pLength;
    }

    getHorizontal() {
        return this.mHorizontal;
    }
    setHorizontal(pHorizontal) {
        this.mHorizontal = pHorizontal;
    }

    //#endregion

    /**
     * Initialises the scene graph for the background
     */
    initialiseSceneGraph() {
        let translationNode, rotationNode, scaleNode;

        rotationNode = new TransformNode(Matrix.createRotation(this.mAngle));
        scaleNode = new TransformNode(Matrix.createScale(this.mScale));
        translationNode = new TransformNode(Matrix.createTranslation(this.mPosition));

        translationNode.addChild(scaleNode);
        scaleNode.addChild(rotationNode);
        rotationNode.addChild(new GeometryNode(new Polygon(this.drawLine(), '#567d46')));

        this.setNode(translationNode);
    }

    /**
     * Creates the vectors for the background drawing
     * @returns - An array of vectors
     */
    drawLine() {
        let vectors = [];
        vectors.push(new Vector(-this.mLength / 2, 0, 1));
        vectors.push(new Vector(this.mLength / 2, 0, 1));

        return vectors;
    }

}