function AppViewModel(){
    var self = this;
    self.DisplayingCities = ko.observableArray([]);
    self.searchAnswer = ko.observable("");

    ko.computed(function()
    {
        if(self.searchAnswer() != '')
        {
            self.DisplayingCities(["The", "List", "Items", "Are", "Changing"]);
        }
        else
        {
            self.DisplayingCities(["Dehra Dun", "Mumbai",
            "Durg", "Jhajjar",
            "Vizag", "Pinjore",
            "Lucknow", "Betul",
            "Ludhiana", "Chennai"]);
        }; 
    });
};

ko.applyBindings(new AppViewModel());

//=============================================================================//
//  BELOW GIVEN CONTENT OF THIS JAVASCRIPT CORRESPONDS TO THE GOOGLE MAPS API  //
//=============================================================================//


var map;

function initMap(){
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 23.8374857 , lng: 78.7486267 },
        zoom: 5
    });

    // These are the locations of my friends that will be shown to the user
    // In case the items here become long enough, it is better to be stored in
    //      the database itself.
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

    var largeInfoWindow = new google.maps.InfoWindow();
    
    // For the viewports
    var bounds = new google.maps.LatLngBounds();

    // Create a new blank array for all the markers for friends.
    var markers = [];

    for (var i = 0; i< locations.length; i++){
        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
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
        // Create an onclick event to open an indowindow at each marker.
        marker.addListener('click', function(){
            populateInfoWindow(this, largeInfoWindow);
        });
    }

    map.fitBounds(bounds)

    // This function populates the infowindow when the marker is clicked, We'll only
    // allow one infowindow which will open at the marker that is clicked, and populate based
    // on that markers position.
    function populateInfoWindow(marker, infowindow){
        if (infowindow.marker != marker){
            infowindow.marker = marker;
            infowindow.setContent('<div>' + marker.title + '</div>');
            infowindow.open(map, marker);
            // making sure that the marker property is cleared if the indowindow is closed.
            infowindow.addListener('closeclick', function(){
                infowindow.setMarker(null);
            });
        }
    }

}