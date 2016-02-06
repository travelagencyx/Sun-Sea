var express = require('express');
var app = express();

app.use(express.static(__dirname + '/'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.get('/rentacar', function (req, res) {
  res.sendFile(__dirname + '/rentacar.html');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
