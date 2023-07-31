/**
 * Class to generate the points for a bezier curve
 */
class BezierCurve {
    constructor (pVectorA, pVectorB, pVectorC, pVectorD, pVectorE) {
        this.mVectors = [];
        this.mVectors.push(pVectorA);
        this.mVectors.push(pVectorB);
        this.mVectors.push(pVectorC);
        this.mVectors.push(pVectorD);
        this.mVectors.push(pVectorE);
    }

    //#region Accessors

    /**
     * Returns the vectors
     * @returns The array of vectors 
     */
    getVectors() {
        return this.mVectors();
    }

    //#endregion

    /**
     * Removed vectors from the array starting at index 0 up to the passed in index
     * @param {*} pIndex - The index to splice upto
     */
    removeVectors(pIndex) {
        this.mVectors.splice(0, pIndex);
    }

    /**
     * Recursively interpolates between all the vectors in the array. 
     * Example: A, B, C, D, E will be interpolated between to give F, G, H, I to J, K, L to M, N and then returning a final vector
     * which is the interpolation between M and N
     * @returns A final interpolated vector
     */
    drawCurve() {
        let index;
        let vectorCount = this.mVectors.length;
        
        for (index = 1; index < vectorCount; index++) {
            this.mVectors.push(this.mVectors[index - 1].interpolate(this.mVectors[index], 0.5));
        }
        
        if (this.mVectors.length == 1) {
            return this.mVectors[0];
        }
        else {
            this.removeVectors(index);
            this.drawCurve();
        }   
    }
}