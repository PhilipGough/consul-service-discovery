var express = require('express');
var dns = require('native-dns');
var request = require("request");
var path = require('path');

var app = express();
var router = express.Router();

var serviceList = [];


app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(router);
app.use('/static', express.static(__dirname + '/public'));


function service(address, port) {
  this.address = address;
  this.port = port;
}


function dnsQuestion (name) {
  var inputName = name || 'random-number-service.service.consul';
  return dns.Question({
      name: inputName ,
      type: 'SRV'
  });
}

function dnsRequest(question) {
  return dns.Request({
  question: question,
  server: { address: '172.17.0.1', port: 53, type: 'udp' },
  timeout: 1000,
  });
}

function loadBalanceEndpoint(dnsRes) {
  var i = Math.floor(Math.random() * (dnsRes.answer.length - 0 ));
  var serviceAddress = dnsRes.additional[i].address.toString();
  var servicePort = dnsRes.answer[i].port.toString();
  serviceList.push(new service(serviceAddress, servicePort));
  return 'http://' + serviceAddress + ':' + servicePort;
}

router.get('/', function (req, res) {
    res.render('home', {title: 'Welcome'});
});

router.get('/icon', function (req, res) {
  var serviceEndpoint = '';
    var dnsReq = dnsRequest(dnsQuestion('icon-service.service.consul'));
    dnsReq.send();
    dnsReq.on('message', function (err, answer) {
      serviceEndpoint = loadBalanceEndpoint(answer);
      request(serviceEndpoint, function(error, response, body) {
        var imgSrc = serviceEndpoint + '/monster/' + req.query.randNum;
        var templateParams = {
          title: 'Icon',
          imageSrc: imgSrc,
          randomNum: '0' + req.query.randNum,
          serviceInfo: JSON.parse(JSON.stringify(serviceList))
        };
        serviceList = [];
        res.render('result', templateParams);
      });
    });
});

router.get('/number', function(req, res) {
    var serviceEndpoint = '';
    var dnsReq = dnsRequest(dnsQuestion('random-number-service.service.consul'));
    dnsReq.send();
    dnsReq.on('message', function (err, answer) {
      serviceEndpoint = loadBalanceEndpoint(answer);
      request(serviceEndpoint, function(error, response, body) {
        res.redirect('/icon?randNum=' + body);
      });
    });
});


app.listen(8080);

