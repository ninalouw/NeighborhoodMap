//Google map
var map;
var foursquareVenues = [];
// Create placemarkers array to use in multiple functions to have control
// over the number of places that show.
// var placeMarkers = [];

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

    var largeInfoWindow = new google.maps.InfoWindow();

}

//MAP FUNCTIONS

//search functions for foursquareVenues, when user presses enter on foursquare searchbox
// function searchFoursquare (data, event) {
//   var keyCode = (event.which ? event.which : event.keyCode);
//   if (keyCode === 13) {
//     // hideMarkers(placeMarkers);
//     getDataForMap();
//     return false;
//   }
//   return true;
// };

document.getElementById('show-foursquare').addEventListener('click', function (){
    getFoursquarePlaces();
});

function getFoursquarePlaces () {
//remove other possible markers here(hardcoded initial markers)

//get user seach term from search bar
var userQuery = document.getElementById('search-bar').value;
//Foursquare AJAX request
var baseUrl = 'https://api.foursquare.com/v2/venues/explore';
var clientId = 'QWE1VBCMF05T3J1KBZLJQHAXLGZUWE2Y1N00YANFV0Y3FHD1';
var clientSecret = 'U43ZC1UCLO50LSYW3OTOSKFSGWFEWJV1Y0VVE3K1ALXAQFXF';
var defaultCity = 'Vancouver, BC';
// var userQuery = 'food';

var foursquareUrl = `${baseUrl}?client_id=${clientId}&client_secret=${clientSecret}&v=20130815&near=${defaultCity}
  &query=${userQuery}`;

  $.ajax({
        url: foursquareUrl,
        dataType: "json",
        success: function(data) {
          var foursquarePlaces = data.response.groups[0].items;
          for (var i = 0; i < foursquarePlaces.length; i++) {
            console.log(foursquarePlaces[i]);
            var place = foursquarePlaces[i];
            var position = place.venue.location;
            var name = place.venue.name;
            var lat = position.lat;
            var lng = position.lng;
            var url = place.venue.url;
            var rating = place.venue.rating;
            var address = position.address;
            var coords = `&nbsp${lat} ,  ${lng}`;

            createMarkersForPlaces(lat, lng, name, url, rating, address);
            // foursquareVenues.push(foursquarePlaces[i]);
          }
        },
    		error: function(xhr, status, err){
    				console.log(err);
          }
  });

};

// This function creates markers for each place found when getFoursquarePlaces() is successful.
function createMarkersForPlaces(lat, lng, name, url, rating, address) {
  //styling the markers
    var defaultIcon = makeMarkerIcon('00baff');
  //highlighted marker color for when user hovers over markers
    var highlightedIcon = makeMarkerIcon('24ffb0');

    var latlng = new google.maps.LatLng(lat, lng);

      // Create a marker for each place.
        var marker = new google.maps.Marker({
            map: map,
            name: name,
            url: url,
            rating: rating,
            address: address,
            position: latlng,
            icon: defaultIcon,
            animation: google.maps.Animation.DROP
        });

        //two eventListeners, one for mouseover and one for mouseout,
        //to change the colors back and forth
          marker.addListener('mouseover', function(){
              this.setIcon(highlightedIcon);
          });
          marker.addListener('mouseout', function(){
              this.setIcon(defaultIcon);
          });
           // Create a single infowindow to be used with the place details information
           // so that only one is open at once.
        var placeInfoWindow = new google.maps.InfoWindow();
           // If a marker is clicked, do a place details search on it in the next function.
        google.maps.event.addListener(marker, 'click', function() {
            if (placeInfoWindow.marker == this) {
                console.log("This infowindow already is on this marker!");
            } else {
                createInfoWindowContent(this, placeInfoWindow);
                openInfoWindow(place, marker);
            }
        });
        foursquareVenues[name] = marker;
        console.log(marker);
         return marker;
}


function createInfoWindowContent (marker, infowindow) {
  //build html that will show up in infowindow onclick of marker
      // Set the marker property on this infowindow so it isn't created again.
      infowindow.marker = marker;
      var innerHTML = '<div>';
      if (marker.name) {
        innerHTML += `<strong>${marker.name}</strong><hr>`;
      }
      if(marker.rating){
        innerHTML += `<p>Rating:&nbsp${marker.rating}</p>`;
      }
      if(marker.address){
        innerHTML += `<p>Address:&nbsp${marker.address}</p>`;
      }
      if(marker.url){
        innerHTML += `<a href=\"${marker.url}\" target=\"_blank\">Website</a>`;
      }
      innerHTML += '</div>';
      infowindow.setContent(innerHTML);
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
}

function openInfoWindow (){

}
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
function showFoursquareVenues(){
    var bounds = new google.maps.LatLngBounds();
    // var marker = foursquareLocations[name];
    var markers = foursquareVenues;
  //extend boundaries of the map for each marker and display the marker
    for(var i = 0; i < markers.length; i++){
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}

//Foursquare Implementation


//Knockout implementation

//Model for Foursquare venues
// var Venue = function (){
//     var self = this;
//
//     self.title = '';
//     self.lat = '';
//     self.lng = '';
//     self.url = '';
//
// };


function ViewModel (){
    var self = this;
  //can later change hardcoded defaultMarkers to markers populated from an api call.
    self.defaultMarkers = ko.observableArray();
    self.foursquareVenues = ko.observableArray();
    self.venuesFilter = ko.observableArray();
    self.placeFilter = ko.observable([]);
    self.yelpReviews = ko.observableArray([]);

//end of ViewModel
}

var viewModel = new ViewModel();

ko.applyBindings(viewModel);
