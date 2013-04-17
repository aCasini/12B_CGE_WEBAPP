function GoogleMap(){
	/**
	 * Option Var per la mappa
	 */
	this.mapOptions;
	/**
	 * Mappa 
	 */
	this.map;
	
	/**
	 * Creazione della Mappa
	 */
	this.createGoogleMap = function(){
		mapOptions = {
			zoom: 8,
			//Center the map
			center: new google.maps.LatLng(44.355278,8.953857),
			mapTypeId: google.maps.MapTypeId.ROADMAP 	//Tipologia di mappa
		}
		map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);	
	}
	
	this.initializeMap = function(){
		//Inizializza la mappa 
		map.initialize();
	}
	
	/**
	 * Aggiunge il marker della geolocalizzazione alla mappa
	 * @Param: map, la mappa sulla quale aggiungere il marker
	 */
	this.addMarkersToMap = function(map){
		
	}
}