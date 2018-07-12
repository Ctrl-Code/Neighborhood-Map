var map;
var markers = [];
var message = ko.observable(null);
var searchString = ko.observable("");
var displayingCities = ko.observableArray([]);
var displayingCitiesIndex = ko.observableArray([]);
var cities = ko.observableArray([
    "Dehra Dun", "Mumbai",
    "Durg", "Jhajjar",
    "Vizag", "Pinjore",
    "Lucknow", "Betul",
    "Ludhiana", "Chennai"]);

//  Locations of friends specified with lattitude and longitude.
var locations = [
    { title: 'Nikhil from DehraDun', location: {lat: 30.3254285, lng: 78.0171347}},
    { title: 'Giridhar from Mumbai', location: {lat: 18.9891478, lng: 73.0441442}},
    { title: 'Gurleen from Durg', location: {lat: 21.1923787, lng: 81.2826475}},
    { title: 'Vikrant from Jhajjar', location: {lat: 28.6065394, lng: 76.6577713}},
    { title: 'Hem from Vizag', location: {lat: 17.7386722, lng: 83.2625912}},
    { title: 'Himanshu from Pinjore', location: {lat: 30.7946308, lng: 76.9167098}},
    { title: 'Ekagra from Lucknow', location: {lat: 26.848692, lng: 80.9425127}},
    { title: 'Tushar from Betul', location: {lat: 21.906995, lng: 77.9003798}},
    { title: 'Rumeet from Ludhiana', location: {lat: 30.9003452, lng: 75.8566733}},
    { title: 'Sugandh from Chennai', location: {lat: 13.0475255, lng: 80.2090117}},
];

//  For FourSquare API
var clientId = "NWMFFCOGYW3RKGYERVDHSLBSSM2A51XPIAYBFZYUGNG3YDJR";
var clientSecret = "IN30A4WARYNLIVGAHBATFWVGXOIP3ITG2Y3WWCR1PHSAVFDQ";


//  Asynchronous call made by 'Google Maps API'.
function initMap(){
    var nearbyPlacesData = "";
    var lastId = -1;
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 23.8374857 , lng: 78.7486267 },
        zoom: 5
    });
    var largeInfoWindow = new google.maps.InfoWindow();

    // For the viewports
    var bounds = new google.maps.LatLngBounds();
    map.fitBounds(bounds)

    ko.computed(function(){
        deleteMarkers();    
        var len = displayingCitiesIndex().length;
        for (var i = 0; i< len; i++){
            
            // Get the position from the location array.
            var position = locations[displayingCitiesIndex()[i]].location;
            var title = locations[displayingCitiesIndex()[i]].title;
            var marker = new google.maps.Marker({
                map: map,
                position:position,
                title: title,
                animation: google.maps.Animation.DROP,
                id: i,
            });
            
            // Push the marker to our array of markers.
            markers.push(marker);
            
            // Extend the boundaries of the map for each marker
            bounds.extend(marker.position);
            
            // Create an onclick event to open an infoWindow at each marker.
            marker.addListener('click', function(){
                populateInfoWindow(this, largeInfoWindow);
            });
        };
    });

    
    // Create an onclick event to open an infoWindow at each displayed city on the map
    mapDataShow = function (name){
        len = cities().length;
        for(var i=0; i<len; ++i){
            if(cities()[i] == name){
                var coordinates = locations[i].location.lat + "," + locations[i].location.lng;
                
                //  For getting information regarding new Places at particular location
                run4SquareAPI(coordinates);

                var contentString = '<div><strong>' + cities()[i] + '</strong><br>' + nearbyPlacesData + '</div>';
                var infowindow = new google.maps.InfoWindow({
                    content: contentString,
                    position: locations[i].location
                  });
                infowindow.open(map);
                setTimeout(function(){infowindow.close()},5000);
            }
        }
    };


    // This function populates the infowindow when the marker is clicked, We'll only
    // allow one infowindow which will open at the marker that is clicked, and populate based
    // on that markers position.
    function populateInfoWindow(marker, infowindow){
        if (infowindow.marker != marker){
            getNearbyPlaces(marker.position);
            infowindow.marker = marker;
            infowindow.setContent('<div>' + marker.title + '<br>' + nearbyPlacesData + '</div>');
            if(lastId > -1){
                markers[lastId].setAnimation(null);
                marker.setAnimation(google.maps.Animation.BOUNCE);
                lastId = marker.id;
            }
            else{
                marker.setAnimation(google.maps.Animation.BOUNCE);
                lastId = marker.id;
            }
            infowindow.open(map, marker);
            setTimeout(function(){infowindow.close()},8000);
            setTimeout(function(){marker.setAnimation(null)},8000);
        };
    };


    function getNearbyPlaces(str){
        str = trimBracketsFromPosition(str);
        run4SquareAPI(str);
    };


    //  This function trims the brackets for the lattitude and longitude recieved which
    //      are of the form `(a, b)` making them `a,b`.
    function trimBracketsFromPosition(str){
        str = "" + str + "";
        str = str.substr(1);
        str = str.substr(0,str.length-1);
        return str;
    };


    // This function requests the use of 'FourSquares' API. Sending requests
    //      and handling the response along with the error handling which is done
    //      automatically with the code in 'onreadyState' function.
    function run4SquareAPI(latAndLon){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200){
                ans = JSON.parse(this.responseText);
                nearbyPlacesData = "";
                // This answerString would be added to the infoWindow and thus is added with HTML
                answerString = "";
                answerString += "<strong>Nearby Places are</strong><br>" + ans.response.venues[0].name;
                answerString += "<br>" + ans.response.venues[0].location.distance + "metres";
                answerString += "<br>" + ans.response.venues[1].name;
                answerString += "<br>" + ans.response.venues[1].location.distance + "metres";
                nearbyPlacesData += answerString;
                }
            };
        var link = "https://api.foursquare.com/v2/venues/search?ll=" + latAndLon +
            "&client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20180710";
        
        //  Below given 'jqxhr' is Jquery Object for handling errors in the FourSquare API
        var jqxhr = $.ajax(link)
            .done(function() {
              xhttp.open("GET", link, false);
              xhttp.send();
            })
            
            .fail(function() {
                var textMessage = "An error occured while loading the FourSquare API\n";
                textMessage += "Try reloading.";
                alert(textMessage);
            });
    };


    //  Below given set of 3 functions corresponds to the deletion of markers.
    //      i.e. setMapOnAll(), clearMarkers(), deleteMarkers() below.
    function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
    }


    function clearMarkers() {
        setMapOnAll(null);
    }


    function deleteMarkers() {
        clearMarkers();
        markers = [];
    }
};


// Error handling incase the google API is offline.
window.googleError = function(){
    alert("An error occured while loading Google Maps\nPleas try reloading.")
};


function AppViewModel(){
    ko.computed(function(){
        // Calculating Index of cities from 'cities' that match the
        //      'SearchString' and then storing it in array 'displayCitiesIndex'.
        calculateIndexes();
        
        //  This will match the corresponding indexes of 'displayCitiesIndex' and
        //      store the cities to be displayed on the screen in array 'displayCities'
        renderCities();
    });


    function calculateIndexes(){
        displayingCitiesIndex([]);
        var len = cities().length;
        for(var i = 0; i < len; ++i){
            var index = cities()[i].indexOf(searchString());
            if (index != -1){
                displayingCitiesIndex.push(i);
            }
        }
    };

    
    function renderCities(){
        displayingCities([]);
        var len = displayingCitiesIndex().length;
        for(var i=0; i<len; ++i){
            displayingCities.push(cities()[displayingCitiesIndex()[i]]);        
        }
    };
};


ko.applyBindings(new AppViewModel());