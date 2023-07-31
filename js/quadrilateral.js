/**
 * Class to draw a quadrilateral with a set width and height
 */
 class Quadrilateral extends ObjectBase{
    constructor(pPosition, pScale, pAngle, pVelocity, pRotationRate, pScaleRate, pMass, pGravity, pFriction, pHorizontal, pWidth, pHeight) {
        // pPosition is a vector
        super(pPosition, pScale, pAngle, pVelocity, pRotationRate,pScaleRate, pMass, pGravity, pFriction);
        this.setHorizontal(pHorizontal);
        this.setWidth(pWidth);
        this.setHeight(pHeight);
        this.initialiseSceneGraph();
    }

    //#region Accessors
    getWidth() {
        return this.mWidth;
    }
    setWidth(pWidth) {
        this.mWidth = pWidth;
    }

    getHeight() {
        return this.mHeight;
    }
    setHeight(pHeight) {
        this.mHeight = pHeight;
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
        rotationNode.addChild(new GeometryNode(new Polygon(this.drawQuadrilateral(), '#567d46')));

        this.setNode(translationNode);
    }

    /**
     * Creates the vectors for the background drawing
     * @returns - An array of vectors
     */
    drawQuadrilateral() {
        let vectors = [];
        vectors.push(new Vector(-this.mWidth / 2, -this.mHeight / 2, 1));
        vectors.push(new Vector(this.mWidth / 2, -this.mHeight / 2, 1));
        vectors.push(new Vector(this.mWidth / 2, this.mHeight / 2, 1));
        vectors.push(new Vector(-this.mWidth / 2, this.mHeight / 2, 1));

        return vectors;
    }

}