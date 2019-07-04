console.log("🚗🌤🌧");

var locationHolder = document.getElementById("location");

var updateLocation = function(value) {
  locationHolder.innerHTML = value;
};

navigator.geolocation.getCurrentPosition(function(location) {
  var val = "lat: " + location.coords.latitude + ", lon: " + location.coords.longitude;
  console.log(val);
  updateLocation(val);
});
