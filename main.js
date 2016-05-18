var Jimp = require("jimp");
var fs = require('fs');

fs.readdirSync('./png').forEach(function(file) {
  var _e = file.split(".");
  if (_e[1] == 'png') {

    var c = 0;
    var img = _e[0];

    Jimp.read("./png/"+img+'.png').then(function (image) {
      image.dither565();
      var buf = new Buffer((image.bitmap.width * image.bitmap.height)*2);
      for (var x=0;x<image.bitmap.width;x++) {
    	  for (var y=0;y<image.bitmap.height;y++) {
          var b = image.getPixelColor(x,y);
          var rgba = Jimp.intToRGBA(b);
          var _p = rgba.r << 8 | rgba.g << 3 | rgba.b >> 3;
          buf.writeUInt16LE(_p, c, 2);
          c+=2;
        }
      }
      fs.writeFile('./raw/'+img+'.dat', buf);
    }).catch(function (err) {
      console.error(err);
    });
  }
});
