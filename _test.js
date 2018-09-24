var Jimp = require("jimp")
  , fs = require('fs')
  , _ = require('underscore')
  , Promise = require('bluebird')
  , _inJobs = 0
  , hat = require('hat')
  , http = require('http');

var project = {"_id":"3d0225cd6e42cc87a2c0a2c26d001c19","_rev":"5-767e4b895aa8a35229a57ac2146f717e","user":"1526cae4477c387ffc07bd6cad001614","name":"test","description":"","type":"project","created_at":1473262666186,"preview":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/p/3d0225cd6e42cc87a2c0a2c26d001c19/c2e5c61d5fd000059c03908d9f2d9980_1.png","thumbnail":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/p/3d0225cd6e42cc87a2c0a2c26d001c19/c2e5c61d5fd000059c03908d9f2d9980_2.png","rawimage":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/p/3d0225cd6e42cc87a2c0a2c26d001c19/c2e5c61d5fd000059c03908d9f2d9980.raw","updated_at":1473263399220,"id":"3d0225cd6e42cc87a2c0a2c26d001c19","items":[{"_id":"853b28dc02f297bae26b944c3bd313c9","_rev":"2-af948a00ae1218fd4c4a332e57c15ee3","id":"853b28dc02f297bae26b944c3bd313c9","name":"muslo_izq2.stl","type":"project_item","user":"1526cae4477c387ffc07bd6cad001614","created_at":1473262743247,"file_type":"stl","mime_type":"application/octet-stream","project":"3d0225cd6e42cc87a2c0a2c26d001c19","src":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/i/853b28dc02f297bae26b944c3bd313c9/94d8b40aa789d86de8b0baa4bdda362e.stl","public":false,"thumbnail":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/i/853b28dc02f297bae26b944c3bd313c9/853b28dc02f297bae26b944c3bd313c9_2.png","rawimage":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/i/853b28dc02f297bae26b944c3bd313c9/853b28dc02f297bae26b944c3bd313c9.raw","preview":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/i/853b28dc02f297bae26b944c3bd313c9/853b28dc02f297bae26b944c3bd313c9.png","updated_at":1473262754091}],"idx":"d7369225"};
/*

Project File structure

= 32 byte file type id: BCAF406DFF674B11870F0E74B4D44FD4
= 8 byte project idx
= 32 byte project name
= 1 byte total files
= 129600 byte project thumbnail (RGB565) (270x240)*2)
------------------------------------------------------- = 129673
= 8 byte job idx
= 32 byte job name
= 128 byte url
= 129600 byte job thumbnail (RGB565)
-------------------  ...  ----------------------------- = 129768

*/

function pipeImageToBuffer(url, buf) {
  return new Promise(function(resolve, reject) {
    http.get(url.replace("https://", "http://"), function(res) {
      var da = [];

      res.on('data', function(d) {
        da.push(d);
      })

      res.on('end', function() {
        buf = Buffer.concat(da);

        resolve(buf);
      })
    }).on('error', function(err) {
      console.info(err);
      reject(err);
    });
  })
}

var finalBuffer = new Buffer(0);

var pb = new Buffer(73);
pb.write('BCAF406DFF674B11870F0E74B4D44FD4', 0, 32);
//project name - 256 bits
pb.write(project.idx, 32, 8);
pb.write(project.name, 40, 32);
pb.writeInt8(project.items.length, 72);

var b = new Buffer((240*270)*2);
pipeImageToBuffer(project.rawimage.replace("https://", "http://"), b)
.then(function(_b) {
  // now we have complete project info
  // get the jobs next
  finalBuffer = Buffer.concat([pb, _b]);
  return;
})

.then(function() {

  var jtasks = project.items.map(function(item, k) {
    return new Promise(function(resolve, reject) {
      var bs = 8+32+128 // idx + name + url
        , ji = new Buffer(bs);

      ji.write(hat(32, 16), 0, 8); // generate job idx - may change to hard coded value in db
      ji.write(item.name, 8, 32);
      ji.write(item.src, 40, 128);

      pipeImageToBuffer(item.rawimage.replace("https://", "http://"), b)
      .then(function(_b) {
        finalBuffer = Buffer.concat([finalBuffer, ji, _b]);
        resolve()
      })
      .catch(function(err) {
        console.info(err);
        reject(err);
      })
    });
  });



  Promise.all(jtasks).then(function() {
    console.info("ALL DONE");
    fs.writeFile('./idx/'+project.idx, finalBuffer);
  });
})
