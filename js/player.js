/**
 * Class to draw the Player
 */
 class Player {
    constructor(pPosition, pVelocity, pRotation, pRotationRate, pScale, pMass, pGravity, pFriction) {
        this.setPosition(pPosition);
        this.setVelocity(pVelocity);
        this.setRotation(pRotation);
        this.setRotationRate(pRotationRate);
        this.setScale(pScale);
        this.setMass(pMass);
        this.setGravity(pGravity);
        this.setFriction(pFriction);
        this.mRadius = 15;
        this.initialiseSceneGraph();
    }

    //#region Accessors
    setFriction(pFriction) {
        this.mFriction = pFriction;
    }
    getFriction() {
        return this.mFriction;
    }

    setGravity(pGravity) {
        this.mGravity = pGravity;
    }
    getGravity(pGravity) {
        return this.mGravity;
    }

    setMass(pMass) {
        this.mMass = pMass;
    }
    getMass() {
        return this.mMass;
    }

    setScale(pScale) {
        this.mScale = pScale;
    }
    getScale() {
        return this.mScale;
    }

    getRadius() {
        return this.mRadius;
    }

    getRotationRate() {
        return this.mRotationRate;
    }
    setRotationRate(pRotationRate) {
        this.mRotationRate = pRotationRate;
    }

    getRotation() {
        return this.mRotation;
    }
    setRotation(pRotation) {
        this.mRotation = pRotation;
    }

    getVelocity() {
        return this.mVelocity;
    }
    setVelocity(pVelocity) {
        this.mVelocity = pVelocity;
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
        // Add scale nodes for eyes
        let translationNode, rotationNode, scaleNode;

        let leftEyeTransformNode, rightEyeTransformNode, bodyTransformNode, leftPupilTransformNode, rightPupilTransformNode,
        leftEyeScaleNode, rightEyeScaleNode, bodyScaleNode, leftPupilScaleNode, rightPupilScaleNode;

        bodyTransformNode = new TransformNode(Matrix.createTranslation(new Vector(0, 0, 1)));
        leftEyeTransformNode = new TransformNode((Matrix.createTranslation(new Vector(-7, 0, 1))));
        rightEyeTransformNode = new TransformNode((Matrix.createTranslation(new Vector(7, 0, 1))));
        leftPupilTransformNode = new TransformNode((Matrix.createTranslation(new Vector(-7, 0, 1))));
        rightPupilTransformNode = new TransformNode((Matrix.createTranslation(new Vector(7, 0, 1))));

        bodyScaleNode = new TransformNode(Matrix.createScale(new Vector(1, 1, 0)));
        leftEyeScaleNode = new TransformNode(Matrix.createScale(new Vector(0.25, 0.25, 0)));
        rightEyeScaleNode = new TransformNode(Matrix.createScale(new Vector(0.25, 0.25, 0)));
        leftPupilScaleNode = new TransformNode(Matrix.createScale(new Vector(0.06, 0.06, 0)));
        rightPupilScaleNode = new TransformNode(Matrix.createScale(new Vector(0.06, 0.06, 0)));

        translationNode = new TransformNode(Matrix.createTranslation(this.mPosition));
        rotationNode = new TransformNode(Matrix.createRotation(this.mRotation));
        scaleNode = new TransformNode(Matrix.createScale(this.mScale));

        translationNode.addChild(scaleNode);
        scaleNode.addChild(rotationNode);

        rotationNode.addChild(bodyTransformNode);
        rotationNode.addChild(leftEyeTransformNode);
        rotationNode.addChild(rightEyeTransformNode);
        rotationNode.addChild(leftPupilTransformNode);
        rotationNode.addChild(rightPupilTransformNode);

        bodyTransformNode.addChild(bodyScaleNode);
        leftEyeTransformNode.addChild(leftEyeScaleNode);
        rightEyeTransformNode.addChild(rightEyeScaleNode);
        leftPupilTransformNode.addChild(leftPupilScaleNode);
        rightPupilTransformNode.addChild(rightPupilScaleNode);

        bodyScaleNode.addChild(new GeometryNode(new Polygon(this.drawPlayer(this.mRadius), '#8A2BE2')));
        leftEyeScaleNode.addChild(new GeometryNode(new Polygon(this.drawEye(this.mRadius), '#FFFFFF'))); // 5
        rightEyeScaleNode.addChild(new GeometryNode(new Polygon(this.drawEye(this.mRadius), '#FFFFFF'))); // 5
        leftPupilScaleNode.addChild(new GeometryNode(new Polygon(this.drawEye(this.mRadius), '#000000'))); // 1
        rightPupilScaleNode.addChild(new GeometryNode(new Polygon(this.drawEye(this.mRadius), '#000000'))); // 1

        this.setNode(translationNode);
    }

    update(pDeltaTime) {
        let newPosition, newMatrix, newRotation;

        newPosition = this.getPosition().add(this.mVelocity.multiply(pDeltaTime));
        this.setPosition(newPosition);
        newMatrix = Matrix.createTranslation(newPosition);
        this.getNode().setMatrix(newMatrix);

        newMatrix = newMatrix.multiply(Matrix.createScale(this.mScale));
        this.getNode().setMatrix(newMatrix);

        newRotation = ((this.getRotation() + (this.getRotationRate() * pDeltaTime)));
        this.setRotation(newRotation);
        newMatrix = newMatrix.multiply(Matrix.createRotation(newRotation));
        this.getNode().setMatrix(newMatrix);
    }

    /**
     * Creates the vectors for the background drawing
     * @returns - An array of vectors
     */
    drawPlayer(pRadius) {
        let vectors = [];

        vectors = Polygon.drawRegularPolygon(20, 0, 0, pRadius);
        return vectors;
    }

    drawEye(pRadius) {
        let vectors = [];

        vectors = Polygon.drawRegularPolygon(20, 0, 0, pRadius);
        return vectors;
    }

}