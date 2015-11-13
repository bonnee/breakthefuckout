function Level() {
  console.log("level.js loaded!");
  this.title;
  this.bricks;

  this.load = function(n) {
      var tmp = JSONLoader("levels/layouts/" + n + ".json");
      title = tmp.title;
      bricks = tmp.bricks;
  }
  
  this.addBrick = function(spr) {
	  bricks.push({ x: spr.position.x, y: spr.position.y, width: spr.width, height: spr.height, sprite: spr, color: spr.color });
	  return spr;
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
        console.log("Error loading level");
      };

      request.send();
      return data;
  }

  this.list = function() {
    $.ajax({
        url: "layouts/",
        success: function (data) {
            $(data).find("a:contains(.json)").each(function () {
                var image = $(this).attr("href");
                console.log(image);
            });
        }
    });
  }
}
