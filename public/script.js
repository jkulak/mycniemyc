console.log("🚗🌤🌧");

var locationHolder = document.getElementById("location");

const updateLocation = function(value) {
  locationHolder.innerHTML = value;
};

const drawWeather = data => {
  data.forEach(element => {
    console.log(element);
  });
};

const getWeather = async (lon, lat) => {
  const response = await fetch(
    // "https://api.darksky.net/forecast/6e3186336fe2a61b1327aea9c60d8ec5/" + lat + "," + lon
    "/api/forecast/" + lat + "," + lon
  );

  const myJson = await response.json();
  updateLocation(myJson.city.name);
  drawWeather(myJson.list);
};

const run = () => {
  navigator.geolocation.getCurrentPosition(function(location) {
    const lon = location.coords.longitude;
    const lat = location.coords.latitude;
    getWeather(lon, lat);
  });
};

run();
