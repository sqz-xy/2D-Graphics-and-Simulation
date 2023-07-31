class Vector {
    constructor(pX, pY, pZ) {
        // Calls the setters and passes the constructor args into them
        this.setX(pX);
        this.setY(pY);
        this.setZ(pZ);
    }
    // Returns the X value of the vector
    getX() {
        return this.mX;
    }
    // Sets the X value of the vector to the constructor argument
    setX(pX) {
        this.mX = pX;
    }

    // Returns the Y value of the vector
    getY() {
        return this.mY;
    }
    // Sets the Y value of the vector to the constructor argument
    setY(pY) {
        this.mY = pY;
    }

    // Returns the Z value of the vector
    getZ() {
        return this.mZ;
    }

    // Sets the Z value of the vector to the constructor argument
    setZ(pZ) {
        this.mZ = pZ;
    }
        
    /**
     * Adds "this" to an input vector
     * @param {*} pVector - an input vector 
     * @returns A newly constructed vector which is the result of adding "this" to an input vector
     */
    add(pVector) {
        let outputX, outputY, outputZ, outputVector;

        outputX = this.mX + pVector.mX;
        outputY = this.mY + pVector.mY;
        outputZ = this.mZ + pVector.mZ;
        
        outputVector = new Vector(outputX, outputY, outputZ);
        return outputVector;
    }

    /**
     * Subtracts the parameter vector from "this"
     * @param {*} pVector - an input vector 
     * @returns A newly constructed vector which is the result of subtracting "this" from an input vector
     */
    subtract(pVector) {
        let outputX, outputY, outputZ, outputVector;

        outputX = this.mX - pVector.mX;
        outputY = this.mY - pVector.mY;
        outputZ = this.mZ - pVector.mZ;
        
        outputVector = new Vector(outputX, outputY, outputZ);
        return outputVector;
    }

    /**
     * Multiplies "this" by an input scalar value
     * @param {*} pScalar - an input scalar value
     * @returns A newly constructed vector which is the result of multiplying "this" with the input scalar
     */

    multiply(pScalar) {
        let outputX, outputY, outputZ, outputVector;

        outputX = this.mX * pScalar;
        outputY = this.mY * pScalar;
        outputZ = this.mZ * pScalar;
        
        outputVector = new Vector(outputX, outputY, outputZ);
        return outputVector;
    }

    /**
     * Divides "this" by an input scalar value
     * @param {*} pScalar - an input scalar value
     * @returns A newly constructed vector which is the result of dividing "this" by the input scalar
     */
    divide(pScalar) {
        let outputX, outputY, outputZ, outputVector;

        outputX = this.mX / pScalar;
        outputY = this.mY / pScalar;
        outputZ = this.mZ / pScalar;
        
        outputVector = new Vector(outputX, outputY, outputZ);
        return outputVector;
    }

    /**
     * Calculates and returns the magnitude of "this"
     * @returns A scalar value which represents the magnitude of "this"
     */
    magnitude() {
        let squareX, squareY, squareZ, outputMagnitude;

        squareX = Math.pow(this.mX, 2);
        squareY = Math.pow(this.mY, 2);
        squareZ = Math.pow(this.mZ, 2);

        outputMagnitude = Math.sqrt(squareX + squareY + squareZ);
        return outputMagnitude;
    }

    /**
     * Normalises "this"
     * @returns A newly constructed vector which is the result of normalising "this"
     */
    normalise() {
        let magnitude, normaliseX, normaliseY, normaliseZ, outputVector;
        magnitude = this.magnitude();

        normaliseX = this.mX / magnitude;
        normaliseY = this.mY / magnitude;
        normaliseZ = this.mZ / magnitude;
        
        outputVector = new Vector(normaliseX, normaliseY, normaliseZ);
        return outputVector;
    }

    /**
     * Limits the magnitude of "this" by an input scalar value
     * @returns Either a newly constructed vector which fits the constraint of the parameter or "this" (Unchanged)
     */
    limitTo(pScalar) {
        let unitVector, outputVector;
        if (this.magnitude() > pScalar) {
            unitVector = this.normalise();
            outputVector = unitVector.multiply(pScalar);
            return outputVector;
        }
        return this;
    }

    /**
     * Calculates the dot product of "this" and an input vector
     * @param {*} pVector - an input vector
     * @returns A scalar value which represents the dot product of "this" and an input vector
     */
    dotProduct(pVector) {
        return (this.mX * pVector.mX) + (this.mY * pVector.mY) + (this.mZ * pVector.mY);
    }

   /**
    * Interpolates between "this" and another input vector
    * @param {*} pVector - The vector you want to interpolate between
    * @param {*} pScalar - The distance along the line you want to interpolate too (Between 0 and 1)
    * @returns The resultant vector of interpolating between the "this" and the input based on the input scalar value
    */
    interpolate(pVector, pScalar) {
        let vectorBetween, interpolatedVector;

        vectorBetween = pVector.subtract(this);
        interpolatedVector = (vectorBetween.multiply(pScalar)).add(this);
        return interpolatedVector;
    }

    /**
     * Rotates "this" by an input scalar value
     * @param {*} pScalar - an input scalar value
     * @returns A newly constructed vector which is the result of rotating "this" by the input scalar
     */
    rotate(pScalar) {
        let newX, newY, rotatedVector;

        newX = (-Math.sin(pScalar) * this.mY) + (Math.cos(pScalar) * this.mX);
        newY = (Math.sin(pScalar) * this.mX) + (Math.cos(pScalar) * this.mY); 

        rotatedVector = new Vector(newX, newY, this.mZ);
        return rotatedVector;
    }
    
    /**
     * Calculates the angle between "this" and an input vector
     * @param {*} pVector - an input vector
     * @returns A vector which is the result of rotating "this" by a scalar value
     */
    angleBetween(pVector) {
        let dotProduct, angle, v1Magnitude, v2Magnitude;

        dotProduct = this.dotProduct(pVector);
        v1Magnitude = this.magnitude();
        v2Magnitude = pVector.magnitude();

        angle = Math.acos(dotProduct / (v1Magnitude * v2Magnitude));
        return angle;
    }
}