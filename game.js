/*
TODO:
1. Mouse / keyboard control pad settings;
2. [DONE] Score managing:
3. [DONE] Initial "Press [button] to start" splash screen;
4. [NEARLY DONE] Level management via JSON files;
5. Difficulty settings (ball speed);
*/

var stage;
var ball;
var ballSpdX = 4;
var ballSpdY = -5;
var pad;
var bricks;
var running = false;
var over = false;
var score = 0;
var divisorCollision = 5;
var life;

var movePadDefault = 10;
var movePadIncreaser = 1.1;  // set the pixel increase every time the pad is moving. giving the pad acceleration while key that move pad is pressed
var movePad = movePadDefault;

var aKey = keyboard(65);
var dKey = keyboard(68);
var enterKey = keyboard(13);
var aPressed = false;
var dPressed = false;
var enterPressed = false;

var width = 919, height = 768;
var logging = true;     //      Only for debug messages

function init() {
    life = 2;
    if (logging)
        console.log("game.js loaded");
    stage = new PIXI.Stage(0x66FF99);
    renderer = PIXI.autoDetectRenderer(
      width,
      height,
      { view: document.getElementById("game-canvas") }
    );

    document.getElementById("lives").innerHTML = life;

    LoadObjects();
    update();
}

//      Load a JSON file from specified URL
function JSONLoader(url) {
    var data;
    request = new XMLHttpRequest();
    request.open('GET', url, false);

    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            data = JSON.parse(request.responseText);
        } else {
            if (logging)
                console.log("Error loading bricks placement");
        }
    };

    request.onerror = function () {
    };

    request.send();
    return data;
}

function LoadObjects() {
    bricks = JSONLoader("levels/1.json");
    var i, l;
    for (i = 0, l = bricks.blocks.length; i < l; i++) {
        var b = bricks.blocks[i];
        b.x = parseInt(b.x);
        b.y = parseInt(b.y);
        b.width = parseInt(b.width);
        b.height = parseInt(b.height);
        b.score = parseInt(b.score);
        var wbTexture = PIXI.Texture.fromImage("../images/" + b.color + ".png");
        wb = new PIXI.Sprite(wbTexture);
        wb.position.x = b.x;
        wb.position.y = b.y;
        stage.addChild(wb);
        b.sprite = wb;
    }

    //create pad
    var padTexture = PIXI.Texture.fromImage("../images/pad.png");
    pad = new PIXI.Sprite(padTexture);
    stage.addChild(pad);
    pad.position.x = width / 2 - pad.width / 2;
    pad.position.y = height - 23;

    //create ball
    var ballTexture = PIXI.Texture.fromImage("../images/ball.png");
    ball = new PIXI.Sprite(ballTexture);
    stage.addChild(ball);
    ball.position.y = height - 23;
    ball.position.x = width / 2 - ball.width / 2;
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

enterKey.press = function () {
    //key object pressed
    enterPressed = true;
    if (!over && !running) {
        running = true;
        start();
    } else
        running = false;
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

function start() {
    document.getElementById("overlay").style.display = 'none';
}

function update() {
    if (running) {
        ball.position.x += ballSpdX;
        ball.position.y += ballSpdY;
        CheckCollisions();

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

        renderer.render(stage);

        if (over) {
            requestAnimationFrame(end);
        }
    }
    requestAnimationFrame(update);
}

function end() {
    running = false;
    var endText = new PIXI.Text("Game Over", { font: "50px Arial", fill: "white" });
    stage.addChild(endText);
    endText.x = width / 2 - endText.width / 2;
    endText.y = height / 2 + 75;
    renderer.render(stage);
}

function CheckCollisions() {
    var collisionX = false, collisionY = false;

    if (ballSpdY > 0 && ball.position.y + ball.height >= pad.position.y && (ball.position.x + ball.width > pad.position.x && ball.position.x < pad.position.x + pad.width)) {
        collisionY = true;
        ballSpdX = -((pad.position.x + (pad.width / 2)) - (ball.position.x + (ball.width / 2))) / divisorCollision;
        if (logging)
            console.log("Collision with pad");
    }
    for (var i = 0; i < bricks.blocks.length; i++) {
        var b = bricks.blocks[i];
        if ((ball.position.y <= b.y + b.height && ball.position.y + ball.height >= b.y) && (ball.position.x <= b.x + b.width && ball.position.x + ball.width >= b.x)) {
            bricks.blocks.splice(i, 1);
            stage.removeChild(b.sprite);
            score += b.score;
            document.getElementById("score").innerHTML = score;
            collisionY = true;
            if (logging)
                console.log("Collision with block " + i);
        }
    }

    if (ball.position.x + ball.width >= width) {
        ball.position.x = width - ball.width;
        collisionX = true;
        if (logging)
            console.log("Collision with right bound");
    }

    if (ball.position.x <= 0) {
        ball.position.x = 0;
        collisionX = true;
        if (logging)
            console.log("Collision with left bound");
    }

    if (ball.position.y <= 0) {
        ball.position.y = 0;
        collisionY = true;
        if (logging)
            console.log("Collision with top bound");
    }

    if (ball.position.y >= height - ball.height) {
        ball.position.y = height - ball.height;
        //over = true;
        life--;
        if (logging)
            console.log("Life:" + life);
        document.getElementById("lives").innerHTML = life;
        running = false;
        //reset ball speed, position and slope, put the ball on the pad
        ballSpdX = 4;
        ballSpdY = -5;
        ball.position.y = height - 46 + 1; //+1 cause you can see the ball on the pad, otherwise it look like as on object
        ball.position.x = width / 2 - ball.width / 2;

        //reset pad position
        pad.position.x = width / 2 - pad.width / 2;
        pad.position.y = height - 23;
    }
    if (bricks.blocks.length == 0)
        over = true;

    if (collisionX)
        ballSpdX = -ballSpdX;
    if (collisionY)
        ballSpdY = -ballSpdY;
    if (life <= 0) {
        over = true;
        if (logging)
            console.log("Game Over");
    }
}