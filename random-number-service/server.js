var express = require('express');
var crypto = require('crypto');

var app = express();

app.get('/', function (req, res) {
  crypto.randomBytes(48, function(err, buffer) {
      var token = buffer.toString('hex');
      res.send(token);
  });

});

app.listen(8080);

