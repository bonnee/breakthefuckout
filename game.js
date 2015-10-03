console.log("game.js loaded");

var ball

function init() {
    stage = new PIXI.Stage(0x66FF99);
    renderer = PIXI.autoDetectRenderer(
      900,
      768,
      { view: document.getElementById("game-canvas") }
      ,true  //antialiasing set to true
    );


    //I create some brick...
    var deltaX = 45;
    for (var x = 1; x <= 12; x++) {
        var deltaY = 45;
        for (var y = 0; y < 6; y++) {

            if (x % 2 === 0)
                var wbTexture = PIXI.Texture.fromImage("../images/red.png");
            else
                var wbTexture = PIXI.Texture.fromImage("../images/blue.png");

            wb = new PIXI.Sprite(wbTexture);
            wb.position.x = x * 45 + deltaX;
            wb.position.y = y * 23 + deltaY;

            stage.addChild(wb);

            deltaY += 45;
        }
        deltaX += 45;
    }

    ball = new PIXI.Graphics();
    ball.lineStyle(2, 0xFF9933, 1);
    ball.beginFill(0xFF9933);
    ball.drawCircle(100, 700, 28);  //x , y , radius
    stage.addChild(ball);

    requestAnimationFrame(update);
}

function update() {

    

    ball.position.x +=0.8;
    ball.position.y -= 0.8;

    renderer.render(stage);

    requestAnimationFrame(update);
}

function refr() {
    renderer.render(stage);
}