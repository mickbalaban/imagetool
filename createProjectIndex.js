var Jimp = require("jimp")
  , fs = require('fs')
  , _ = require('underscore')
  , Promise = require('bluebird')
  , _inJobs = 0
  , hat = require('hat');

var project = {"_id":"ac42f7de1de8e7db02dccc737d54d8fa","_rev":"58-050279debe496b4adcae54bc7209f74c","type":"project","user":"1526cae4477c387ffc07bd6cad001614","path":"users/projects/1526cae4477c387ffc07bd6cad001614/ac42f7de1de8e7db02dccc737d54d8fa/","name":"Robotica","created_at":1454036033592,"thumbnail":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/p/ac42f7de1de8e7db02dccc737d54d8fa/f3576a98b24ef9b7dbc516958acefef0_2.jpg","preview":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/p/ac42f7de1de8e7db02dccc737d54d8fa/f3576a98b24ef9b7dbc516958acefef0_1.jpg","public":true,"description":"this is the original, first, authentic, once in lifetime, professional, home made, expert designed, much anticipated project\n\nHave you ever noticed that anybody driving slower than you is an idiot, and anyone going faster than you is a maniac?","id":"ac42f7de1de8e7db02dccc737d54d8fa","updated_at":1471548135885,"rawimage":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/p/ac42f7de1de8e7db02dccc737d54d8fa/f3576a98b24ef9b7dbc516958acefef0.raw","items":[{"_id":"efc8a5fd39ce28e9b465d7ba9833d134","_rev":"2-b3029c1450ec2dbfb438e6c15f3818d0","id":"efc8a5fd39ce28e9b465d7ba9833d134","name":"hombro_iq2.stl","type":"project_item","user":"1526cae4477c387ffc07bd6cad001614","created_at":1473213838281,"file_type":"stl","mime_type":"application/octet-stream","project":"ac42f7de1de8e7db02dccc737d54d8fa","src":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/i/efc8a5fd39ce28e9b465d7ba9833d134/35411d4a6b5feb82ea174ce4c36ace88.stl","public":false,"thumbnail":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/i/efc8a5fd39ce28e9b465d7ba9833d134/efc8a5fd39ce28e9b465d7ba9833d134_2.png","rawimage":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/i/efc8a5fd39ce28e9b465d7ba9833d134/efc8a5fd39ce28e9b465d7ba9833d134.raw","preview":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/i/efc8a5fd39ce28e9b465d7ba9833d134/efc8a5fd39ce28e9b465d7ba9833d134.png","updated_at":1473213848385},{"_id":"ecc6cb12c91abb1c5572f3b9ad6ab911","_rev":"2-493ea893eed3e183d3f9167019693355","id":"ecc6cb12c91abb1c5572f3b9ad6ab911","name":"chest_busto4.stl","type":"project_item","user":"1526cae4477c387ffc07bd6cad001614","created_at":1473213457719,"file_type":"stl","mime_type":"application/octet-stream","project":"ac42f7de1de8e7db02dccc737d54d8fa","src":"https://printrapp.s3-us-west-1.amazonaws.com/u%2F1526cae4477c387ffc07bd6cad001614%2Fi%2Fecc6cb12c91abb1c5572f3b9ad6ab911%2F98bdada9bc2f3a1eaf5ae1acefcc4e0a.stl","public":false,"thumbnail":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/i/ecc6cb12c91abb1c5572f3b9ad6ab911/ecc6cb12c91abb1c5572f3b9ad6ab911_2.png","rawimage":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/i/ecc6cb12c91abb1c5572f3b9ad6ab911/ecc6cb12c91abb1c5572f3b9ad6ab911.raw","preview":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/i/ecc6cb12c91abb1c5572f3b9ad6ab911/ecc6cb12c91abb1c5572f3b9ad6ab911.png","updated_at":1473213472590},{"_id":"e0797370f87dcbd56f6a6e482c0d370c","_rev":"2-1c9f65b18defb7f208fff5886428f44e","id":"e0797370f87dcbd56f6a6e482c0d370c","name":"hombro_iq2.stl","type":"project_item","user":"1526cae4477c387ffc07bd6cad001614","created_at":1473213667270,"file_type":"stl","mime_type":"application/octet-stream","project":"ac42f7de1de8e7db02dccc737d54d8fa","src":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/i/e0797370f87dcbd56f6a6e482c0d370c/513e61d4da552da98f6809e2731fe4c8.stl","public":false,"thumbnail":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/i/e0797370f87dcbd56f6a6e482c0d370c/e0797370f87dcbd56f6a6e482c0d370c_2.png","rawimage":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/i/e0797370f87dcbd56f6a6e482c0d370c/e0797370f87dcbd56f6a6e482c0d370c.raw","preview":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/i/e0797370f87dcbd56f6a6e482c0d370c/e0797370f87dcbd56f6a6e482c0d370c.png","updated_at":1473213677351},{"_id":"88671ddab16b7a3394956a3717ddddfe","_rev":"2-e3501dae16a12a5fea1ac422082d8ae4","id":"88671ddab16b7a3394956a3717ddddfe","name":"eyes.stl","type":"project_item","user":"1526cae4477c387ffc07bd6cad001614","created_at":1473213611345,"file_type":"stl","mime_type":"application/octet-stream","project":"ac42f7de1de8e7db02dccc737d54d8fa","src":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/i/88671ddab16b7a3394956a3717ddddfe/99ce759295ba04b98eca1be4e74ef3c1.stl","public":false,"thumbnail":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/i/88671ddab16b7a3394956a3717ddddfe/88671ddab16b7a3394956a3717ddddfe_2.png","rawimage":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/i/88671ddab16b7a3394956a3717ddddfe/88671ddab16b7a3394956a3717ddddfe.raw","preview":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/i/88671ddab16b7a3394956a3717ddddfe/88671ddab16b7a3394956a3717ddddfe.png","updated_at":1473213624046},{"_id":"82b8b52703424151033cd3958fda5c36","_rev":"2-515aeed9538877aa2bba8616149e9a1e","id":"82b8b52703424151033cd3958fda5c36","name":"head_with_eyes_rectificada.stl","type":"project_item","user":"1526cae4477c387ffc07bd6cad001614","created_at":1473213232002,"file_type":"stl","mime_type":"application/octet-stream","project":"ac42f7de1de8e7db02dccc737d54d8fa","src":"https://printrapp.s3-us-west-1.amazonaws.com/u%2F1526cae4477c387ffc07bd6cad001614%2Fi%2F82b8b52703424151033cd3958fda5c36%2F7ff49f9d0f3fe8d81c936ee8a525051e.stl","public":false,"thumbnail":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/i/82b8b52703424151033cd3958fda5c36/82b8b52703424151033cd3958fda5c36_2.png","rawimage":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/i/82b8b52703424151033cd3958fda5c36/82b8b52703424151033cd3958fda5c36.raw","preview":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/i/82b8b52703424151033cd3958fda5c36/82b8b52703424151033cd3958fda5c36.png","updated_at":1473213248944},{"_id":"2a15a847c7623444b8af6780df45df19","_rev":"2-c1ef29c62f7012fa66c7c6152854de6a","id":"2a15a847c7623444b8af6780df45df19","name":"hombro_derecho2.stl","type":"project_item","user":"1526cae4477c387ffc07bd6cad001614","created_at":1473213646688,"file_type":"stl","mime_type":"application/octet-stream","project":"ac42f7de1de8e7db02dccc737d54d8fa","src":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/i/2a15a847c7623444b8af6780df45df19/a7ed9ddb5cb520b5ce1b688a7b02b388.stl","public":false,"thumbnail":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/i/2a15a847c7623444b8af6780df45df19/2a15a847c7623444b8af6780df45df19_2.png","rawimage":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/i/2a15a847c7623444b8af6780df45df19/2a15a847c7623444b8af6780df45df19.raw","preview":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/i/2a15a847c7623444b8af6780df45df19/2a15a847c7623444b8af6780df45df19.png","updated_at":1473213656625},{"_id":"0d3017bc3e33f569473e2d8d8ce6f55d","_rev":"2-7ebbe24bc83213259fa2528ba1f50e99","id":"0d3017bc3e33f569473e2d8d8ce6f55d","name":"left_ball_hip.stl","type":"project_item","user":"1526cae4477c387ffc07bd6cad001614","created_at":1473214020215,"file_type":"stl","mime_type":"application/octet-stream","project":"ac42f7de1de8e7db02dccc737d54d8fa","src":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/i/0d3017bc3e33f569473e2d8d8ce6f55d/55f7ed60a024b4e13527974651627a67.stl","public":false,"thumbnail":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/i/0d3017bc3e33f569473e2d8d8ce6f55d/0d3017bc3e33f569473e2d8d8ce6f55d_2.png","rawimage":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/i/0d3017bc3e33f569473e2d8d8ce6f55d/0d3017bc3e33f569473e2d8d8ce6f55d.raw","preview":"https://printrapp.s3-us-west-1.amazonaws.com/u/1526cae4477c387ffc07bd6cad001614/i/0d3017bc3e33f569473e2d8d8ce6f55d/0d3017bc3e33f569473e2d8d8ce6f55d.png","updated_at":1473214032971}],"idx":"6f80db27"};
/*
var project = {
  "name":"Pop Buddha",
  "idx": "1abcb111",
  "image": "z.png",
  "total_items": 3,
  "items": [
    {
      "name":"Bender",
      "image": "2.png",
      "idx": "1823bu34",
      "url": "http://printrapp.s3-us-west-1.amazonaws.com/users/projects/1526cae4477c387ffc07bd6cad001614/361b507f425363124da98c1ce9129417/55254ca1f6ae25b371a7b082fed120c1.gcode"
    },
    {
      "name":"Batman",
      "image": "5.png",
      "idx": "1823b111",
      "url": "http://printrapp.s3-us-west-1.amazonaws.com/users/projects/1526cae4477c387ffc07bd6cad001614/d1cea8d34ccb26cce3773fc95689f6a5/73876ab4dcdabd5da5dc803294c57984.gcode"
    },
    {
      "name":"Yoda",
      "image": "6.png",
      "idx": "2823b111",
      "url": "http://printrapp.s3-us-west-1.amazonaws.com/users/projects/1526cae4477c387ffc07bd6cad001614/d1cea8d34ccb26cce3773fc95689f6a5/73876ab4dcdabd5da5dc803294c57984.gcode"
    }
  ]
};
*/
/*

Project File structure

= 32 byte file type id: BCAF406DFF674B11870F0E74B4D44FD4
= 9 byte project idx
= 1 byte project rev
= 32 byte project name
= 1 byte total files
= 129600 byte project thumbnail (RGB565) (270x240)*2)
------------------------------------------------------- = 129675
= 9 byte job idx
= 1 byte job rev
= 1 byte times printed
= 32 byte job name
= 256 byte url
= 129600 byte job thumbnail (RGB565)
-------------------  ...  ----------------------------- = 129899

*/


var imgToBuf = function(img) {
  return new Promise(function(resolve, reject) {
    var buf = new Buffer((240*270)*2);
    var c = 0;
    Jimp.read(img).then(function (image) {
      image.cover(270,240)
      .dither565();

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
      resolve(buf);
    });
  });
}

function insertJobBuffer(buf) {
  finalBuffer = Buffer.concat([finalBuffer, buf]);
  _inJobs++;
  console.info(_inJobs);
  console.info(project.items.length);
  if (_inJobs == project.items.length) {
    // done, write the buffer to file
    console.info("DONE");
    fs.writeFile('./idx/'+project.idx, finalBuffer);
  }
}

var finalBuffer = new Buffer(0);

var pb = new Buffer(73);
pb.write('BCAF406DFF674B11870F0E74B4D44FD4', 0, 32);

//project name - 256 bits
pb.write(project.idx, 32, 8);
pb.write(project.name, 40, 32);
pb.writeInt8(project.items.length, 72);

imgToBuf(project.preview)
.then(function(imgb) {
  finalBuffer = Buffer.concat([pb, imgb]);
  _.each(project.items, function(i, k) {
    var bs = 8+32+128 // idx + name + url
      , ji = new Buffer(bs);

    //ji.write(i.idx, 0, 8);
    ji.write(hat(32, 16), 0, 8);
    ji.write(i.name, 8, 32);
    ji.write(i.src, 40, 128);

    imgToBuf(i.preview)
    .then(function(jib) {
      var tb = Buffer.concat([ji, jib]);
      insertJobBuffer(tb);
      //finalBuffer = tb;
      //console.info(finalBuffer.length);
    });
  })

})
