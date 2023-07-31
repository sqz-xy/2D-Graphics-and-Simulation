
/** To Do:
 * Static helper class?
 * stars, bezier curve
 * More Refactoring
 * Remove meteors which go beyond a certain X and -X position to improve performance more
/** Physics
 * Acceleration = Resultant Force / Mass
 * Velocity = Acceleration x Time
 */

// The window load event handler
function onLoad(){

    //#region Global Variables

    let mainCanvas, mainContext, origin, matrix, rootNode, background, ground, player, visitor, alignedSquare, line, unalignedSquare, circle
    let thisTime, deltaTime, lastTime, fps, mouseX, mouseY;
    let minVelocity = 200, maxVelocity = 250; //50, 100 // What is going on here
    let meteors = [];
    let frameCount = 0;
    let paused = false;
    let lives = 3;
    let totalSeconds = 0;

    const maxMeteors = 25; // Sets a maximum limit for the amount of meteors, 25

    const playerMass = 10;
    const meteorMass = 10;
    const wallMass = Number.MAX_SAFE_INTEGER;

    let gravity = new Vector(0, 2000, 0);
    let fricCoef = 0.05

    //#endregion

    //#region Main Functions (Canvas Initialization, draw, etc...)

    // This function will initialize our variables
    function initialiseCanvasContext() {
        // Find the canvas element using its id attribute.
        mainCanvas = document.getElementById('mainCanvas');

        // Event listener to get mouse position
        mainCanvas.addEventListener('mousemove', mousePos, false);

        // Event listener for testing clicks
        mainCanvas.addEventListener('click', onClick, false);

        // if it couldn't be found
        if (!mainCanvas){
            // make a message box pop up with the error.
            alert('Error: I cannot find the canvas element!');
            return;
        }
        // Get the 2D canvas context.
        mainContext = mainCanvas.getContext('2d', {alpha: false});
        if (!mainContext) {
            alert('Error: failed to get context"');
            return;
        }

        mainContext.lineWidth = "2";

        // Initialises all objects for the scene graph
        InitialiseSceneGraph();

        lastTime = Date.now();
    }

    /**
     * Sets up the canvas and draws objects onto the canvas
     */
     function draw() {
        // Initializes a new visitor with the current context
        visitor = new RenderVisitor(mainContext);
        // Visits the root node
        visitor.visit(rootNode);


        // Sets the transform to the origin before drawing text.
        matrix.setTransform(mainContext);
        drawText();
    }

    /**
     * Updates the state of objects on the canvas
     */
    function update(pDeltaTime) {
        frameCount++;
        resetMeteorPos(400);
        flipPlayerPos();
        player.update(pDeltaTime);

        alignedSquare.update(pDeltaTime);
        // Updates all the meteors
        for (let z = 0; z < meteors.length; z++) {
            meteors[z].update(pDeltaTime, circle, player, alignedSquare, meteors);
        }

        checkWallCollision();
        matrix.setTransform(mainContext);

        // Resets the frameCount to 0 once it hits 60
        if (frameCount === 1000) {
            frameCount = 0;
            if (meteors.length !== maxMeteors) {
                generateMeteors(1); // Change back to 1
                addMeteors();
            }
        }

        // Calculates and rounds the fps
        fps = 1/pDeltaTime;
        fps = Math.round(fps);
    }

    /**
     * Calculates delta time, calls draw and runs through again recursively
     */
    function animationLoop() {
        thisTime = Date.now();
        deltaTime = (thisTime - lastTime) / 1000;

        if (!paused) {
            update(deltaTime);
        }
        draw();
        lastTime = thisTime;
        requestAnimationFrame(animationLoop);
    }

    /**
     * Draws text to the canvas
     */
    function drawText() {
        // Text drawing
        mainContext.fillStyle = '#FFFFFF';
        mainContext.font = "30px IMPACT";

        mainContext.fillText("FPS: " + fps, -400, -275);
        mainContext.fillText("Mouse X: " + mouseX, -250, -275);
        mainContext.fillText("Mouse Y: " + mouseY, -250, -245);
        mainContext.fillText("Meteor Count: " + meteors.length, 10, -275);
        //mainContext.fillText("Gravity: " + gravity.getY(), 10, -245);
        mainContext.fillText("Lives: " + lives, 250, -275);
    }

    /**
     * Initialises the scene graph
     * @constructor
     */
    function InitialiseSceneGraph() {
        // Walls don't update so changing these wont make a difference
        ground = new Quadrilateral(new Vector(0, 290, 1), new Vector(1, 1, 1), 0, new Vector(0, 0, 1), 0, new Vector(0, 0, 1), wallMass, gravity, fricCoef, true, 800, 25);
        alignedSquare = new Quadrilateral(new Vector(-50, 0, 1), new Vector(1, 1, 1), 0, new Vector(0, 0, 1), 0, new Vector(0, 0, 1), wallMass, gravity, fricCoef, true, 40, 40);
        unalignedSquare = new Quadrilateral(new Vector(50, 0, 1), new Vector(1, 1, 1), 0.785398, new Vector(0, 0, 1), 0, new Vector(0, 0, 1), wallMass, gravity, fricCoef, true, 40, 40);

        circle = new Circle(new Vector(150, 0, 1), new Vector(1, 1, 1), 0, new Vector(0, 0, 1), 0, new Vector(0, 0, 1), wallMass, gravity, fricCoef, 30);

        line = new Line(new Vector(-150, 0, 1), new Vector(1, 1, 1), 0.785398, new Vector(0, 0, 1), 1, new Vector(0, 0, 1), wallMass, gravity, fricCoef, true, 100);

        background = new Background(new Vector(400, 300, 1), generateBackgroundGradient());

        player = new Player(new Vector(0, 275, 1), new Vector(0, 0, 1), Math.PI, 0, new Vector(1, 1, 0), playerMass, gravity, fricCoef);

        // Creates a translation matrix about the origin
        origin = new Vector(mainCanvas.width * 0.5, mainCanvas.height * 0.5);
        matrix = Matrix.createTranslation(origin);

        // Adds all the scene components to the scene graph including all the generated meteors,
        // initially in the order of drawing, background as the first to be drawn.

        // Root node using origin matrix
        rootNode = new TransformNode(matrix);

        // Nodes for all components
        rootNode.addChild(background.getNode());
        rootNode.addChild(ground.getNode());
        rootNode.addChild(player.getNode());
        rootNode.addChild(alignedSquare.getNode());
        rootNode.addChild(line.getNode());
        rootNode.addChild(unalignedSquare.getNode());
        rootNode.addChild(circle.getNode());

        // Generates the meteors and adds them to the array of meteors
        generateMeteors(15);
        addMeteors();
    }

    //#endregion

    //#region Utility Functions


    /**
     * Checks for collision with the bounds of the screen
     */
    function checkWallCollision() {
        for (let i = 0; i < meteors.length; i++) {
            if (meteors[i].getPosition().getX() + meteors[i].getRadius() >= mainCanvas.width / 2) {
               meteors[i].setVelocity(new Vector(-meteors[i].getVelocity().getX(), meteors[i].getVelocity().getY(), 1))
            }
           else if (meteors[i].getPosition().getX() - meteors[i].getRadius() <= -mainCanvas.width / 2) {
               meteors[i].setVelocity(new Vector(-meteors[i].getVelocity().getX(), meteors[i].getVelocity().getY(), 1))
           }
           else if (meteors[i].getPosition().getY() + meteors[i].getRadius() >= mainCanvas.height / 2 - 20) { // Fix for bouncing off floor
              meteors[i].setVelocity(new Vector(meteors[i].getVelocity().getX(), -meteors[i].getVelocity().getY(), 1))
           }
           else if (meteors[i].getPosition().getY() - meteors[i].getRadius() <= -mainCanvas.height / 2) {
                meteors[i].setVelocity(new Vector(meteors[i].getVelocity().getX(), -meteors[i].getVelocity().getY(), 1))
           }
        }
    }

    // Could make these static to be used elsewhere such as in the update classes of objects

    /**
     * Generates a random number between 2 values
     * @param {*} pMin - The minimum random number
     * @param {*} pMax - The maximum random number
     * @returns - A random integer
     */
    function generateRandomBetween(pMin, pMax) {
        return (Math.random() * (pMax - pMin) + pMin)
    }

    /**
     * Generates a random number with a random chance of it being positive or negative
     * @param pMin - The minimum value
     * @param {*} pMax - The maximum value of the number
     * @returns A positive or negative integer
     */
    function generateRandomPosOrNeg(pMin, pMax) {
        const pos_or_neg = [1, -1]
        let value = generateRandomBetween(pMin, pMax);
        return value * pos_or_neg[Math.floor(Math.random() * 2)];
    }

    /**
     * Returns an object which contains all the random vectors for meteor creation
     * @returns {{rotationRate: *, scale: Vector, angle: number, velocity: Vector, translate: Vector}} - An object consisting of multiple vectors
     */
    function generateRandomVectors() {
        let scaleValue = generateRandomBetween(0.5, 1);
        return {
            translate: new Vector(generateRandomPosOrNeg(0, 375), -generateRandomBetween(250, 270), 1),
            scale: new Vector(scaleValue, scaleValue, 1),
            angle: Math.PI / generateRandomBetween(1, 10),
            velocity: new Vector(generateRandomPosOrNeg(minVelocity, maxVelocity), generateRandomBetween(minVelocity, maxVelocity), 1),
            rotationRate: generateRandomBetween(1, 10)
        };
    }


    /**
     * Generates a random amount of meteors between 30 and 70 with random other values
     */
    function generateMeteors(pCount) {
        for(let i = 0; i < pCount; i++) {
            let randomVectors = generateRandomVectors();

            meteors.push(new Meteor(
                randomVectors.translate,
                randomVectors.scale,
                randomVectors.angle,
                randomVectors.velocity,
                randomVectors.rotationRate,
                new Vector(0, 0, 1),
                meteorMass,
                gravity,
                fricCoef,
                20));
        }
    }

    /**
     * Generates an input amount of random meteors on click
     */
    function generateMeteorOnClick(pCount, pMouseX, pMouseY) {
        for(let i = 0; i < pCount; i++) {
            let randomVectors = generateRandomVectors(), translate = new Vector(pMouseX, pMouseY, 1);
            meteors.push(new Meteor(
                translate,
                randomVectors.scale,
                randomVectors.angle,
                randomVectors.velocity,
                randomVectors.rotationRate,
                new Vector(0, 0, 1),
                meteorMass,
                gravity,
                fricCoef,
                20));
        }
    }

    /**
     * Adds all meteors in the meteor array as children to the root node
     */
    function addMeteors() {
        for (let j = 0; j < meteors.length; j++) {
            rootNode.addChild(meteors[j].getNode());
        }
    }

    /** (Not currently Used, but kept just in case)
     * removes meteors which drop below a specified Y limit
     * @param {*} pYLimit - The minimum position meteors can be before they are deleted
     */
    function removeMeteors(pYLimit) {
        // Removed meteors which dip below y:400 to preserve performance
        for (let k = 0; k < meteors.length; k++)
        {
            if (meteors[k].getPosition().getY() > pYLimit)
            {
                meteors.splice(meteors.indexOf(meteors[k]), 1);
            } 
        }
    }

    /**
     * resets the position of meteors which drop below a specified Y limit, gives them random values again
     * @param pYLimit
     */
    function resetMeteorPos(pYLimit) {
        // Resets the position of meteors which go below a specified Y value to preserve performance.
        let randomVectors = generateRandomVectors();
        for (let k = 0; k < meteors.length; k++)
        {
            // Gives the meteor another set of random values
            if (meteors[k].getPosition().getY() > pYLimit)
            {
                meteors[k].setPosition(randomVectors.translate);
                meteors[k].setScale(randomVectors.scale);
                meteors[k].setAngle(randomVectors.angle);
                meteors[k].setVelocity(randomVectors.velocity);
                meteors[k].setRotationRate(randomVectors.rotationRate);
            }
        }
    }

    /**
     * Flips the player position to the other side of the canvas if they go out of bounds
     */
    function flipPlayerPos() {
        let playerX = player.getPosition().getX();
        let playerY = player.getPosition().getY();
        let xLimit = (mainCanvas.width * 0.5) + 10; // +20 allows for a smoother transition (completely arbitrary)

        if (playerX > xLimit) {
            player.setPosition(new Vector(-xLimit, playerY, 1));
        }
        else if (playerX < -xLimit) {
            player.setPosition(new Vector(xLimit, playerY, 1));
        }
    }

    /**
     * Generates background gradient
     */
    function generateBackgroundGradient() {
        // Gradient starts at -320 (0) and ends at +320 (1)
        let gradient = mainContext.createLinearGradient(0, -320, 0, 320);
        gradient.addColorStop(0, '#000000');
        gradient.addColorStop(1, '#00ace6');
        return gradient;
    }

    /**
     * Calculates the rotation rate of an object
     * @param pVelocity - The velocity of the object
     * @param pRadius - The radius of the object
     * @param pDivisor - An arbitrary divisor to add an offset, use 1 if you want true rate
     * @returns {number} - The rotation rate of the objects
     */
    function getRotationRate(pVelocity, pRadius, pDivisor) {
        return (pVelocity / pRadius) / pDivisor; // Radius uses is currently not calculated mathematically, just using player polygon radius
    }

    //#endregion

    //#region Event Listeners and related functions

    /*
     * Tracks the mouse position constantly
     */
    function mousePos(pEvent) {
        let rect = pEvent.target.getBoundingClientRect();
        mouseX = Math.round((pEvent.clientX - rect.left) - mainCanvas.width / 2) + 1;
        mouseY = Math.round((pEvent.clientY - rect.top) - mainCanvas.height / 2) + 1;
    }

    /*
     * Generates a meteor on click position
     */
    function onClick() {
        generateMeteorOnClick(1, mouseX, mouseY);
        addMeteors();
    }

    window.addEventListener("keydown", (pEvent) => {
        let keyCode = pEvent.code;

        // Pauses the canvas by stopping updates
        if (keyCode === 'KeyQ') {
            paused = !paused;
        }

        // Moves the player right
        if(keyCode === 'KeyD') {
            let xVelocity = 400;
            player.setVelocity(new Vector(xVelocity, 0, 1));
            player.setRotationRate(getRotationRate(xVelocity, 15, 2));
        }

        // Moves the player left
        if(keyCode === 'KeyA') {
            let xVelocity = -400;
            player.setVelocity(new Vector(xVelocity, 0, 1));
            player.setRotationRate(getRotationRate(xVelocity, 15, 2));
        }
    }); 

    window.addEventListener("keyup", (pEvent) => {
        let keyCode = pEvent.code;

        // Stops the player movement
        if(keyCode === 'KeyD') {
            player.setVelocity(new Vector(0, 0, 1));
            player.setRotationRate(0);
        }

        // Stops the player movement
        if(keyCode === 'KeyA') {
            player.setVelocity(new Vector(0, 0, 1));
            player.setRotationRate(0);
        }
    }); 

    //#endregion

    // Function Calls
    initialiseCanvasContext();
    animationLoop();
}
// Event listener to listen for page loading
window.addEventListener('load', onLoad, false);