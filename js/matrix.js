// TO DO:

/**
 * Class for the matrix object
 */
class Matrix {
    constructor(p00, p01, p02, p10, p11, p12, p20, p21, p22) {   

        this.mMatrix = []; // Array to store all the matrix values
        this.create2dArray(3, 3);
        this.setElement(0, 0, p00);
        this.setElement(0, 1, p01);
        this.setElement(0, 2, p02);
        this.setElement(1, 0, p10);
        this.setElement(1, 1, p11);
        this.setElement(1, 2, p12);
        this.setElement(2, 0, p20);
        this.setElement(2, 1, p21);
        this.setElement(2, 2, p22);
    }

    /**
     * Getter for the matrix member
     * @returns A 3D Array 
     */
    getArray() {
        return this.mMatrix;
    }

    /**
     * Allows setting the element of an array
     * @param {*} pRow - Row of the array you want to address
     * @param {*} pColumn - Column of the array you want to address 
     * @param {*} pValue - Value you would like to put in that slot
     */
    setElement(pRow, pColumn, pValue) {
        this.mMatrix[pRow][pColumn] = pValue;
    }

    /**
     * Returns the value of an input array slot
     * @param {*} pRow - Row of the array you want to address
     * @param {*} pColumn - Column of the array you want to address 
     * @returns The value in that array slot
     */
    getElement(pRow, pColumn) {
        return this.mMatrix[pRow][pColumn];
    }

    /**
     * Creates a 2D array based on 2 inputs, columns and rows
     * @param {*} pRowCount - Number of rows for the array
     * @param {*} pColumnCount - Number of columns for the array
     */
    create2dArray(pRowCount, pColumnCount) {
        for (let i = 0; i < pRowCount; i++) {
            this.mMatrix[i] = [];
            for (let j = 0; j < pColumnCount; j++) {
               this.mMatrix[i][j] = null; 
            }
        }
    }

    /**
     * Creates an identity matrix
     * @returns An identity matrix
     */
    static createIdentity() {
        return new Matrix(1, 0, 0, 0, 1, 0, 0, 0, 1);
    }

    /**
     * Creates a rotation matrix
     * @param {*} pScalar the scalar in radians for the rotation matrix
     * @returns A rotation matrix
     */
    static createRotation(pScalar) {
        return new Matrix(Math.cos(pScalar), -Math.sin(pScalar), 0, Math.sin(pScalar), Math.cos(pScalar), 0, 0, 0, 1);
    }

    /**
     * Creates a scale matrix based on an input vector
     * @param {*} pVector - The input vector to base the scale matrix on
     * @returns A scale matrix
     */
    static createScale(pVector) {
        let scaleMatrix;

        scaleMatrix = this.createIdentity();
        scaleMatrix.setElement(0, 0, pVector.getX());
        scaleMatrix.setElement(1, 1, pVector.getY());
        return scaleMatrix;
    }

    /**
     * Creates a translation matrix based on an input vector
     * @param {*} pVector - The input vector to base the translation matrix on
     * @returns A translation matrix
     */
    static createTranslation(pVector) {
        let translateMatrix;

        translateMatrix = this.createIdentity();
        translateMatrix.setElement(0, 2, pVector.getX());
        translateMatrix.setElement(1, 2, pVector.getY());
        return translateMatrix;
    }

    /**
     * Multiplies "this" by another matrix 
     * @param {*} pMatrix - The matrix to be multiplied with "this"
     * @returns A matrix which is the result of the multiplication
     */
    multiply(pMatrix) {
        let resultantMatrix = this.multiplyArrays(this.getArray(), pMatrix.getArray()); // Gets an array which is the product of multiplying two arrays

        return new Matrix(resultantMatrix[0][0], resultantMatrix[0][1], resultantMatrix[0][2], 
            resultantMatrix[1][0], resultantMatrix[1][1], resultantMatrix[1][2], 
            resultantMatrix[2][0], resultantMatrix[2][1], resultantMatrix[2][2]);
    }

    /**
     * Multiplies "this" by an input vector
     * @param {*} pVector - The vector to be used for the multiplication
     * @returns The vector which is the result of multiplying "this" with the input vector
     */
    multiplyVector(pVector) {
        let vectorToArray = [[pVector.getX()], [pVector.getY()], [pVector.getZ()]];
        let resultantVector = this.multiplyArrays(this.getArray(), vectorToArray);

        return new Vector(resultantVector[0][0], resultantVector[1][0], resultantVector[2][0]);
    }

    /**
     * Multiplies two arrays together
     * @param {*} pArray1 Array 1, represents "this"
     * @param {*} pArray2 The input matrix
     * @returns An array, the values represent the multiplication of two matrices
     */
    multiplyArrays(pArray1, pArray2) {
        let resultantMatrix = [];
        let tempSum;

        for (let rows = 0; rows < pArray1.length; rows++) {
            resultantMatrix[rows] = []; // Gives each row a new array to allow it to be 2D

            for (let columns = 0; columns < pArray1.length; columns++) {
                tempSum = 0; // Resets the the tempSum value

                for (let rowColumns = 0; rowColumns < pArray1[0].length; rowColumns++) { 
                    tempSum += pArray1[rows][rowColumns] * pArray2[rowColumns][columns]; // Takes the current row and column of Array 1 and 2, goes along them both linearly to multiply them both together
                }
                resultantMatrix[rows][columns] = tempSum;
            }
        }
        return resultantMatrix;
    }

    /**
     * Resets the current transform to the identity matrix, and then runs transform with the same arguments.
     * @param {*} pContext 
     */
    setTransform(pContext) {
        pContext.setTransform(this.getElement(0, 0), this.getElement(1, 0), this.getElement(0, 1), this.getElement(1, 1), this.getElement(0, 2), this.getElement(1, 2));
    }

    /**
     * Replaces the current transformation matrix. It multiplies the current transformation matrix with the matrix described by the transform parameters
     * @param {*} pContext 
     */
    transform(pContext) {
        pContext.transform(this.getElement(0, 0), this.getElement(1, 0), this.getElement(0, 1), this.getElement(1, 1), this.getElement(0, 2), this.getElement(1, 2));
    }

    /**
     * Alert function, displays all the matrix values in a 3x3 square
     */
    alert() {
        let outputString = "";

        // Goes through each row
        for (let rows = 0; rows < this.mMatrix.length; rows++) { 
            outputString += "\n";
            // Goes through each column per row
            for (let columns = 0; columns < this.mMatrix.length; columns++) {
                outputString += this.mMatrix[rows][columns] + " ";
            }
        }
        alert(outputString);
    }
}