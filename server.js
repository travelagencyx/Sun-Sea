var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
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
app.get('/tours', function (req, res) {
  res.sendFile(__dirname + '/tours.html');
});
app.get('/partners', function (req, res) {
  res.sendFile(__dirname + '/partners.html');
});
app.listen(port, function () {
  console.log('Example app listening on port 3000!');
});
