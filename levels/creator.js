var stage;
var bricks;
var selectedBrick;
var levName = 1;
var rect;

var width = 919, height = 768;
var logging = true;     //      Only for debug messages

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

    rect = document.getElementById("game-canvas").getBoundingClientRect();
    
    selectedBrick = new PIXI.Sprite();
    SelectBrick("blue.png");
    stage.addChild(selectedBrick);

    requestAnimationFrame(Update);
}

PIXI.interaction.InteractionManager.prototype.onMouseMove = function (event) {
    var partX = event.clientX - rect.left;
    var partY = event.clientY - rect.top / 2;
    selectedBrick.position.x = Math.floor(partX / 46) * 46;
    selectedBrick.position.y = Math.floor(partY / 24) * 24;

    //console.log(selectedBrick.position.x + ", " + selectedBrick.position.y);
    requestAnimationFrame(Update);
}

PIXI.interaction.InteractionManager.prototype.onMouseDown = function (event) {
    //bricks.blocks.push({ x: selectedBrick.position.x, y: selectedBrick.position.y, sprite: selectedBrick.sprite, color: selectedBrick.color });
    var tx = selectedBrick;
    stage.addChild(tx);
    console.log("Cleeck");
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
    var graphics = new PIXI.Graphics().lineStyle(1, 0x808080);
    for(i = 0;i < width / 46; i++) {
        graphics.moveTo((i * 46)-1, 0);
        graphics.lineTo((i * 46)-1, height);
    }
    for(i = 0;i < height / 24; i++) {
        graphics.moveTo(0, (i * 24)-1);
        graphics.lineTo(width, (i * 24)-1);
    }
    stage.addChild(graphics);

    requestAnimationFrame(Update);
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
}

function SelectBrick(name) {
    if (logging)
        console.log(name + " selected");

    stage.removeChild(selectedBrick);
    selectedBrick=new PIXI.Sprite(PIXI.Texture.fromImage("../../images/bricks/" + name));
    stage.addChild(selectedBrick);
    requestAnimationFrame(Update);
}
