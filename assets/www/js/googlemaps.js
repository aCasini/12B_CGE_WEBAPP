function GoogleMap(){
    
    this.initialize = function(position){
        var map = showMap();
        addMarkersToMap(map, position);
    }    
    
    var addMarkersToMap = function(map, position){
        var mapBounds = new google.maps.LatLngBounds();
    
        var latitudeAndLongitudeOne = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);

        var markerOne = new google.maps.Marker({
					position: latitudeAndLongitudeOne,
					map: map
				});

		//PER EFFETTUARE LO ZOOM AL EXTENT DEL MARKER
        //mapBounds.extend(latitudeAndLongitudeOne);
        //map.fitBounds(mapBounds);
    }
    
    
    
    var showMap = function(){
        var mapOptions = {
			     zoom: 8,
			     center: new google.maps.LatLng(44.355278,8.953857),
			     mapTypeId: google.maps.MapTypeId.ROADMAP
			 }

        var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        
        return map;
    }
}