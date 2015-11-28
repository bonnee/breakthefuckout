var container;
var selectedBrick;
var rect;
var level;

var width = 919, height = 768;
var logging = true;     //      Only for debug messages

function init() {
    if (logging)
        console.log("creator.js loaded");
    renderer = PIXI.autoDetectRenderer(width, height);

    container = new PIXI.Container();

    document.getElementById("renderer").appendChild(renderer.view);

    level = new Level();

    LoadBricks();
    LoadObjects();
    document.getElementById('score').innerHTML = title;
    
    selectedBrick = new PIXI.Sprite();
    //SelectBrick("eraser.png");
    container.addChild(selectedBrick, selectedBrick.position);

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
	add(selectedBrick);
	requestAnimationFrame(Update);
  } else {
    for(var i = bricks.length -1 ; i >= 0; i--) {
      var s = bricks[i];
      console.log("X: "+selectedBrick.position.x+" - "+s.x+"\nY: "+selectedBrick.position.y+" - "+s.y);

      if(s.x == selectedBrick.position.x && s.y == selectedBrick.position.y) {
        container.removeChild(s.sprite);
        bricks.splice(i, 1);
        console.log("BOOM");
        break;
      }
    }
    requestAnimationFrame(Update);
  }
}

function add(b) {
	bricks.push(b);
        container.addChild(b);
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
	add(b);
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
    container.addChild(graphics);

    requestAnimationFrame(Update);
}

function LoadBricks() {
    $.ajax({
        url: "../images/bricks/",
        success: function (data) {
            $(data).find("a:contains(.png)").each(function () {
                var image = $(this).attr("href");
                document.getElementById('tips').innerHTML += '<div style="background:url(../images/bricks/'+image+') top center no-repeat;" id="' + image + '" onclick="SelectBrick(\'' + image + '\')" class="life" src="../images/bricks/' + image + '">123</div>';
                console.log(image);
            });
            document.getElementById('tips').innerHTML += '<div id="eraser.png" onclick="SelectBrick(\'eraser.png\')" class="life" style="background:url(../images/eraser.png) top center no-repeat;">.</div>';
        }
    });
}


function Update() {
    renderer.render(container);
}

function SelectBrick(name) {
    if (logging)
        console.log(name + " selected");

    container.removeChild(selectedBrick);
    selectedBrick = new PIXI.Sprite(PIXI.Texture.fromImage(document.getElementById(name).src));
    selectedBrick.color = name;
    container.addChild(selectedBrick);
    requestAnimationFrame(Update);
}
