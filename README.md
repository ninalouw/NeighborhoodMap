# NeighborhoodMap
Single-page app built with Knockout.js using Google Maps API and Foursquare API.

## Instructions

1. Clone or download the repo.
2. Open index.html in your browser to view the app.
3. Or, you can set up a local server following [these](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Set_up_a_basic_working_environment) instructions.
4. View the live app [here](http://food-explorer.surge.sh/).

## Project Brief
You will develop a single page application featuring a map of your neighborhood or a neighborhood you would like to visit. You will then add functionality to this map including highlighted locations, third-party data about those locations and various ways to browse the content.

## Project Description
This is a single-page application built using Google Maps API for the map and map functionality, and Foursquare API for the data used to create markers on the map and display more detailed information about these places. The app uses the framework Knockout.js and utilizes the MVVM pattern for the app architecture and for a responsive UI.

## How to use the app

* By default, the app loads top-rated places from Foursquare for your location, in the list right next to the map (laptop/desktop) or under the map (smartphone).

* You can filter the list of places by typing a search string that matches the places title in the list, and as you backspace the list will update to show you the previous list results.

* When you hover over a list entry, the corresponding map marker will animate and an info window opens with more details about the place built from  available Foursquare data.

* When you click on a marker it will animate and open the info window for the place.

* In the top search bar you can enter in your own queries, e.g. 'coffee', 'pizza' etc, and see the results come up in the list view and on the map.

## Project Resources

* [Knockout Documentation] (http://knockoutjs.com/index.html).
* [Knockout Live Tutorials] (http://learn.knockoutjs.com/#/?tutorial=loadingsaving).
* [Udemy Knockout Course] (https://www.udemy.com/learn-knockout-js-framework-from-groundup/learn/v4/overview).
* [KO Live Search] (http://opensoul.org/2011/06/23/live-search-with-knockoutjs/).
* [Utility Functions in Knockout.js] (http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html).
* [Asynchronous Error-Handling in JavaScript] (https://ruben.verborgh.org/blog/2012/12/31/asynchronous-error-handling-in-javascript/).
* [Google Maps API] (https://developers.google.com/maps/).
* [Google Maps API Documentation] (https://developers.google.com/maps/documentation/).
* [Foursquare API] (https://developer.foursquare.com/).
* [Foursquare API Documentation] (https://developer.foursquare.com/docs/).
* [Materialize CSS] (http://materializecss.com/).
