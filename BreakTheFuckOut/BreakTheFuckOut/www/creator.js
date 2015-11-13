var stage;
var selectedBrick;
var rect;
var level;

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
	level = new Level();

    LoadBricks();
    LoadObjects();
    document.getElementById('score').innerHTML = "Level: " + level.name;
    
    selectedBrick = new PIXI.Sprite();
    //SelectBrick("eraser.png");
    stage.addChild(selectedBrick, selectedBrick.position);

    rect = document.getElementById("game-canvas").getBoundingClientRect();
    requestAnimationFrame(Update);
}

PIXI.interaction.InteractionManager.prototype.onMouseMove = function (event) {
    var partX = event.clientX - rect.left;
    var partY = event.clientY - rect.top;
    selectedBrick.position.x = Math.floor(partX / 46) * 46;
    selectedBrick.position.y = Math.floor(partY / 24) * 24;
    requestAnimationFrame(Update);
}

PIXI.interaction.InteractionManager.prototype.onMouseDown = function (event) {
  if(selectedBrick.color != "eraser.png") {    
	level.addBrick(selectedBrick);
    stage.addChild(selectedBrick);
	requestAnimationFrame(Update);
  } else {
    for(var i = bricks.length -1 ; i >= 0; i--) {
      var s = bricks[i];
      console.log("X: "+selectedBrick.position.x+" - "+s.x+"\nY: "+selectedBrick.position.y+" - "+s.y);

      if(s.x == selectedBrick.position.x && s.y == selectedBrick.position.y) {
        stage.removeChild(s.sprite);
        bricks.splice(i, 1);
        console.log("BOOM");
        break;
      }
    }
    requestAnimationFrame(Update);
  }
}

function LoadObjects() {
    level.load(prompt("Level name:"));
    var i, l;
    for (i = 0, l = bricks.length; i < l; i++) {
        var b = bricks[i];
        b.x = parseInt(b.x);
        b.y = parseInt(b.y);
        b.width = parseInt(b.width);
        b.height = parseInt(b.height);
        b.score = parseInt(b.score);
        var t = PIXI.Texture.fromImage("../../images/bricks/" + b.color);
        s = new PIXI.Sprite(t);
        s.position.x = b.x;
        s.position.y = b.y;
        stage.addChild(s);
        b.sprite = s;
    }
    var graphics = new PIXI.Graphics().lineStyle(1, 0x808080);
    for(i = 1;i < width / 46; i++) {
        graphics.moveTo((i * 46)-1, 0);
        graphics.lineTo((i * 46)-1, height);
    }
    for(i = 1;i < height / 24; i++) {
        graphics.moveTo(0, (i * 24)-1);
        graphics.lineTo(width, (i * 24)-1);
    }
    stage.addChild(graphics);

    requestAnimationFrame(Update);
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

function LoadBricks() {
    $.ajax({
        url: "../../images/bricks/",
        success: function (data) {
            $(data).find("a:contains(.png)").each(function () {
                var image = $(this).attr("href");
                document.getElementById('tips').innerHTML += '<img id="' + image + '" onclick="SelectBrick(\'' + image + '\')" class="life" src="../../images/bricks/' + image + '"/>';
                console.log(image);
            });
            document.getElementById('tips').innerHTML += '<img id="eraser.png" onclick="SelectBrick(\'eraser.png\')" class="life" src="../../images/eraser.png"/>';
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
    selectedBrick = new PIXI.Sprite(PIXI.Texture.fromImage(document.getElementById(name).src));
    selectedBrick.color = name;
    stage.addChild(selectedBrick);
    requestAnimationFrame(Update);
}
