var stage;
var ball;
var ballSpdX = 4;
var ballSpdY = -5;
var pad;
var AKey = keyboard(65);
var DKey = keyboard(68);
var running = true;
var score = 0;

var movePadDefault = 10;
var movePadIncreaser = 1.2;  //set the pixel increase every time the pad is moving. giving the pad acceleration while key that move pad is pressed
var movePad = movePadDefault;

var aPressed = false;
var dPressed = false;

var width = 919, height = 768;
var logging = true;

/*  JSON Test  */
var lev1 = '{"blocks":[' +
'{"x":"0","y":"400","width":"45","height":"23","color":"red","score":"100","sprite":""},' +
'{"x":"46","y":"400","width":"45","height":"23","color":"red","score":"100","sprite":""},' +
'{"x":"92","y":"400","width":"45","height":"23","color":"red","score":"100","sprite":""},' +
'{"x":"138","y":"400","width":"45","height":"23","color":"red","score":"100","sprite":""}]}';
//var lev1 = '{"blocks":[' +
//'{"x":"0","y":"400","width":"45","height":"23","color":"red"},' +
//'{"x":"46","y":"400","width":"45","height":"23","color":"red"},' +
//'{"x":"92","y":"400","width":"45","height":"23","color":"red"},' +
//'{"x":"138","y":"400","width":"45","height":"23","color":"red"},' +
//'{"x":"184","y":"400","width":"45","height":"23","color":"red"},' +
//'{"x":"230","y":"400","width":"45","height":"23","color":"red"},' +
//'{"x":"276","y":"400","width":"45","height":"23","color":"red"},' +
//'{"x":"322","y":"400","width":"45","height":"23","color":"red"},' +
//'{"x":"368","y":"400","width":"45","height":"23","color":"red"},' +
//'{"x":"414","y":"400","width":"45","height":"23","color":"red"},' +
//'{"x":"460","y":"400","width":"45","height":"23","color":"red"},' +
//'{"x":"506","y":"400","width":"45","height":"23","color":"red"},' +
//'{"x":"552","y":"400","width":"45","height":"23","color":"red"},' +
//'{"x":"598","y":"400","width":"45","height":"23","color":"red"},' +
//'{"x":"644","y":"400","width":"45","height":"23","color":"red"},' +
//'{"x":"690","y":"400","width":"45","height":"23","color":"red"},' +
//'{"x":"736","y":"400","width":"45","height":"23","color":"red"},' +
//'{"x":"782","y":"400","width":"45","height":"23","color":"red"},' +
//'{"x":"828","y":"400","width":"45","height":"23","color":"red"},' +
//'{"x":"874","y":"400","width":"45","height":"23","color":"red"},' +
//'{"x":"0","y":"376","width":"45","height":"23","color":"orange"},' +
//'{"x":"46","y":"376","width":"45","height":"23","color":"orange"},' +
//'{"x":"92","y":"376","width":"45","height":"23","color":"orange"},' +
//'{"x":"138","y":"376","width":"45","height":"23","color":"orange"},' +
//'{"x":"184","y":"376","width":"45","height":"23","color":"orange"},' +
//'{"x":"230","y":"376","width":"45","height":"23","color":"orange"},' +
//'{"x":"276","y":"376","width":"45","height":"23","color":"orange"},' +
//'{"x":"322","y":"376","width":"45","height":"23","color":"orange"},' +
//'{"x":"368","y":"376","width":"45","height":"23","color":"orange"},' +
//'{"x":"414","y":"376","width":"45","height":"23","color":"orange"},' +
//'{"x":"460","y":"376","width":"45","height":"23","color":"orange"},' +
//'{"x":"506","y":"376","width":"45","height":"23","color":"orange"},' +
//'{"x":"552","y":"376","width":"45","height":"23","color":"orange"},' +
//'{"x":"598","y":"376","width":"45","height":"23","color":"orange"},' +
//'{"x":"644","y":"376","width":"45","height":"23","color":"orange"},' +
//'{"x":"690","y":"376","width":"45","height":"23","color":"orange"},' +
//'{"x":"736","y":"376","width":"45","height":"23","color":"orange"},' +
//'{"x":"782","y":"376","width":"45","height":"23","color":"orange"},' +
//'{"x":"828","y":"376","width":"45","height":"23","color":"orange"},' +
//'{"x":"874","y":"376","width":"45","height":"23","color":"orange"}]}';

var bricks;

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
    bricks = JSON.parse(lev1);
    
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


    /*var deltaX = 46;
    var deltaY = 24;
    for (var y = 0; y < 7; y++) {
        for (var x = 0; x < 20; x++) {
            var color;
            switch (y) {
                case 0:
                    color = "../images/violet.png";
                    break;
                case 1:
                    color = "../images/indigo.png";
                    break;
                case 2:
                    color = "../images/blue.png";
                    break;
                case 3:
                    color = "../images/green.png";
                    break;
                case 4:
                    color = "../images/yellow.png";
                    break;
                case 5:
                    color = "../images/orange.png";
                    break;
                case 6:
                    color = "../images/red.png";
                    break;
            }
            var wbTexture = PIXI.Texture.fromImage(color);
            wb = new PIXI.Sprite(wbTexture);
            wb.position.x = x * deltaX;
            console.log(y * deltaY);
            wb.position.y = y * deltaY + 100;
            stage.addChild(wb);
        }
    }*/


    //create pad
    var padTexture = PIXI.Texture.fromImage("../images/pad.png");
    pad = new PIXI.Sprite(padTexture);
    pad.position.x = width / 2 - 11.5;
    pad.position.y = height - 23;
    stage.addChild(pad);
    var ballTexture = PIXI.Texture.fromImage("../images/ball.png");
    ball = new PIXI.Sprite(ballTexture);
    ball.position.x = width / 2 - 11.5;
    ball.position.y = height - 46;
    stage.addChild(ball);

    requestAnimationFrame(update);
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
        if (logging)
            console.log("Collision with pad");
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