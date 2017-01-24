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

//Knockout implementation

//Place model
var Place = function () {

};

function ViewModel(){
    var self = this;
    self.defaultMarkers = ko.observableArray([]);

}

var viewModel = new ViewModel();

ko.applyBindings(viewModel);
