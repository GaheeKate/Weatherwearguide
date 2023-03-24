// Get the user's current position
navigator.geolocation.getCurrentPosition(function (position) {
  // Get the latitude and longitude
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  // Make a request to the OpenWeatherMap API to get the city name
  const apiKey = '<YOUR_API_KEY>';
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Get the city name from the response
      const city = data.name;
      console.log(`The current city is ${city}`);
    })
    .catch(error => console.error(error));
}, function (error) {
  console.error(error);
});


module.exports = getCurrentPosition