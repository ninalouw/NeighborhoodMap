//Google map
var map;
var markers = [];
// Create placemarkers array to use in multiple functions to have control
// over the number of places that show.
var placeMarkers = [];

function initMap() {
//custom map style
    var styledMapType = new google.maps.StyledMapType(
        [
            {
                'featureType': 'all',
                'elementType': 'geometry.fill',
                'stylers': [
                    {
                        'weight': '2.00'
                    }
                ]
            },
            {
                'featureType': 'all',
                'elementType': 'geometry.stroke',
                'stylers': [
                    {
                        'color': '#9c9c9c'
                    }
                ]
            },
            {
                'featureType': 'all',
                'elementType': 'labels.text',
                'stylers': [
                    {
                        'visibility': 'on'
                    }
                ]
            },
            {
                'featureType': 'landscape',
                'elementType': 'all',
                'stylers': [
                    {
                        'color': '#f2f2f2'
                    }
                ]
            },
            {
                'featureType': 'landscape',
                'elementType': 'geometry.fill',
                'stylers': [
                    {
                        'color': '#ffffff'
                    }
                ]
            },
            {
                'featureType': 'landscape.man_made',
                'elementType': 'geometry.fill',
                'stylers': [
                    {
                        'color': '#ffffff'
                    }
                ]
            },
            {
                'featureType': 'poi',
                'elementType': 'all',
                'stylers': [
                    {
                        'visibility': 'off'
                    }
                ]
            },
            {
                'featureType': 'road',
                'elementType': 'all',
                'stylers': [
                    {
                        'saturation': -100
                    },
                    {
                        'lightness': 45
                    }
                ]
            },
            {
                'featureType': 'road',
                'elementType': 'geometry.fill',
                'stylers': [
                    {
                        'color': '#eeeeee'
                    }
                ]
            },
            {
                'featureType': 'road',
                'elementType': 'labels.text.fill',
                'stylers': [
                    {
                        'color': '#7b7b7b'
                    }
                ]
            },
            {
                'featureType': 'road',
                'elementType': 'labels.text.stroke',
                'stylers': [
                    {
                        'color': '#ffffff'
                    }
                ]
            },
            {
                'featureType': 'road.highway',
                'elementType': 'all',
                'stylers': [
                    {
                        'visibility': 'simplified'
                    }
                ]
            },
            {
                'featureType': 'road.arterial',
                'elementType': 'labels.icon',
                'stylers': [
                    {
                        'visibility': 'off'
                    }
                ]
            },
            {
                'featureType': 'transit',
                'elementType': 'all',
                'stylers': [
                    {
                        'visibility': 'on'
                    }
                ]
            }
            ,{
                'featureType': 'transit.station',
                'stylers': [
                      { 'weight': 9 },
                      { 'hue': '#e86613' }
                ]
            },
            {
                'featureType': 'water',
                'elementType': 'all',
                'stylers': [
                    {
                        'color': '#46bcec'
                    },
                    {
                        'visibility': 'on'
                    }
                ]
            },
            {
                'featureType': 'water',
                'elementType': 'geometry.fill',
                'stylers': [
                    {
                        'color': '#c2ddd7'
                    }
                ]
            },
            {
                'featureType': 'water',
                'elementType': 'labels.text.fill',
                'stylers': [
                    {
                        'color': '#070707'
                    }
                ]
            },
            {
                'featureType': 'water',
                'elementType': 'labels.text.stroke',
                'stylers': [
                    {
                        'color': '#ffffff'
                    }
                ]
            }
        ],
{name: 'Styled Map'});

    map = new google.maps.Map(document.getElementById('map'),{
        center: {lat:  49.282808, lng: -123.106688 },
        zoom: 12,
        mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                'styled_map']
        }
    });
    //Associate the styled map with the MapTypeId and set it to display.
    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');

    var locations = [
      {title:'CodeCore', location: {lat: 49.281961 , lng: -123.10866}},
      {title:'Ask for Luigi', location: {lat: 49.284201 , lng: -123.097724}},
      {title:'Cafe Medina', location: {lat: 49.280515 , lng: -123.116851}},
      {title:'VanArts', location: {lat: 49.282698 , lng: -123.115358}},
      {title:'The Bar Method', location: {lat: 49.277303 , lng: -123.114827}},
      {title:'K&J', location: {lat: 49.282897 , lng: -123.10708}},
      {title:'Revolver', location: {lat: 49.283191 , lng: -123.109452}}
    ];

    var largeInfoWindow = new google.maps.InfoWindow();

    //styling the markers
    var defaultIcon = makeMarkerIcon('00baff');
    //highlighted marker color for when user hovers over markers
    var highlightedIcon = makeMarkerIcon('24ffb0');
    //using the location array to create an array of markers
    for(var i = 0; i < locations.length; i++){
        var position = locations[i].location;
        var title = locations[i].title;
        var lat = position.lat;
        var lng = position.lng;
        var coords = `&nbsp${lat} ,  ${lng}`;
        //create marker per location and put into markers array
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            icon: defaultIcon,
            coords: coords,
            animation: google.maps.Animation.DROP,
            id: i
        });
      //push the marker to our array of markers
        markers.push(marker);
        //extend boundaries of map
        // bounds.extend(marker.position);
        //create onclick event to open an InfoWindow at each marker
        marker.addListener('click', function(){
            populateInfoWindow(this, largeInfoWindow);
        });
        //two eventListeners, one for mouseover and one for mouseout,
        //to change the colors back and forth
        marker.addListener('mouseover', function(){
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function(){
            this.setIcon(defaultIcon);
        });
    }
    //
    showListings();
}

//MAP FUNCTIONS

//This func takes a color and creates anew marker icon of that color.
//the icon will be 21px wide by 34 high, have an origin of 0, 0
//and be anchored at 10,34.
function makeMarkerIcon(markerColor){
    var markerImage = new google.maps.MarkerImage(`http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|${markerColor}|40|_|%E2%80%A2`,
      new google.maps.Size(21,34),
      new google.maps.Point(0,0),
      new google.maps.Point(10,34),
      new google.maps.Size(21,34));
    return markerImage;
}

//this func will loop through the markers array and display them all
function showListings(){
    var bounds = new google.maps.LatLngBounds();
  //extend boundaries of the map for each marker and display the marker
    for(var i = 0; i < markers.length; i++){
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}

//YELP API

//populate info window when marker is clicked
function populateInfoWindow(marker, infowindow){
  if (infowindow.marker != marker) {
    infowindow.setContent('');
    infowindow.marker = marker;
    //make sure marker property is cleared if infowindow closed
    infowindow.addListener('closeclick', function(){
      infowindow.marker = null;
    });
    //define Yelp review here/call it



    function getYelpReviews () {
      var yelpReviewsArray = ViewModel.yelpReviews();
      if (yelpReviewsArray.length > 0) {

          infowindow.setContent(`<div>&nbsp${marker.title}</div><br><div id='yelp-review' ><h1>Yelp Review</h1> </div>`);

          // var review = new Yelp(document.getElementById('yelp-review'));

        } else {
        infowindow.setContent(`<div>&nbsp${marker.title}</div><div>No Yelp review found</div>`);
      }
    }
    //open infowindow on correct marker
    infowindow.open(map, marker);
  }
}

//Yelp API authentication
var yelpAuth = {
    //put keys here
    consumerKey: '',
    consumerSecret: '',
    accessToken: '',
    //Udacity specified that we should put our keys in our app, although in
    //reality this would not be done
    accessTokenSecret: '',
    serviceProvider: {
        signatureMethod: 'HMAC-SHA1'
    }
};

//Knockout implementation

//Model for Yelp Reviews
var YelpReview = function (){
    var self = this;

    self.imageUrl = '';
    self.name = '';
    self.rating = '';
    self.ratingImgUrl = '';
    self.reviewCount = '';
    self.url = '';

    self.buildReview = function() {
        var yelpReview = '';
        yelpReview += `<div class="yelp-review">`;
        yelpReview += `<img src="${self.imageUrl}"><br>`
        yelpReview += `<p>${self.name}</p>`;
        yelpReview += `<p>Rating: ${self.rating}</p><br>`;
        yelpReview += `<img src="${self.ratingImgUrl}"><br>`;
        yelpReview += `<p>Reviews:${self.reviewCount} </p><br>`;
        yelpReview += `<a href=\"" ${self.url} "\" target=\"_blank\">more information</a><br>`;
        yelpReview += `</div>`;
        return yelpReview;
    };
};

ViewModel = {
  //can later change hardcoded defaultMarkers to markers populated from an api call.
    defaultMarkers: ko.observableArray(),
    placeFilter: ko.observable([]),
    yelpReviews: ko.observableArray([])
}

var getDataForMap = function () {
  ViewModel.getYelpReviews();
}

ko.applyBindings(viewModel);
