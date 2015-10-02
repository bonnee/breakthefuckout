console.log("game.js loaded");

function init() {
    stage = new PIXI.Stage(0x66FF99);
    renderer = PIXI.autoDetectRenderer(
      1280,
      768,
      { view: document.getElementById("game-canvas") }
    );

    //background obj
    var bgTexture = PIXI.Texture.fromImage("../images/bg/bg.png");
    bg = new PIXI.Sprite(bgTexture);
    bg.position.x = 0;
    bg.position.y = 0;
    stage.addChild(bg);


    //I create some brick...
    var deltaX = 45;
    for (var x = 1; x <= 12; x++) {
        var deltaY = 45;
        for (var y = 0; y < 6; y++) {

            if (x % 2 === 0)
                var wbTexture = PIXI.Texture.fromImage("../images/brick1.png");
            else
                var wbTexture = PIXI.Texture.fromImage("../images/brick2.png");

            wb = new PIXI.Sprite(wbTexture);
            wb.position.x = x * 45 + deltaX;
            wb.position.y = y * 23 + deltaY;

            stage.addChild(wb);

            deltaY += 45;
        }
        deltaX += 45;
    }

    requestAnimationFrame(update);
}

function update() {

    renderer.render(stage);

    requestAnimationFrame(update);
}

function refr() {
    renderer.render(stage);
}