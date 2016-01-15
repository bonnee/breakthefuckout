/*
TODO:
1. Mouse / keyboard control pad settings;
2. [DONE] Score managing:
3. [DONE] Initial "Press [button] to start" splash screen;
4. [NEARLY DONE] Level management via JSON files;
5. Difficulty settings (ball speed);
*/

var container;
var ball;
var ballSpdX;
var ballSpdY;
var pad;
var running = false;
var over = false;
var score = 0;
var divisorCollision = 5;
var lives = 3;
var level;
var audioCollisionPad = new Audio("resources/audio/collision.mp3");

var sound = new Howl({
    urls: ["resources/audio/collision.mp3"]
});

var movePadDefault = 10;
var movePadIncreaser = 1.1;  // set the pixel increase every time the pad is moving. giving the pad acceleration while key that move pad is pressed
var movePad = movePadDefault;

var aKey = keyboard(65);
var dKey = keyboard(68);
var mKey = keyboard(77);
var spaceKey = keyboard(32);
var debugkey = false;
var nRefresh = keyboard(78);
var enterKey = keyboard(13);
var aPressed = false;
var dPressed = false;
var enterPressed = false;
var waitingForEnter = false;

var width = 919, height = 768;
var logging = false;     //      Only for debug messages

function init() {
    console.log("game.js loaded");

    renderer = PIXI.autoDetectRenderer(width, height);

    container = new PIXI.Container();

    document.getElementById("renderer").appendChild(renderer.view);

    level = new Level();

    LoadObjects();
    updateLives();
    update();
}


function LoadObjects() {
    level.load(1);
    var i, l;
    for (i = 0, l = bricks.length; i < l; i++) {
        var b = bricks[i];
        b.x = parseInt(b.x);
        b.y = parseInt(b.y);
        b.width = parseInt(b.width);
        b.height = parseInt(b.height);
        b.score = parseInt(b.score);
        var wbTexture = PIXI.Texture.fromImage("resources/bricks/" + b.color);
        wb = new PIXI.Sprite(wbTexture);
        wb.position.x = b.x;
        wb.position.y = b.y;
        container.addChild(wb);
        b.sprite = wb;
    }

    //create pad
    var padTexture = PIXI.Texture.fromImage("resources/pad.png");
    pad = new PIXI.Sprite(padTexture);
    container.addChild(pad);
    pad.height = 23;

    //create ball
    var ballTexture = PIXI.Texture.fromImage("resources/ball.png");
    ball = new PIXI.Sprite(ballTexture);
    container.addChild(ball);
    ball.height = 23;

    Reset();
}

aKey.press = function () {
    //key object pressed
    aPressed = true;
};
aKey.release = function () {
    //key object released
    aPressed = false;
    movePad = movePadDefault;
};

dKey.press = function () {
    //key object pressed
    dPressed = true;
};

dKey.release = function () {
    //key object released
    dPressed = false;
    movePad = movePadDefault;
};

mKey.press = function () {
    debugkey = !debugkey;
    console.log("debugKey: " + debugkey);
    if(!debugkey)
        requestAnimationFrame(update);
}

mKey.release = function () {
}

spaceKey.press = function () {
    if (debugkey) {
        requestAnimationFrame(update);
    }
}

nRefresh.press = function () {
    location.reload();
}

enterKey.press = function () {
    //key object pressed
    enterPressed = true;
    if (!over && waitingForEnter) {
        Reset();
        Start();
        waitingForEnter = false;
    } else if (!over && !running) {
        Start();
    }
    else {
        Stop();
    }
};
enterKey.release = function () {
    //key object released
    enterPressed = false;
};

function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = function (event) {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
            if (logging)
                console.log(key.code + " pressed");
        }
        event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = function (event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener(
      "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
      "keyup", key.upHandler.bind(key), false
    );
    return key;
}

function Start() {
    document.getElementById("overlay").style.display = 'none';
    running = true;
    document.getElementById("tips").innerHTML = "Game running. Press Enter to pause.";
}

function Stop() {
    running = false;
    document.getElementById("tips").innerHTML = "Game paused. Press Enter to resume.";
}

function update() {
    if (running) {
        
        CheckCollisions();
        ball.position.x += ballSpdX;
        ball.position.y += ballSpdY;
        

        if (aPressed) {
            if (pad.position.x - movePad > 0) {
                pad.position.x -= movePad;
                movePad += movePadIncreaser;
            } else
                pad.position.x = 0;
        }
        if (dPressed) {
            if (pad.position.x + movePad < width - pad.width) {
                pad.position.x += movePad;
                movePad += movePadIncreaser;
            }
            else
                pad.position.x = width - pad.width;
        }

        renderer.render(container);

        if (over) {
            requestAnimationFrame(end);
        }
    }
    if (!debugkey)
        requestAnimationFrame(update);
}

function end() {
    running = false;
    if (bricks.length<=0)
        var endText = new PIXI.Text("You won but... The game is over man", { font: "50px Arial", fill: "white" });
    else
        var endText = new PIXI.Text("Game Over :(", { font: "50px Arial", fill: "white" });
    container.addChild(endText);
    endText.x = width / 2 - endText.width / 2;
    endText.y = height / 2 + 75;
    renderer.render(container);
}

function CheckCollisions() {
    var collisionX = false, collisionY = false;
    var blx = ball.position.x + ballSpdX;
    var bly = ball.position.y + ballSpdY;

    if (ballSpdY > 0 && ball.position.y + ball.height >= pad.position.y && (ball.position.x + ball.width > pad.position.x && ball.position.x < pad.position.x + pad.width)) {
        collisionY = true;
        ballSpdX = -((pad.position.x + (pad.width / 2)) - (ball.position.x + (ball.width / 2))) / divisorCollision;
        
        if (logging)
            console.log("Collision with pad");
    }

    for (var i = 0; i < bricks.length; i++) {
        var b = bricks[i];

        var hBounds = ball.position.x + ball.width > b.x && ball.position.x < b.x + b.width;
        var vBounds = ball.position.y + ball.height > b.y && ball.position.y < b.y + b.height;

        if (vBounds && ((blx + ball.width >= b.x && blx < b.x + b.width / 2)                   // Left Collision
                        || (blx <= b.x + b.width && blx + ball.width > b.x + b.width / 2))) {   // Right Collision

            bricks.splice(i, 1);
            container.removeChild(b.sprite);
            score += b.score;
            document.getElementById("score").innerHTML = score;
            collisionX = true;
            if (logging)
                console.log("hHit");
        }
        if (hBounds && ((bly + ball.height >= b.y && bly < b.y + b.width / 2)                  // Top Collision
            || (bly + ball.height > b.y && bly <= b.y + b.height / 2))) {                      // Bottom Collision

            bricks.splice(i, 1);
            container.removeChild(b.sprite);
            score += b.score;
            document.getElementById("score").innerHTML = score;
            collisionY = true;
            if (logging)
                console.log("vHit");
        }
    }

    if (blx + ball.width >= width) {
        collisionX = true;
        if (logging)
            console.log("Collision with right bound");
    }

    if (blx <= 0) {
        collisionX = true;
        if (logging)
            console.log("Collision with left bound");
    }

    if (bly <= 0) {
        collisionY = true;
        if (logging)
            console.log("Collision with top bound");
    }

    if (bly >= height - ball.height) {
        lives--;
        Stop();

        updateLives();

        waitingForEnter = true;
    }

    if (bricks.length == 0)
        over = true;

    if (collisionX) {
        ballSpdX = -ballSpdX;
        playAudio();
    }
    if (collisionY) {
        ballSpdY = -ballSpdY;
        playAudio();
    }
    if (lives <= 0)
        over = true;
}

function playAudio() {
    sound.play();
}

function updateLives() {
    document.getElementById("lives").innerHTML = "";
    for (var i = 0; i < lives; i++) {
        document.getElementById("lives").innerHTML += '<img class="life" src="resources/ball.png" />';
    }

    if (logging)
        console.log("Lives: " + lives);
}

function Reset() {
    //ballSpdX = 4;
    //ballSpdY = -5;
    ballSpdX = random(-5, 6); //random slope
    ballSpdY = -5;

    pad.position.x = width / 2 - pad.width / 2;
    pad.position.y = height - pad.height;

    ball.position.y = height - pad.height - ball.height;
    ball.position.x = width / 2 - ball.width / 2;
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function random(min, max) {
    return Math.random() * (max - min) + min;
}
