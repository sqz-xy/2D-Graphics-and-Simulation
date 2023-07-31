/**
 * A base class to reduce the amount of code I need to write when making new objects
 */
class ObjectBase {
    constructor(pPosition, pScale, pAngle, pVelocity, pRotationRate, pScaleRate, pMass, pGravity, pFriction) {
        this.setPosition(pPosition);
        this.setScale(pScale);
        this.setAngle(pAngle);
        this.setVelocity(pVelocity);
        this.setRotationRate(pRotationRate);
        this.setScaleRate(pScaleRate);
        this.setStartPos(pPosition);
        this.setMass(pMass);
        this.setGravity(pGravity);
        this.setFriction(pFriction);
        if (this.constructor === ObjectBase) {
            throw new Error("Abstract classes can't be instantiated");
        }
    }

    setFriction(pFriction) {
        this.mFriction = pFriction;
    }
    getFriction() {
        return this.mFriction;
    }

    getGravity() {
        return this.mGravity;
    }
    setGravity(pGravity) {
        this.mGravity = pGravity;
    }

    getMass() {
        return this.mMass;
    }
    setMass(pMass) {
        let avgScale = (this.mScale.mX + this.mScale.mY / 2)
        this.mMass = pMass * avgScale;
    }

    getStartPos() {
        return this.mStartPos;
    }
    setStartPos(pStartPos) {
        this.mStartPos = pStartPos;
    }

    getScaleRate() {
        return this.mScaleRate;
    }
    setScaleRate(pScaleRate) {
        this.mScaleRate = pScaleRate;
    }

    getRotationRate() {
        return this.mRotationRate;
    }
    setRotationRate(pRotationRate) {
        this.mRotationRate = pRotationRate;
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

    getScale() {
        return this.mScale;
    }
    setScale(pScale) {
        this.mScale = pScale;
    }

    getAngle() {
        return this.mAngle;
    }
    setAngle(pAngle) {
        this.mAngle = pAngle;
    }

    getNode() {
        return this.mTransformNode;
    }
    setNode(pTransformNode) {
        this.mTransformNode = pTransformNode;
    }
    //#endregion

    initialiseSceneGraph() { }


    /**
     * Updates the properties of the meteor based on deltatime
     * @param {*} pDeltaTime - The current deltatime
     */
    update(pDeltaTime) {
        let newPosition, newMatrix, newScale, newRotation;

        // Calculates the new velocity using resultant forces
        this.generateVelocity(pDeltaTime);

        newPosition = this.getPosition().add((this.mVelocity.multiply(pDeltaTime)));
        this.setPosition(newPosition);
        newMatrix = Matrix.createTranslation(newPosition);
        this.getNode().setMatrix(newMatrix);

        newScale = this.getScale().add(this.mScaleRate.multiply(pDeltaTime));
        this.setScale(newScale);
        newMatrix = newMatrix.multiply(Matrix.createScale(newScale));
        this.getNode().setMatrix(newMatrix);

        newRotation = ((this.getAngle() + (this.mRotationRate * pDeltaTime)));
        this.setAngle(newRotation);
        newMatrix = newMatrix.multiply(Matrix.createRotation(newRotation));
        this.getNode().setMatrix(newMatrix);
    }
    /**
     * Generates the velocity by calculating the acceleration and multiplying it by deltatime
     * @param pDeltaTime - The current delta time
     * @returns {Vector} - A velocity vector
     */
    generateVelocity(pDeltaTime) {

        // Improved Euler Integration
        // Its a simple and direct method of integration
        // Although its less accurate and numerically unstable
        // Chose it because its faster to implement and Im not aiming for 100% accurate physics
        // Just believable physics, so discrepancies dont matter as much.
        // Could have used Heuns method which is much more accurate as it was built on top of eulers method

        let velocity;
        let resultantForce = this.generateResultantForce();

        let acceleration = (resultantForce.divide(this.getMass()));
        acceleration = acceleration.multiply(pDeltaTime);

        velocity = (this.mVelocity.add(acceleration));

        //console.log(velocity.getY(), + "  " + this.mPosition.getY() + " " + velocity.getZ());

        this.setVelocity(velocity);
    }

    /**
     * Calculates the resultant force of the object
     * @returns {*} - A force vector
     */
    generateResultantForce() {
        let force = this.generateFriction().add(this.mGravity);
        return force;
    }

    /**
     * Generates the friction of the object using the friction coefficient
     * @returns {Vector} - A Friction force vector
     */
    generateFriction() {
        let speed = this.getVelocity().magnitude();
        let friction = (this.getVelocity().multiply(-this.getFriction())).multiply(speed);
        return friction;
    }
}