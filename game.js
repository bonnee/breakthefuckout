/*
  ____                 _ _______ _          ______          _     ____        _   
 |  _ \               | |__   __| |        |  ____|        | |   / __ \      | |  
 | |_) |_ __ ___  __ _| | _| |  | |__   ___| |__ _   _  ___| | _| |  | |_   _| |_ 
 |  _ <| '__/ _ \/ _` | |/ / |  | '_ \ / _ \  __| | | |/ __| |/ / |  | | | | | __|
 | |_) | | |  __/ (_| |   <| |  | | | |  __/ |  | |_| | (__|   <| |__| | |_| | |_ 
 |____/|_|  \___|\__,_|_|\_\_|  |_| |_|\___|_|   \__,_|\___|_|\_\\____/ \__,_|\__|
                                                                                  
                                                                                  */

var container;
var ball;
var ballSpdX;
var ballSpdY;
var pad;
var runningState = { running: 0, paused: 1, lose: 2, over: 3, waiting: 4 }
var state;
var score = 0;
var divisorCollision = 5;
var lives = 3;
var level;

var brickSnd = new Howl({ urls: ["resources/audiofiles/brick.wav"] });
var wallSnd = new Howl({ urls: ["resources/audiofiles/wall.wav"] });
var overSnd = new Howl({ urls: ["resources/audiofiles/over.mp3"] });
var sound = new Howl({ urls: ["resources/audio/collision.wav"] });

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

var width = 919, height = 768;
var logging = true;     //      Only for debug messages

function init() {
    console.log("game.js loaded");

    renderer = PIXI.autoDetectRenderer(width, height);
    container = new PIXI.Container();
    document.getElementById("renderer").appendChild(renderer.view);

    level = new Level();
    state = runningState.waiting;

    LoadObjects();
    updateLives();
    update();
}


function LoadObjects() {
    level.load(1);
    var i, l;
    for (i = 0, l = bricks.length; i < l; i++) {
        var b = bricks[i];
        b.x = parseInt(b.x); b.y = parseInt(b.y); b.width = parseInt(b.width); b.height = parseInt(b.height); b.score = parseInt(b.score);
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
    pad.position.x = width / 2 - pad.width / 2;

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
    if (!debugkey)
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
    if (state == runningState.waiting || state == runningState.lose) {
        Reset();
        state = runningState.running;
        Start();
    } else if (state == runningState.paused) {
        state = runningState.running;
        Start();
    }
    else {
        state = runningState.paused;
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
    //state = runningState.running;
    document.getElementById("tips").innerHTML = "Game running. Press Enter to pause.";
}

function Stop() {
    //state = runningState.paused;
    document.getElementById("tips").innerHTML = "Game paused. Press Enter to resume.";
}

function update() {
    if (state == runningState.lose || state == runningState.running) {
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
    }
    if (state == runningState.running) {

        CheckCollisions();
        ball.position.x += ballSpdX;
        ball.position.y += ballSpdY;

    }
    renderer.render(container);

    if (state == runningState.over) {
        requestAnimationFrame(end);
    }

    if (!debugkey)
        requestAnimationFrame(update);
}

function end() {
    state = runningState.over;
    if (bricks.length == 0)
        var endText = new PIXI.Text("You won! Press N to restart the game", { font: "50px Arial", fill: "white" });
    else {
        overSnd.play();
        var endText = new PIXI.Text("Game Over :(", { font: "50px Arial", fill: "white" });
    }
    container.addChild(endText);
    endText.x = width / 2 - endText.width / 2;
    endText.y = height / 2 + 75;
    renderer.render(container);
}

function CheckCollisions() {
    var collisionX = false, collisionY = false, isBrick = true;
    var blx = ball.position.x + ballSpdX, bly = ball.position.y + ballSpdY;

    var hBounds = ball.position.x + ball.width > pad.position.x && ball.position.x < pad.position.x + pad.width;
    var vBounds = ball.position.y + ball.height > pad.position.y && ball.position.y < pad.position.y + pad.height;


    if (ballSpdY > 0 && hBounds && (ball.position.y + ball.height >= pad.position.y && ball.position.y < pad.position.y + pad.width / 2)) {
        ballSpdX = -((pad.position.x + (pad.width / 2)) - (ball.position.x + (ball.width / 2))) / divisorCollision;
        collisionY = true;
        isBrick = false;
        if (logging)
            console.log("Collision with pad");
    }


    for (var i = 0; i < bricks.length; i++) {
        var b = bricks[i];
        var boom = false;

        hBounds = ball.position.x + ball.width > b.x && ball.position.x < b.x + b.width;
        vBounds = ball.position.y + ball.height > b.y && ball.position.y < b.y + b.height;

        if (hBounds && ((bly + ball.height >= b.y && bly < b.y + b.width / 2)                  // Top Collision
            || (bly + ball.height > b.y && bly <= b.y + b.height / 2))) {                      // Bottom Collision

            boom = true;
            collisionY = true;
            if (logging)
                console.log("Vertical hit with block " + i);
        }

        if (vBounds && ((blx + ball.width >= b.x && blx < b.x + b.width / 2)                   // Left Collision
                    || (blx <= b.x + b.width && blx + ball.width > b.x + b.width / 2))) {      // Right Collision
            boom = true;
            collisionX = true;
            if (logging)
                console.log("Horizontal hit with block " + i);
        }
        if (boom)
            hit(i);
    }

    if (blx + ball.width >= width) {
        collisionX = true;
        isBrick = false;
        if (logging)
            console.log("Collision with right bound");
    }

    if (blx <= 0) {
        collisionX = true;
        isBrick = false;
        if (logging)
            console.log("Collision with left bound");
    }

    if (bly <= 0) {
        collisionY = true;
        isBrick = false;
        if (logging)
            console.log("Collision with top bound");
    }

    if (bly >= height) {
        lives--;
        Stop();
        state = runningState.lose;
        updateLives();
    }

    if (bricks.length == 0)
        state = runningState.over;

    if (collisionX || collisionY) {
        if (isBrick)
            brickSnd.play();
        else
            wallSnd.play();
    }

    if (collisionX) {
        ballSpdX = -ballSpdX;
    }
    if (collisionY) {
        ballSpdY = -ballSpdY;
    }
    if (lives <= 0)
        state = runningState.over;

}

function hit(i) {
    score += bricks[i].score;
    document.getElementById("score").innerHTML = score + "<span id=addPoints> +" + bricks[i].score + "</span>";
    scoreColor(bricks[i].score);
    container.removeChild(bricks[i].sprite);
    bricks.splice(i, 1);
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
    ballSpdX = random(-5, 6); //random slope
    ballSpdY = -5;

    pad.position.y = height - pad.height;

    ball.position.y = height - pad.height - ball.height;
    ball.position.x = pad.position.x + pad.width / 2 - ball.width / 2;
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function random(min, max) {
    return Math.random() * (max - min) + min;
}
function scoreColor(points) {
    console.log("+" + points + " points");

    $("#score").stop(true, true);

    $("#addPoints").animate({
        color: "red"
    }, 100);

    $("#addPoints").fadeOut("slow");

  
    $("#score").animate({
        color: "red"
    }, 100);

    $("#score").animate({
        color: "white"
    }, 300);
}
