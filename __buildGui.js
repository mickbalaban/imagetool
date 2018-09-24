var Jimp = require("jimp")
  , Promise = require('bluebird')
  , fs = Promise.promisifyAll(require("fs"))
  , _ = require('underscore')
  , _inJobs = 0;

var cImgToBuf = function(img) {
  return new Promise(function(resolve, reject) {
    var byteCounter = 0;
    var curentColor = 0;
    var colorCounter = 0;
    Jimp.read("./gui/png/"+img).then(function (image) {
      var buf = new Buffer((image.bitmap.width*image.bitmap.height)*2);
      image.dither565();
      for (var x=0;x<image.bitmap.width;x++) {
        for (var y=0;y<image.bitmap.height;y++) {
          var b = image.getPixelColor(x,y);
          if (x == 0 && y == 0) {
            curentColor = b;
            colorCounter += 1;
          } else {
            if (b == curentColor) {
              colorCounter += 1;
            } else {
              var rgba = Jimp.intToRGBA(b);
              var _p = rgba.r << 8 | rgba.g << 3 | rgba.b >> 3;
              buf.writeUInt16LE(colorCounter, byteCounter);
              buf.writeUInt16LE(_p, byteCounter + 2);
              byteCounter+=4;
              curentColor = b;
            }
          }
        }
      }
      console.info("RESOLVING ", buf)
      resolve(buf);
    });
  });
}

var imgToBuf = function(img) {
  return new Promise(function(resolve, reject) {
    var c = 0;
    Jimp.read("./gui/png/"+img).then(function (image) {
      var buf = new Buffer((image.bitmap.width*image.bitmap.height)*2);
      image.dither565();
      for (var x=0;x<image.bitmap.width;x++) {
        for (var y=0;y<image.bitmap.height;y++) {
          var b = image.getPixelColor(x,y);
          var rgba = Jimp.intToRGBA(b);
          var _p = rgba.r << 8 | rgba.g << 3 | rgba.b >> 3;
          buf.writeUInt16LE(_p, c, 2);
          c+=2;
        }
      }
      resolve([buf, image.bitmap.width, image.bitmap.height]);
    });
  });
}

var promises = []
  , pngs = [];

fs.openAsync('./gui/ui', 'w')
.then(fs.openAsync('./gui/ui.min', 'w'))
.then(fs.openAsync('./gui/struct.h', 'w'))
.then(fs.readdirSync('./gui/png').forEach(function(file) {
  if (file[0] != ".")
    pngs.push(file);
}))
.then(function() {
  return Promise.reduce(pngs, function(offset, png) {
    createCImg(png);
  }, 0);
})
.then(function() {
  // reduce here
  return Promise.reduce(pngs, function(offset, png) {
    createImg(png, offset)
  }, 0);
});

var createCImg = function(imgPath) {
  return new Promise(function(resolve, reject) {
    var ps = cImgToBuf(imgPath).then(function(ibuf) {
      console.info(ibuf.length)
      return fs.appendFileAsync('./gui/ui.min', ibuf)
    })
  })
}

var createImg = function(imgPath, offset) {
  return new Promise(function(resolve, reject) {
    var ps = imgToBuf(imgPath).spread(function(ibuf, w, h) {
      fs.appendFileAsync('./gui/ui', ibuf)
      .then(function() {
        var name = imgPath.split(".")[0];
        fs.appendFileAsync('./gui/struct.h', 'UIBitmap ' + name + ' = {' + (offset) + ',' + ibuf.length + ',' + w + ',' + h + '};\n')
        .then(function() {
          setTimeout(function() {
            resolve(offset + ibuf.length);
          }, 100);
        })
      })
    })
  })
}
