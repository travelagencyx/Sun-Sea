function initialize() {
  var geocoder = new google.maps.Geocoder();

  geocoder.geocode({'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      var latitude = results[0].geometry.location.lat();
      var longitude = results[0].geometry.location.lng();
      var myLatlng = new google.maps.LatLng(latitude, longitude);
      var myOptions = {
        zoom: 15,
        center: myLatlng,
        scrollwheel: false
      }
      var map = new google.maps.Map(document.getElementById("map"), myOptions);
      var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'Zrno Soli'
      });
    }
  });
}

function loadScript() {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "http://maps.google.com/maps/api/js?sensor=false&callback=initialize";
  document.body.appendChild(script);
}

window.onload = loadScript;
