
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
        ViewModel.showFilterErrorList(false);
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

      // //two eventListeners, one for mouseover and one for mouseout,
      // //to change the colors back and forth
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

            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function(){
               marker.setAnimation(null);
            }, 2150);

        });
        foursquareVenues[name] = marker;
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

    function toggleBounce(marker) {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    }

    function showMarker(name){
        var bounds = new google.maps.LatLngBounds();
        var marker = foursquareVenues[name];
        marker.setVisible(true);
      //extend boundaries of the map depending on the marker
        marker.setMap(map);
        bounds.extend(marker.position);
        map.fitBounds(bounds);
        // using a window resize event and fitBounds method to make sure map markers always fit on screen as user resizes their browser window
        google.maps.event.addDomListener(window, 'resize', function() {
            map.fitBounds(bounds);
        });
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
        self.address = '';
        self.contact = '';
        self.checkinsCount = '';
        self.isOpen = '';
        //from 2nd ajax, for showPlaceDetail
        self.photoUrl = '';
        self.description = '';
        self.categoryName = '';
        self.ratingColor = '';
        self.urlFoursquare = '';
        self.hoursStatus = '';
        self.likes = '';

        self.selectedVenue = ko.observable(false);
        self.showPlace = ko.observable(true);
        // self.showPlaceDetail = ko.observable(false);

        //func to create content to populate infowindow
        self.createInfoWindowContent = function () {
            var name, price, rating,likes, isOpen, hoursStatus, address, checkinsCount, photoUrl, contact, url, urlFoursquare;
            name = self.name || 'No name provided.';
            price = self.price || 'No price information.';
            rating = self.rating || 'No rating provided.';
            likes = self.likes || '';
            address = self.address || 'No address provided.';
            checkinsCount = self.checkinsCount || '';
            photoUrl = self.photoUrl || '';
            contact = self.contact || 'No contact details provided.';
            url = self.url || '';
            urlFoursquare = self.urlFoursquare || '';
          //build html that will show up in infowindow onclick of marker
            var innerHTML = '';
            innerHTML += '<div>';
            innerHTML += `<div><span><strong><h6>${name}</h6></strong></span></div>`;
            innerHTML += `<span><img style="width:70px;height:60px;" src="${photoUrl}" /></span>`;
            innerHTML += `<div><span>&nbsp${price}</span>&nbsp<span>&nbsp${rating}</span><i class="tiny material-icons">star</i><span>&nbsp${likes}</span>&nbsp<i class="tiny material-icons">thumb_up</i><span>&nbsp${checkinsCount}</span>&nbsp<i class="tiny material-icons">person_pin</i></div>`;
            if(self.isOpen === 'true' && self.hoursStatus){
                innerHTML += `<p><span><i class="tiny material-icons">schedule</i>Open now</span><span><i>&nbsp${self.hoursStatus}</i></span></p>`;
            } else if (self.isOpen === 'hours unavailable') {
                innerHTML += `<p><span><i class="tiny material-icons">error_outline</i><i>&nbsp Hours unavailable</i></span></p>`;
            } else {
                innerHTML += `<p><span><i class="tiny material-icons">today</i><span><i>&nbsp${self.hoursStatus}</i></span></p>`;
            }
            innerHTML += `<p><i class="tiny material-icons">location_on</i>&nbsp${address}</p>`;
            innerHTML += `<p><i class="tiny material-icons">phone</i>&nbsp${contact}</p>`;
            innerHTML += `<div><i class="material-icons">link</i> &nbsp<a href="${url}" target=\"_blank\">Website</a></div>`;
            innerHTML += `<div><i class="material-icons">rate_review</i> &nbsp<a href="${urlFoursquare}" target=\"_blank\">View on Foursquare</a></div>`;
            innerHTML += '</div>';
            return innerHTML;
        };
    };



    var ViewModel = {
        places: ko.observableArray([]),
        userQuery: ko.observable(''),
        input: ko.observable([]),
        showFilterList: ko.observable(true),
        showFilterErrorList: ko.observable(false),
        error: ko.observable(''),
        showFilterListResult: ko.observable(false),

        // Knockout place filter
        //when user clicks on filter bar close all infowindows
        clickOnFilterBar: function (){
            infoWindow.close();
        },

        filterPlaces: function() {

            var input = ViewModel.input().toLowerCase();

            ViewModel.places().forEach(function(place) {
                if (place.name.toLowerCase().indexOf(input) < 0) {
                    hideMarker(place.name);
                    place.showPlace(false);
                } else {
                    showMarker(place.name);
                    place.showPlace(true);
                    // //prevent map from zooming in excessively
                    map.setZoom(13);
                }
            });
        },

        searchOnEnter: function(data, event) {
            var keyCode = (event.which ? event.which : event.keyCode);
            if (keyCode === 13) {
                this.getDataForMap();
                return false;
            }
            return true;
        },

        highlightMarker: function(place) {
            var highlightedIcon = makeMarkerIcon('64ffda');
            this.selectedVenue(true);
            var marker = foursquareVenues[this.name];
            var position = marker.getPosition();
            openInfoWindow(place, marker);
            marker.setIcon(highlightedIcon);
            toggleBounce(marker);
        },

        unhighlightMarker: function(place) {
            var defaultIcon = makeMarkerIcon('4fc3f7');
            this.selectedVenue(false);
            var marker = foursquareVenues[this.name];
            marker.setIcon(defaultIcon);
            toggleBounce(marker);
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
        },

        getFoursquareVenues: function (){
        //remove other possible markers here( initial markers or previous search results)
            ViewModel.places().forEach(function(place){
                removeMarker(place.name);
            });
            ViewModel.places.removeAll();

        //get user seach term from search bar
        //if, like on initial pageload, there is no search term, use 'food'
            var userQuery = ViewModel.userQuery().toLowerCase() || 'food';

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
                  dataType: 'json',
                  success: function(data) {
                      var foursquarePlaces = data.response.groups[0].items;
                      //error handling for no search results for userQuery
                      if(foursquarePlaces.length === 0) {
                          ViewModel.error('There were no results for your search query.');
                          ViewModel.showFilterErrorList(true);
                      }
                      for (var i = 0; i < foursquarePlaces.length; i++) {
                          ViewModel.showFilterErrorList(false);
                          var place = foursquarePlaces[i];

                        // Ajax 2 to get more venue details for showPlaceDetail
                        //https://api.foursquare.com/v2/venues/VENUE_ID
                          var baseVenueUrl = 'https://api.foursquare.com/v2/venues/';
                          var foursquareVenueUrl = `${baseVenueUrl}${foursquarePlaces[i].venue.id}?client_id=${clientId}&client_secret=${clientSecret}&v=20130815`;

                          $.ajax({
                              url: foursquareVenueUrl,
                              dataType: 'json',
                              success: function(data) {
                                  var venue = data.response.venue;

                                  var self = this;
                                  self.Venue = new Venue();

                                  self.Venue.position = venue.location || 'No location provided';
                                  self.Venue.name = venue.name || 'No name provided';
                                  self.Venue.lat = venue.location.lat || '';
                                  self.Venue.lng = venue.location.lng || '';
                                  self.Venue.url = venue.url || 'No url provided';
                                  self.Venue.rating = venue.rating || 'No rating provided';
                                  self.Venue.price = '';
                                  if (venue.price) {
                                      var tier = venue.price.tier;
                                      var currency = venue.price.currency;
                                      self.Venue.price = Array(tier+1).join(currency) + '';
                                  }
                                  self.Venue.address = venue.location.address || 'No address provided';
                                  self.Venue.contact = venue.contact.formattedPhone || 'No contact details provided';
                                  self.Venue.checkinsCount = venue.stats.checkinsCount || 'No Check-in data';
                                  self.Venue.isOpen = '';
                                  if(venue.hours){
                                      self.Venue.isOpen = venue.hours.isOpen;
                                  } else {
                                      self.Venue.isOpen = 'hours unavailable';
                                  }
                                  self.Venue.hoursStatus = '';
                                  if(venue.hours){
                                      self.Venue.hoursStatus = venue.hours.status;
                                  } else {
                                      self.Venue.hoursStatus = '';
                                  }
                                  self.Venue.likes = '';
                                  if(venue.likes){
                                      self.Venue.likes = venue.likes.count;
                                  } else {
                                      self.Venue.likes = 'No likes provided';
                                  }
                                  self.Venue.photoUrl = '';
                                  if(venue.bestPhoto){
                                      self.Venue.photoUrl = venue.bestPhoto.prefix + "100" + venue.bestPhoto.suffix ;
                                  } else {
                                      self.Venue.photoUrl = '';
                                  }

                                  self.Venue.categoryName = venue.categories[0].name || '';
                                  self.Venue.description = venue.description || '';
                                  self.Venue.urlFoursquare = venue.canonicalUrl || '';

                                  createMarkersForPlaces(self.Venue.lat, self.Venue.lng, self.Venue.name, self.Venue.url);

                                  ViewModel.places.push(self.Venue);
                              },
                              error: function(response) {
                                ViewModel.error('Failed to get any results from Foursquare.');
                                ViewModel.showFilterErrorList(true);
                                  console.log('error:', response);
                              }
                          });
                      }
                  },
                  error: function(response) {
                      ViewModel.error('Failed to get any results from Foursquare.' );
                      ViewModel.showFilterErrorList(true);
                      console.log('error: ', response);
                  }
              });
        }

    //end of ViewModel
    };


    ko.applyBindings(ViewModel);

// Initialize collapse button
$(".button-collapse").sideNav();

//end of initMap
}
//Error callback for GMap API request
 mapError = () => {
   $('#fsq-errors').text('Failed to load Google Maps.');
 };
