var l = require('./createProjectTest.js');
var d = require('./data.js');
console.info(l)


l.buildindex(d, null, function(err, res) {
  console.info(res);
})
