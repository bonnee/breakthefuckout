var stage;
var bricks;
var selectedBrick;
var levName = 1;

var width = 919, height = 768;
var logging = false;     //      Only for debug messages

function init() {
    if (logging)
        console.log("creator.js loaded");
    stage = new PIXI.Stage(0x66FF99);
    renderer = PIXI.autoDetectRenderer(
      width,
      height,
      { view: document.getElementById("game-canvas") }
    );

    LoadBricks();
    LoadObjects();
    document.getElementById('score').innerHTML = "Level: " + levName;
    requestAnimationFrame(Update);
}

PIXI.interaction.InteractionManager.prototype.onMouseMove = function (event) {
    selectedBrick.position.x = event.clientX;
    selectedBrick.position.y = event.clientY;
    //console.log( + ", " + event.clientY);
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
    bricks = JSONLoader(levName + ".json");
    var i, l;
    for (i = 0, l = bricks.blocks.length; i < l; i++) {
        var b = bricks.blocks[i];
        b.x = parseInt(b.x);
        b.y = parseInt(b.y);
        b.width = parseInt(b.width);
        b.height = parseInt(b.height);
        b.score = parseInt(b.score);
        var wbTexture = PIXI.Texture.fromImage("../../images/bricks/" + b.color + ".png");
        wb = new PIXI.Sprite(wbTexture);
        wb.position.x = b.x;
        wb.position.y = b.y;
        stage.addChild(wb);
        b.sprite = wb;
    }
}

function LoadBricks() {
    $.ajax({
        url: "../../images/bricks/",
        success: function (data) {
            $(data).find("a:contains(.png)").each(function () {
                var image = $(this).attr("href");
                document.getElementById('tips').innerHTML += '<img onclick="SelectBrick(\'' + image + '\')" class="life" src="../../images/bricks/' + image + '"/>';
                console.log(image);
            });
        }
    });
}


function Update() {
    renderer.render(stage);
    requestAnimationFrame(Update);
}

function SelectBrick(name) {
    if (logging)
        console.log(name + " selected");
    stage.removeChild(selectedBrick);
    var wbTexture = PIXI.Texture.fromImage("../../images/bricks/" + name);
    selectedBrick = new PIXI.Sprite(wbTexture);
    selectedBrick.position.x = 0;
    selectedBrick.position.y = 0;
    stage.addChild(selectedBrick);
}