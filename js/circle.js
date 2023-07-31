/**
 * Class for the Circle Object
 */
class Circle extends ObjectBase{
    constructor(pPosition, pScale, pAngle, pVelocity, pRotationRate, pScaleRate, pMass, pGravity, pFriction, pRadius) {
        super(pPosition, pScale, pAngle, pVelocity, pRotationRate,pScaleRate, pMass, pGravity, pFriction);
        this.setRadius(pRadius);
        this.initialiseSceneGraph();
    }

    //#region Accessors
    setRadius(pRadius) {
        this.mRadius = pRadius;
    }
    getRadius() {
        return this.mRadius * this.mScale.getX(); // Bandaid fix for scaling issue
    }
    //#end region

    /**
     * Initialises the scene graph for the meteor object
     */
    initialiseSceneGraph() {
        let translationNode, scaleNode, rotationNode;

        // Transformation nodes for the entire Meteor
        translationNode = new TransformNode(Matrix.createTranslation(this.mPosition));
        scaleNode = new TransformNode(Matrix.createScale(this.mScale));
        rotationNode = new TransformNode(Matrix.createRotation(this.mAngle));

        // Graph creation
        translationNode.addChild(rotationNode);
        rotationNode.addChild(scaleNode);

        scaleNode.addChild(new GeometryNode(new Polygon(this.drawCricle(this.mRadius), '#FF0000')));

        this.setNode(translationNode);
    }

    /**
     * Generates an array of vectors which correspond to a regular polygon which draws the main body of the meteor
     * @returns - An array of vectors
     */
    drawCricle(pRadius) {
        let vectors = [];

        vectors = Polygon.drawRegularPolygon(50, 0, 0, pRadius);
        return vectors;
    }

    /**
     * Generates an array of vectors which correspond to a regular polygon which draws a crater
     * @returns - An array of vectors
     */
    drawCrater(pRadius) {
        let vectors = [];

        vectors = Polygon.drawRegularPolygon(50, 0, 0, pRadius);
        return vectors;
    }
}