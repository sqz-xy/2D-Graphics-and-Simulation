/**
 * Class for the polygon object, a polygon is drawn based on an array of vectors passed in at construction
 */
class Polygon {
    constructor (pVectors, pColour) {
        this.setVectors(pVectors);
        this.setColour(pColour);
    }

    //#region Accessors

    getVectors() {
        return this.mVectors;
    } 

    setVectors(pVectors) {
        this.mVectors = pVectors;
    }

    getColour() {
        return this.mColour;
    }

    setColour(pColour) {
        this.mColour = pColour;
    }

    //#endregion

    /**
     * Draws a polygon based on the array of vectors within the object
     * @param {*} pContext - The current canvas context
     */
    drawPolygon(pContext) {
        //pMatrix.setTransform(pContext);
       
        pContext.fillStyle = this.mColour;
        pContext.strokeStyle = "#000000";

        pContext.beginPath();

        pContext.moveTo(this.mVectors[0].getX(), this.mVectors[0].getY());

        for (let i = 1; i < this.mVectors.length; i++) {
            pContext.lineTo(this.mVectors[i].getX(), this.mVectors[i].getY());
        }

        pContext.closePath();

        pContext.fill();
        pContext.stroke();
    }

    /**
     * Generates an array of vectors that represent the vertices of a regular polygon
     * @param {*} pNumSegments - Number of segments you want the polygon to have
     * @param {*} pCenterX - The centre x coordinate of the polygon
     * @param {*} pCenterY - The centre y coordinate of the polygon
     * @param {*} pRadius - Radius of the polygon
     * @returns 
     */
    static drawRegularPolygon(pNumSegments, pCenterX, pCenterY, pRadius) {
        let anglePerSegment = Math.PI * 2 / pNumSegments;
        let angle, x, y;
        let vectors = [];
        
        for (let i = 0; i <= pNumSegments; i++) {
            angle = anglePerSegment * i;
            x = pCenterX + pRadius * Math.cos(angle);
            y = pCenterY + pRadius * Math.sin(angle);
            vectors.push(new Vector(x, y, 1));
        }
        return vectors;
    }

    /**
     * Calls the polygon draw methods
     * @param {*} pContext - The current canvas context
     */
    draw(pContext) {
        this.drawPolygon(pContext);
    }


}