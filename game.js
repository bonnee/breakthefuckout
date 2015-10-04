var ball;
var pad;
var AKey = keyboard(65);
var DKey = keyboard(68);

var movePadDefault = 10;
var movePadIncreaser = 1.2;  //set the pixel increase every time the pad is moving. giving the pad acceleration while key that move pad is pressed
var movePad = movePadDefault;

var aPressed = false;
var dPressed = false;

var width = 919, height = 768;

function init() {
    console.log("game.js loaded");
    stage = new PIXI.Stage(0x66FF99);
    renderer = PIXI.autoDetectRenderer(
      width,
      height,
      { view: document.getElementById("game-canvas") }
      , true  //antialiasing set to true
    );

    /*  JSON Test
    var bricks = '{ "1" : [' +
'{ "x":"0" , "y":"400" color: "indigo" },' +
'{ "x":"45" , "y":"400" color: "indigo" },' +
'{ "x":"90" , "y":"400" color: "indigo" } ]}';*/


    //I create some brick...
    //var obj = JSON.parse(bricks);

    var deltaX = 46;
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
    }


    var ballTexture = PIXI.Texture.fromImage("../images/ball.png");
    ball = new PIXI.Sprite(ballTexture);
    ball.position.x = width / 2;
    ball.position.y = height - 23;
    stage.addChild(ball);

    //create pad
    var padTexture = PIXI.Texture.fromImage("../images/pad.png");
    pad = new PIXI.Sprite(padTexture);
    pad.position.x = width / 2;
    pad.position.y = height - 23;
    stage.addChild(pad);

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

    ball.position.x += 2;
    ball.position.y -= 2;

    if (aPressed) {
        if (pad.position.x - movePad >= 0) {
            pad.position.x -= movePad;
            movePad += movePadIncreaser;
        } else
            pad.position.x = 0;
    }
    if (dPressed) {
        if (pad.position.x + movePad <= width - 45) {
            pad.position.x += movePad;
            movePad += movePadIncreaser;
        }
        else
            pad.position.x = width - 45;
    }

    renderer.render(stage);

    requestAnimationFrame(update);
}

function refr() {
    renderer.render(stage);
}