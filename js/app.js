
//Google map
var map;
var foursquareVenues = [];

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
        zoom: 13,
        mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                'styled_map']
        }
    });
    //Associate the styled map with the MapTypeId and set it to display.
    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');

    // Create a single infowindow to be used with the place details information
    // so that only one is open at once.
    var infoWindow = new google.maps.InfoWindow({maxWidth: 200});

    function initialize(e) {
      e.preventDefault;
      //does an initial onload foursquare query so that map is automatically
      //populated with locations, as per Udacity instructions
      ViewModel.getDataForMap(e);
    }

    google.maps.event.addDomListener(window, 'load', initialize);

//MAP FUNCTIONS

// This function creates markers for each place found when getFoursquareVenues() is successful.
function createMarkersForPlaces(lat, lng, name, url) {
  //styling the markers
    var defaultIcon = makeMarkerIcon('4fc3f7');
  //highlighted marker color for when user hovers over markers
    var highlightedIcon = makeMarkerIcon('64ffda');

    var latlng = new google.maps.LatLng(lat, lng);

  // Create a marker for each place.
    var marker = new google.maps.Marker({
        map: map,
        name: name,
        url: url,
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
    //on dblclick zoom in on marker area
    marker.addListener('dblclick', function() {
        map.setZoom(15);
        map.setCenter(marker.getPosition());
    });
           // If a marker is clicked, open the infoWindow,
           //which is populated by createInfoWindowContent().
        google.maps.event.addListener(marker, 'click', function() {
                ViewModel.places().forEach(function(place) {
                    if (place.name.toLowerCase() == marker.name.toLowerCase()) {
                        openInfoWindow(place, marker);
                    }
                });
        });
    foursquareVenues[name] = marker;
    console.log(marker);
    return marker;
}


    function openInfoWindow (place, marker){
        var html = place.createInfoWindowContent();
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infoWindow.addListener('closeclick', function() {
            infoWindow.marker = null;
        });
    }

    function showMarker(name){
        var bounds = new google.maps.LatLngBounds();
        var marker = foursquareVenues[name];
        marker.setVisible(true);
      //extend boundaries of the map depending on the marker
        marker.setMap(map);
        bounds.extend(marker.position);
        map.fitBounds(bounds);
    }

    function hideMarker(name){
        var marker = foursquareVenues[name];
        marker.setVisible(false);
    }

    function removeMarker(name) {
        var marker = foursquareVenues[name];
        marker.setMap(null);
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


//Knockout implementation

//Model for Foursquare venues
    var Venue = function (){
        var self = this;

        self.name = '';
        self.lat = '';
        self.lng = '';
        self.url = '';
        self.rating = '';
        self.price = '';
        self.description = '';
        self.address = '';
        self.photo = '';
        self.contact = '';
        self.checkinsCount = '';
        self.isOpen = '';

        self.selectedVenue = ko.observable(false);
        self.showPlace = ko.observable(true);
        self.showPlaceDetail = ko.observable(false);

        //func to create content to populate infowindow
        self.createInfoWindowContent = function () {
          //build html that will show up in infowindow onclick of marker
            var innerHTML = '';
            innerHTML += '<div>'
            if (self.name) {
                innerHTML += `<strong><h6>${self.name}</h6></strong>`;
            }
            if(self.rating){
                innerHTML += `<p>Rating:&nbsp${self.rating}</p>`;
            }
            if(self.checkinsCount){
                innerHTML += `<p>Total Check-ins:&nbsp${self.checkinsCount}</p>`;
            }
            if(self.price){
                innerHTML += `<p>Price-range:&nbsp${self.price}</p>`;
            }
            if(self.isOpen){
                innerHTML += `<p>Open now:&nbsp Yes</p>`;
            } else {
                innerHTML += `<p>Open now:&nbsp No</p>`;
            }
            // if(self.address){
            //     innerHTML += `<p>Address:&nbsp${self.address}</p>`;
            // }
            // if(self.contact){
            //     innerHTML += `<p>Phone number:&nbsp${self.contact}</p>`;
            // }
            // if(self.url){
            //     innerHTML += `<a href=\"${self.url}\" target=\"_blank\">Website</a>`;
            // }
            innerHTML += '</div>';
            return innerHTML;
        };
    };


    ViewModel = {
      //can later change hardcoded defaultMarkers to markers populated from an api call.
        defaultMarkers: ko.observableArray([]),
        places: ko.observableArray([]),
        userQuery: ko.observable(),
        placeFilter: ko.observable([]),
        showFilterList: ko.observable(true),
        showFilterErrorList: ko.observable(false),
        showFilterListResult: ko.observable(false),

        // Knockout place filter
        //when user clicks on filter bar close all infowindows
        clickOnFilterBar: function (){
            infoWindow.close();
        },

        filterPlaces: function() {
            var input = ViewModel.placeFilter().toLowerCase();

            ViewModel.places().forEach(function(place) {
              //the indexOf method returns -1, so if place.name is < 0
              //then there was no match to userinput
                if (place.name.toLowerCase().indexOf(input) < 0) {
                    hideMarker(place.name);
                    place.showPlace(false);
                } else {
                    showMarker(place.name);
                    place.showPlaceDetail(true);
                    place.showPlace(false);
                    ViewModel.showFilterList(true);
                    //prevent map from zooming in excessively
                    map.setZoom(16);
                    //clear the filter bar
                    ViewModel.placeFilter('');
                }
            })
        },

        highlightMarker: function(place) {
            var highlightedIcon = makeMarkerIcon('64ffda');
            this.selectedVenue(true);
            var marker = foursquareVenues[this.name];
            var position = marker.getPosition();
            openInfoWindow(place, marker);
            marker.setIcon(highlightedIcon);
        },

        unhighlightMarker: function(place) {
            var defaultIcon = makeMarkerIcon('4fc3f7');
            this.selectedVenue(false);
            var marker = foursquareVenues[this.name];
            marker.setIcon(defaultIcon);
        },

        //user search function - user input of term into foursquare search bar
        userSearch: function(){
          //ensure that map zooms out on new search
            map.setZoom(13);
            this.getDataForMap();
            //clear the search bar
            this.userQuery('');
        },


        getDataForMap: function (){
            ViewModel.getFoursquareVenues();
            ViewModel.place.showPlace(true);
        },

        getFoursquareVenues: function (){
        //remove other possible markers here( initial markers or previous search results)
          ViewModel.places().forEach(function(place){
              removeMarker(place.name);
          });
          ViewModel.places.removeAll();

        //get user seach term from search bar
        //if, like on initial pageload, there is no search term, use 'food'
            var userQuery = $('#search-bar').val() || 'food';
            _.defaults(userQuery, 'food');

            //Foursquare AJAX request
            var baseUrl = 'https://api.foursquare.com/v2/venues/explore';
            var clientId = 'QWE1VBCMF05T3J1KBZLJQHAXLGZUWE2Y1N00YANFV0Y3FHD1';
            var clientSecret = 'U43ZC1UCLO50LSYW3OTOSKFSGWFEWJV1Y0VVE3K1ALXAQFXF';
            //later let user set city
            var defaultCity = 'Vancouver, BC';


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
                          var venue = place.venue;

                          var self = this;
                          self.Venue = new Venue();

                          self.Venue.position = venue.location;
                          self.Venue.name = venue.name;
                          self.Venue.lat = venue.location.lat;
                          self.Venue.lng = venue.location.lng;
                          self.Venue.url = venue.url;
                          self.Venue.rating = venue.rating;
                          self.Venue.price = venue.price.message;
                          self.Venue.description = venue.description;
                          self.Venue.address = venue.location.address;
                          self.Venue.photos = venue.photos;
                          self.Venue.contact = venue.contact.formattedPhone;
                          self.Venue.checkinsCount = venue.stats.checkinsCount;
                          self.Venue.isOpen = venue.hours.isOpen;

                          createMarkersForPlaces(self.Venue.lat, self.Venue.lng, self.Venue.name, self.Venue.url);
                            ViewModel.places.push(self.Venue);
                      }
                  },
                  error: function(xhr, status, err){
                			console.log(err);
                  }
              });

        }

    //end of ViewModel
    }

  ko.applyBindings(ViewModel);

//end of initMap
}
