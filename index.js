//import required modules
const express = require("express");
const path = require("path");
const request = require('request')
const { Configuration, OpenAIApi } = require("openai");
const fetch = require('node-fetch');
const dotenv = require("dotenv");
const { response } = require("express");
const { google } = require('googleapis');

dotenv.config();




const googlekey = process.env.GOOGLEKEY
const SEARCH_ENGINE_ID = process.env.EnID
const customsearch = google.customsearch('v1');

//set up Express app
const app = express();
const port = process.env.PORT || 8888;

//define important folders
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
//setup public folder
app.use(express.static(path.join(__dirname, "public")));

//convert form data to JSON for easier use
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);

var links = [
  {
    name: "Home",
    path: "/"
  },
  {
    name: "Result",
    path: "/result"
  },
  {
    name: "About",
    path: "/about"

  }
];

//PAGE ROUTES
app.get("/", async (request, response) => {
  weathers = await getWeather();
  response.render("index", { title: "Home", link: links, weather: weathers });

  console.log(weathers)

});

app.get("/about", async (request, response) => {
  response.render("about", { title: "About", link: links });
});

app.get("/result", async (request, response) => {
  try {
    const location = request.body.location;
    const description = request.body.desc;

    const weather = await getWeather();
    const outfit = await getoutfit(request, response);
    const image = await getImages(outfit);

    response.render("result", { title: "Result", link: links, weather, outfit, image });

    console.log(weather, outfit);
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal server error");
  }
});


// api post
app.post("/result", async (request, response) => {
  try {
    const location = request.body.location;
    const description = request.body.desc;

    const weather = await getWeather();
    const outfit = await getoutfit(request, response);
    const image = await getImages(outfit);

    response.render("result", { title: "Home", link: links, weather, outfit, image });

    console.log(weather, outfit);
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal server error");
  }
});



//set up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});




/* Function to get weather from Weathermap.org. */
/*1. get weather by location*/
/*1.1 get location by ip-api and convert the name to sync with openweathermap*/
/*1.2. get location by manual input*/
async function getWeather() {

  const res = await fetch('http://ip-api.com/json/');// get location
  const data = await res.json();
  const { lat, lon } = data;

  // Make a request to the OpenWeatherMap API to get the city name
  const myAPIkey = "d6576226f366e7ceef68b6fe72713367"
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${myAPIkey}`;


  const weatherResponse = await fetch(url);
  const weatherData = await weatherResponse.json();
  const curcity = weatherData.name;
  console.log(`The current city is ${curcity}`);

  let city = request?.query?.city ?? curcity;
  const murl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${myAPIkey}`;


  //comment to me: I had an issue having 'undefined' for the return value here because I did not use promise or await syntax. response from the API is being handled inside a callback function. function will not wait for the response to come back before returning. 
  const response = await new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });

  if (response.statusCode === 200) {
    let data = JSON.parse(response.body)
    let weather = {
      location: data.name,
      temperature: data.main.temp,
      conditions: data.weather[0].description,
      icon: data.weather[0].icon

    };
    console.log(data)
    return weather;
  } else {
    throw new Error("Request failed with status code " + response.statusCode);
  }
}
//getWeather("toronto")


/* Function to outfit recommendations from chatgpt. */


async function getoutfit(request, response) {
  try {
    const location = request.body.location;
    const description = request.body.desc;
    const weather = await getWeather();
    const res = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `get recommended outfit in ${location} for ${description} based on the current weather ${weather}`,
      max_tokens: 64
    });
    const data = res.data.choices[0].text;

    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

console.log(googlekey)

/* Function to convert text to image by searching from google image. */



// Define a function to search for images using the Google Custom Search API
async function getImages(query) {
  try {
    // Make a request to the API using the search() method
    const res = await customsearch.cse.list({
      auth: googlekey,
      cx: SEARCH_ENGINE_ID,
      q: query,
      searchType: 'image'
    });

    // Return the search results
    return res.data.items;
  } catch (err) {
    console.error(`Error searching images: ${err.message}`);
  }
}

