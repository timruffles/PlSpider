(function(d,$){
  d.require("dojox.gfx");
  d.require('picklive.kitsmodule');
  d.addOnLoad(function() {
    var gfx = dojox.gfx,
        surface = gfx.createSurface(dojo.byId("gfx_holder"), 700, 700);
    picklive.kitsmodule.singleKit(surface);
  });
})(dojo,dojo.query);
