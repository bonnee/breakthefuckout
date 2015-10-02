console.log("game.js loaded");

function init() {
    stage = new PIXI.Stage(0x66FF99);
    renderer = PIXI.autoDetectRenderer(
      1280,
      768,
      { view: document.getElementById("game-canvas") }
    );

    //background obj
    var bgTexture = PIXI.Texture.fromImage("../images/bg.png");
    bg = new PIXI.Sprite(bgTexture);
    bg.position.x = 0;
    bg.position.y = 0;
    stage.addChild(bg);

    //whiteBrick obj
    var wbTexture = PIXI.Texture.fromImage("../images/whiteBrick.png");
    wb = new PIXI.Sprite(wbTexture);
    wb.position.x = 0;
    wb.position.y = 0;
    stage.addChild(wb);

    requestAnimationFrame(update);
}

function update() {

    renderer.render(stage);

    requestAnimationFrame(update);
}

function refr() {
    renderer.render(stage);
}