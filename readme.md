# Weatherwearguide
### Outfit Recommender Web App
http://weatherwearguide-env-1.eba-m3a7knqu.us-east-1.elasticbeanstalk.com/


## Overview
 This web application uses ip-api, openweathermap Api, ChatGPT and Google Custom Search API to provide outfit recommendations based on a user's location and description input. The application asks the user for their current location and a brief description of the occasion they need an outfit for. ChatGPT provides the recommendation text according to current weather from the openweathermap and description input, and Google Custom Search API is used to search for related outfit images.

## Requirements
To run this web application, you will need:

 - NodeJS
 - OpenAI API key
 - Google Custom Search API key and search engine ID


## Limitations
 - The accuracy of the outfit recommendations depends on the quality of the input description and the available data in ChatGPT's training dataset.
 - The Google Custom Search API is limited to a certain number of requests per day, so the application may not be able to provide image results if the limit has been reached.
