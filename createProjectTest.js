var Jimp = require('jimp')
  , Promise = require('bluebird')
  , fs = Promise.promisifyAll(require("fs"))
  , _ = require('underscore')
  , hat = require('hat')
  , bucket = 'files.printrapp.com'
  , AWS = require('aws-sdk')


AWS.config.region = 'us-west-2';
var s3 = new AWS.S3()

function getBitmapBuffer(thumb_key) {
  return new Promise(function(resolve, reject) {
    var params = {
      Bucket: bucket,
      Key: thumb_key
    };
    var f = "/tmp/" + hat() + '.png';
    var tmp_file = require('fs').createWriteStream(f, {autoClose: true});
    var fs = s3.getObject(params).createReadStream().pipe(tmp_file);

    fs.on('close', function(){
      var buf = new Buffer((240*270)*2);
      var c = 0;
      Jimp.read(f).then(function (image) {
        image.cover(270,240)
        .dither565();
        console.info("got shit");
        for (var x=0;x<image.bitmap.width;x++) {
          for (var y=0;y<image.bitmap.height;y++) {
            var b = image.getPixelColor(x,y);
            var rgba = Jimp.intToRGBA(b);
            var _p = rgba.r << 8 | rgba.g << 3 | rgba.b >> 3;
            buf.writeUInt16LE(_p, c, 2);
            c+=2;
            //console.info('...');
          }
        }
        console.info("resolving");
        resolve(buf);
      }).catch(function(err) {
        reject(err);
      });
    });
  })
}

var streamProjectIndex = function(project) {

  return new Promise(function(resolve, reject) {

    var finalBuffer = new Buffer(0);

    // write the project file id to temp buffer
    var pb = new Buffer(73);
    pb.write('BCAF406DFF674B11870F0E74B4D44FD4', 0, 32);
    //project name - 256 bits
    pb.write(project.idx, 32, 8);
    pb.write(project.name, 40, 32);
    pb.writeInt8(project.items.length, 72);

    // image buffer
    var b = new Buffer((240*270)*2);
    getBitmapBuffer(project.thumbnail.split("files.printrapp.com/")[1])
    .then(function(_b) {
      // now we have complete project info
      // get the jobs next
      console.info("GOT PROJECT BUFFER")
      finalBuffer = Buffer.concat([pb, _b]);
      return;
    })
    .then(function() {
      var jtasks = project.items.map(function(item, k) {
        return new Promise(function(resolve, reject) {
          var bs = 8+32+128 // idx + name + url
            , ji = new Buffer(bs);

          ji.write(item.idx, 0, 8);
          ji.write(item.name, 8, 32);
          ji.write("http://files.printrapp.com/u/" + item.user + "/i/" + item._id + ".gco", 40, 128);
console.info(item.thumbnail);

          getBitmapBuffer(item.thumbnail.split("files.printrapp.com/")[1])
          .then(function(_b) {
            console.info("GOT SHIZa")
            finalBuffer = Buffer.concat([finalBuffer, ji, _b]);
            console.info("IN GET ITEM ___ RESOLVING")
            resolve()
          })
          .catch(function(err) {
            console.info(err);
            reject(err);
          })
        });
      });

      Promise.all(jtasks).then(function() {
        var params = {
          Bucket: bucket,
          Key:  'u/'+(project.user)+'/p/'+(project.id)+'/' + (project.idx),
          Body: finalBuffer,
          ACL: 'public-read',
          ContentType: 'Application/octet-stream'
        }
        console.info(params)
        var s3bucket = new AWS.S3({params: { Bucket: bucket }});
        s3bucket.upload(params, function(err, sres) {
          if (err) {
            //cb(err, null)
          } else {
            //cb(null, {message: sres});
            console.info("_____ALL DONE");
            console.info(sres);
          }
        });
        //fs.writeFile('/tmp/idx', finalBuffer);
      });
  });
});
};

//streamProjectIndex(require('./data.js'));
module.exports.buildindex = function(event, context, cb) {
  streamProjectIndex(event).then(
    function(res) {
      cb(null, res);
    }
  )
}
