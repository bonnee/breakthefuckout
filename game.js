function init() {
    console.log("game.js loaded");
    stage = new PIXI.Stage(0x66FF99);
    renderer = PIXI.autoDetectRenderer(
      919,
      768,
      { view: document.getElementById("game-canvas") }
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
    for (var y = 0; y < 6; y++) {
        for (var x = 0; x < 20; x++) {
            var wbTexture = PIXI.Texture.fromImage("../images/green.png");
            wb = new PIXI.Sprite(wbTexture);
            wb.position.x = x * deltaX;
            console.log(y * deltaY);
            wb.position.y =  y * deltaY + 100;
            stage.addChild(wb);
        }
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