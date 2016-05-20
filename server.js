var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var sendgrid  = require('sendgrid')('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');
var bodyparser = require('body-parser');

app.use(bodyparser.json());
 

app.use(express.static(__dirname + '/'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.get('/accomodation', function (req, res) {
  res.sendFile(__dirname + '/accomodation.html');
});
app.get('/rentacar', function (req, res) {
  res.sendFile(__dirname + '/rentacar.html');
});
app.get('/restaurants', function (req, res) {
  res.sendFile(__dirname + '/restaurants.html');
});
app.get('/zrnosoli', function (req, res) {
  res.sendFile(__dirname + '/restaurant_details.html');
});
app.get('/apartmentSkalice', function (req, res) {
  res.sendFile(__dirname + '/apartment_details_Skalice.html');
});
app.get('/apartmentGrad', function (req, res) {
  res.sendFile(__dirname + '/apartment_details_Grad.html');
});
app.get('/apartmentAlen', function (req, res) {
  res.sendFile(__dirname + '/apartment_details_Alen.html');
});
app.get('/tours', function (req, res) {
  res.sendFile(__dirname + '/tours.html');
});
app.get('/tours_details', function (req, res) {
  res.sendFile(__dirname + '/tours_details.html');
});
app.get('/partners', function (req, res) {
  res.sendFile(__dirname + '/partners.html');
});
app.get('/about', function (req, res) {
  res.sendFile(__dirname + '/about.html');
});
app.listen(port, function () {
  console.log('Example app listening on port 3000!');
});

//mail

app.post('/sendEmail', function(req, res) {
  console.log(req.body);
  sendgrid.send(
   req.body
  , function(err, json) {
    if (err) { return console.error(err); }
    console.log(json);
  });
});