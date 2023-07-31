/**
 * Class for the meteor scene component
 */
class Meteor extends ObjectBase{
    constructor(pPosition, pScale, pAngle, pVelocity, pRotationRate, pScaleRate, pMass, pGravity, pFriction, pRadius) {
        super(pPosition, pScale, pAngle, pVelocity, pRotationRate,pScaleRate, pMass, pGravity, pFriction);
        this.setRadius(pRadius);
        this.setCollided(false);
        this.initialiseSceneGraph();
    }

    //#region Accessors
    setRadius(pRadius) {
        this.mRadius = pRadius;
    }
    getRadius() {
        return this.mRadius * this.mScale.getX(); // Bandaid fix for scaling issue
    }

    setCollided(pCollided) {
        this.mCollided = pCollided;
    }
    getCollided() {
        return this.mCollided;
    }
    //#end region

    /**
     * Initialises the scene graph for the meteor object
     */
    initialiseSceneGraph() {
        let translationNode, scaleNode, rotationNode;
        let crater1ScaleNode, crater2ScaleNode;
        let rockNode, crater1TranslationNode, Crater2TranslationNode;

        // Nodes for the drawable components
        rockNode = new TransformNode((Matrix.createTranslation(new Vector(0, 0, 1)))); // Draws 0, 0 relative to the origin of the meteor, which is set in a previous node
        crater1TranslationNode = new TransformNode((Matrix.createTranslation(new Vector(10, 0, 1))));
        Crater2TranslationNode = new TransformNode((Matrix.createTranslation(new Vector(-10, 0, 1))));

        crater1ScaleNode = new TransformNode((Matrix.createScale(new Vector(0.25, 0.25, 1))));
        crater2ScaleNode = new TransformNode((Matrix.createScale(new Vector(0.1, 0.1, 1))));

        // Transformation nodes for the entire Meteor
        translationNode = new TransformNode(Matrix.createTranslation(this.mPosition));
        scaleNode = new TransformNode(Matrix.createScale(this.mScale));
        rotationNode = new TransformNode(Matrix.createRotation(this.mAngle));

        // Graph creation
        translationNode.addChild(rotationNode);
        rotationNode.addChild(scaleNode);

        scaleNode.addChild(rockNode);
        scaleNode.addChild(crater1TranslationNode);
        scaleNode.addChild(Crater2TranslationNode);

        crater1TranslationNode.addChild(crater1ScaleNode);
        Crater2TranslationNode.addChild(crater2ScaleNode)

        rockNode.addChild(new GeometryNode(new Polygon(this.drawMeteor(this.mRadius), '#606060')));
        crater1ScaleNode.addChild(new GeometryNode(new Polygon(this.drawCrater(this.mRadius), '#BEBEBE')));
        crater2ScaleNode.addChild(new GeometryNode(new Polygon(this.drawCrater(this.mRadius), '#BEBEBE')));
        
        this.setNode(translationNode);
    }

    /**
     * Updates the properties of the meteor based on deltatime, Override of the objectBase version
     * @param {*} pDeltaTime - The current deltatime
     * @param pCircle - The circle to collide with
     * @param pPlayer - The player to collide with
     */
    update(pDeltaTime, pCircle, pPlayer, pSquare, pMeteors) {
        let newPosition, newMatrix, newScale, newRotation;

        this.setCollided(false);

        // Test code, fixes issue where the z value of some position change causing collisions to break
        this.mPosition.setZ(1);
        console.log(this.mPosition.getZ());

        let oldPosition = this.getPosition();
        newMatrix = Matrix.createTranslation(oldPosition);

        // Calculates the new velocity using resultant forces
        this.generateVelocity(pDeltaTime);
        newPosition = this.getPosition().add((this.mVelocity.multiply(pDeltaTime)));

        if (this.checkCircleCollision(pCircle, newPosition)) {
            this.CollisionResponse(pCircle, oldPosition, 1, pDeltaTime);
            this.setCollided(true);
        }
        else if (this.checkCircleCollision(pPlayer, newPosition)) {
            this.CollisionResponse(pPlayer, oldPosition, 1, pDeltaTime);
            this.setCollided(true);
        }
        else if (this.checkAABCollision(pSquare, newPosition)) {
            this.CollisionResponse(pSquare, oldPosition, 1, pDeltaTime);
            this.setCollided(true);
        }
        else {
            for (let i = 0; i < pMeteors.length; i++) {
                if (this.checkCircleCollision(pMeteors[i], newPosition) && pMeteors[i] !== this) {
                    this.CollisionResponse(pMeteors[i], oldPosition, 1, pDeltaTime);
                    this.setCollided(true);
                }
            }
        }

        if (this.getCollided() === false) {
            this.setPosition(newPosition);
            newMatrix = Matrix.createTranslation(newPosition);
            this.getNode().setMatrix(newMatrix);
        }

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
     * Calculates the collision normal and applies it to the collided object
     * @param pObject - The circle you want to collide with
     * @param pPosition - The position you want to collide relative to
     * @param pMultiplier - The collision response multiplier
     * @param pDeltaTime - DeltaTime
     * @constructor
     */
    CollisionResponse(pObject, pPosition, pMultiplier, pDeltaTime) {
        let difference = pPosition.subtract(pObject.getPosition());
        let distance = difference.magnitude();
        let normal = difference.normalise();

        // V = U + 2 * N * ( -N.U )
        let dotNormal = normal.dotProduct(this.getVelocity());
        let minusDotNormal = dotNormal * -1;
        let newVel = this.getVelocity().add(normal.multiply(minusDotNormal).multiply(2));

        this.setVelocity(newVel.add(pObject.getVelocity()));
        pPosition = this.getPosition().add((this.mVelocity.multiply(pDeltaTime)));
        this.setPosition(pPosition);

        // Implement coefficient of restitution for more accurate response
        // On each collision the object loses energy
        // Like a ball bouncing
        //console.log("Collision");
    }

    /**
     * Checks for circle collision by getting the distance between the circles and checking if that is smaller than the sum of the radii
     * @param pCircle - The circle to check collision with
     * @param pNewPosition - The next position of this
     * @returns {boolean} - True or false depending on collision
     */
    checkCircleCollision(pCircle, pNewPosition) {
        let difference = pNewPosition.subtract(pCircle.getPosition());
        let magnitude = difference.magnitude();
        let sumOfRadii = pCircle.getRadius() + this.getRadius();

        let collisionBool = magnitude < sumOfRadii;
        return collisionBool;
    }

    /**
     * Checks if a circle collides with an axis alligned box
     * @param pSquare - The square to collide with
     * @param pNewPosition - The new position
     * @returns {boolean} - True or false depending on collision
     */
    checkAABCollision(pSquare, pNewPosition) {
        // Calculates the distance between the two objects
        let difference = pNewPosition.subtract(pSquare.getPosition());
        let distance = difference.magnitude();

        // If the distance between them is less that half of the square size, they are colliding
        if (distance <= (pSquare.getWidth() / 2)) {
            return true
        }
        if (distance <= (pSquare.getHeight() / 2)) {
            return true
        }

        // Compares the distance between the position of both objects using the hypotenuse
        let hypotenuse = (distance - pSquare.getWidth() / 2) * (distance - pSquare.getWidth() / 2) + (distance - pSquare.getHeight() / 2) * (distance - pSquare.getHeight() / 2);
        return hypotenuse <= (this.getRadius() * this.getRadius());
    }

    checkNonAABCollision(pSquare, pNewPosition) {
        // Use 4 line segments as it would be easier
        // Check collision for each segment

        // Could also take all four points of the square object
        // Rotate them, vector.Rotate(pSquare.getAngle())?
        // Use those points as the collision bounds
    }

    checkLineSegmentCollison(pLineSegment, pNewPosition) {
        // Use line points
        // Direction unit vector
        // Line length
        // Distance from line to circle
        // If collision with line, check if collision happened within segment
    }


    /**
     * Generates an array of vectors which correspond to a regular polygon which draws the main body of the meteor
     * @returns - An array of vectors
     */
    drawMeteor(pRadius) {
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