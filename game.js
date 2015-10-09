/*
TODO: 
1. Mouse / keyboard control pad settings;
2. Score managing:
3. Initial "Press [button] to start" splash screen;
4. Level management via JSON files;
5. Difficulty settings (ball speed);
*/


var stage;
var ball;
var ballSpdX = 4;
var ballSpdY = -5;
var pad;
var bricks;
var AKey = keyboard(65);
var DKey = keyboard(68);
var running = true;
var score = 0;
var divisorCollision = 5;

var movePadDefault = 10;
var movePadIncreaser = 1.2;  //set the pixel increase every time the pad is moving. giving the pad acceleration while key that move pad is pressed
var movePad = movePadDefault;

var aPressed = false;
var dPressed = false;

var width = 919, height = 768;
var logging = true;

function init() {
    if (logging)
        console.log("game.js loaded");
    stage = new PIXI.Stage(0x66FF99);
    renderer = PIXI.autoDetectRenderer(
      width,
      height,
      { view: document.getElementById("game-canvas") }
      , true  //antialiasing set to true
    );

    bricks = JSONLoader("levels/1.json");

    var i, l;
    for (i = 0, l = bricks.blocks.length; i < l; i++) {
        var b = bricks.blocks[i];
        b.x = parseInt(b.x);
        b.y = parseInt(b.y);
        b.width = parseInt(b.width);
        b.height = parseInt(b.height);
        b.score = parseInt(b.score);
        var wbTexture = PIXI.Texture.fromImage("../images/" + bricks.blocks[i].color + ".png");
        wb = new PIXI.Sprite(wbTexture);
        wb.position.x = bricks.blocks[i].x;
        wb.position.y = bricks.blocks[i].y;
        stage.addChild(wb);
        b.sprite = wb;
    }

    //create pad
    var padTexture = PIXI.Texture.fromImage("../images/pad.png");
    pad = new PIXI.Sprite(padTexture);
    pad.position.x = width / 2 - 11.5;
    pad.position.y = height - 23;
    stage.addChild(pad);

    //create ball
    var ballTexture = PIXI.Texture.fromImage("../images/ball.png");
    ball = new PIXI.Sprite(ballTexture);
    ball.position.x = width / 2 - 11.5;
    ball.position.y = height - 46;
    stage.addChild(ball);

    requestAnimationFrame(update);
}

//      Load a JSON file from specified URL
function JSONLoader(url) {
    var data;
    request = new XMLHttpRequest();
    request.open('GET', url, false);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400){
            data = JSON.parse(request.responseText);
        } else {
            if (logging)
                console.log("Error loading bricks placement");
        }
    };

    request.onerror = function() {
    };

    request.send();
    return data;
}

AKey.press = function () {
    //key object pressed
    aPressed = true;
};
AKey.release = function () {
    //key object released
    aPressed = false;
    movePad = movePadDefault;
};

DKey.press = function () {
    //key object pressed
    dPressed = true;
};
DKey.release = function () {
    //key object released
    dPressed = false;
    movePad = movePadDefault;
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

function update() {

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
    if (running)
        requestAnimationFrame(update);
}

function CheckCollisions() {
    var collisionX = false, collisionY = false;

    if (ballSpdY > 0 && ball.position.y + ball.height >= pad.position.y && (ball.position.x + ball.width > pad.position.x && ball.position.x < pad.position.x + pad.width)) {
        collisionY = true;

        ballSpdX = -((pad.position.x + (pad.width / 2)) - (ball.position.x + (ball.width / 2))) / divisorCollision;  ///////10
        //ballSpdY = -ballSpdY;

        if (logging)
            console.log("Collision with pad");



        //deltaY = DyBall + Math.Abs((((pad0.Location.Y + (pad0.HeightBlock / 2))) - ((ball.Y + (ball.HeightBlock / 2)))) / 10);
        //DyBall = (deltaY);
        //DxBall = -DxBall;


    }
    for (var i = 0; i < bricks.blocks.length; i++) {
        var b = bricks.blocks[i];
        if ((ball.position.y <= b.y + b.height && ball.position.y + ball.height >= b.y) && (ball.position.x <= b.x + b.width && ball.position.x + ball.width >= b.x)) {
            stage.removeChild(b.sprite);
            bricks.blocks.splice(i, 1);
            score += b.score;
            collisionY = true;
            if (logging)
                console.log("Collision with block " + i);
        }
    }

    if (ball.position.x + ball.width >= width || ball.position.x <= 0) {
        collisionX = true;
        if (logging)
            console.log("Collision with bounds");
    }
    if (ball.position.y <= 0) {
        collisionY = true;
        if (logging)
            console.log("Collision with top bound");
    }

    if (ball.position.y >= height - ball.height) {
        ball.position.y = height - ball.height;
        running = false;
        if (logging)
            console.log("Game Over");
    }
    if (bricks.blocks.length == 0)
        running = false;

    if (collisionX)
        ballSpdX = -ballSpdX;
    if (collisionY)
        ballSpdY = -ballSpdY;

    function refr() {
        renderer.render(stage);
    }
}