/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
// 
//  index.js
//  WebParking
//  
//  Created by  on 2013-04-18.
//  Copyright 2013 . All rights reserved.
//

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
    	if(!app.checkConnection()){
    		alert('Nessuna Connessione Internet');
    	}else{
    		app.showMap();
    		navigator.geolocation.getCurrentPosition(onSuccess, onError);
    	}
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

        //console.log('Received Event: ' + id);
    },
    checkConnection: function(){
    	var networkState = navigator.connection.type;

        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = 'No network connection';
		
		if(states[networkState] == states[Connection.NONE]){
			return false;
		}else{
			return true;
		}
        //alert('Connection type: ' + states[networkState]);
   },
   showMap: function(){
   		var mapOptions = {
			     zoom: 8,
			     center: new google.maps.LatLng(44.355278,8.953857),
			     mapTypeId: google.maps.MapTypeId.ROADMAP
			 }

        map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        //Aggiungi il marker alla mappa
        //var mapBounds = new google.maps.LatLngBounds();
   }
};

var map;
/**
  *	Successo della Geolocalizzazione 
  */
function onSuccess(position){
	/*
	alert('Latitude: '          + position.coords.latitude          + '\n' +
	          'Longitude: '         + position.coords.longitude         + '\n' +
	          'Altitude: '          + position.coords.altitude          + '\n' +
	          'Accuracy: '          + position.coords.accuracy          + '\n' +
	          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
	          'Heading: '           + position.coords.heading           + '\n' +
	          'Speed: '             + position.coords.speed             + '\n' +
	          'Timestamp: '         + position.timestamp                + '\n');
	          */
	var latlon = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
    var markerPosition = new google.maps.Marker({
			position: latlon,
			map: map
	});
	
	var mapBounds = new google.maps.LatLngBounds();
	mapBounds.extend(latlon);
	map.fitBounds(mapBounds);
	map.setZoom(13);
	var userBounds = map.getBounds();
	if(userBounds == null){
		alert("userBounds is NULL");
	}
	callServiceParking(userBounds);
}

/**
 * Errore della Geolocalizzazione
 */
function onError(){
	alert('code: '    + error.code    + '\n' +
	          'message: ' + error.message + '\n');
}

/**
 * Funzione che si occupa di richimare l'interfaccia REST di BE
 * 
 */
function callServiceParking(mapBounds){
	var xmlhttp = null;
	var arrayJSON = null;
	var northEast = mapBounds.getNorthEast();
	var southWest = mapBounds.getSouthWest();
	
	//alert("North East: "+northEast.lat()+ " -- "+northEast.lng());
	//alert("South West: "+southWest.lat()+ " -- "+southWest.lng());	
	
	
	if (window.XMLHttpRequest){
			// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp = new XMLHttpRequest();
		}else{
			// code for IE6, IE5
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		
	//TODO: Da cambiare la chiamata al BE
	var url = "http://allen.phoops.it/parking/index.json?sw_lat="+northEast.lat()+"&sw_lng="+northEast.lng()+"&ne_lat="+southWest.lat()+"&ne_lng="+southWest.lng()+"";
	//alert(url);
	xmlhttp.open("GET", url);	
	alert("Chiama il servizio di BE");
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState==4){
			switch (xmlhttp.status)
			    {
			    case 200: // Do the Do
			    	alert("200");
			    	response = JSON.parse(xmlhttp.responseText);
			    	//alert(xmlhttp.responseText);
			    	arrayJSON = response;
			    	//alert(arrayJSON);
			    	generateParkPOI(arrayJSON);
			    	break;
			    case 404: 
			    	alert("404");
			    	break;
			    case 500:
			    	alert("500");
			    	break;
			    }
		}
	};
	xmlhttp.send();
}

/*
 * Function: Si occupa della generazione dei POI (parcheggi)
 * assegnando una specifica icona dipendente da:
 * percent_capacity = real_time_capacity/total_capacity
 * 			percent_capacity < 0.6 -> Park Free (Icona Verde)
 * 			percent_capacity >= 0.6 || < 1 -> Park Normal (Icona Gialla)
 * 			percent_capacity = 1 -> Park Complete (Icona Rossa)
 * ../img/
 * parseFloat(string)
 */
function generateParkPOI(JSON){
	//alert("Entra in generateParkPOI");
	//alert(JSON);
	var aJSON = JSON.parking;
	//alert("aJSON: "+aJSON);
	//alert("Dimensione array JSON : "+aJSON);
	for (var i=0; i < aJSON.length; i++) {
		var geom = aJSON[i].the_geom;
		var patt = /\d+\.\d+/g;
		//alert(geom);
		var result = geom.match(patt);
		//alert(result.toString());
		var x = result.toString().split(",")[0];
		var y = result.toString().split(",")[1];
		
		//alert(parseFloat(x));
		//alert(parseFloat(y));
		
		var latlonPark = new google.maps.LatLng(parseFloat(y),parseFloat(x));
		var image = 'a.png';
		
		var pGreen = new google.maps.MarkerImage('img/parking-green.png');
		var pYellow = new google.maps.MarkerImage('img/parking-yellow.gif');
		var pRed = new google.maps.MarkerImage('img/parking-red.png');

	    var markerPark = new google.maps.Marker({
				position: latlonPark,
				icon: pGreen,
				map: map
		});
		
		//Calcolo percentuale occupazione
		var percentualCapacity = aJSON[i].real_time_capacity/aJSON[i].total_capacity;
		if(percentualCapacity < 0.6){
			//Parcheggio Free --> ICONA VERDE
			markerPark.setIcon(pGreen);
		}else if(percentualCapacity >= 0.6 && percentualCapacity < 1 ){
			//Parcheggio quasi pieno --> ICONA GIALL
			markerPark.setIcon(pYellow);
		}else{
			//Parcheggio completo --> ICONA ROSSA
			markerPark.setIcon(pRed);
		}
		//var pPark = new google.maps.Point(parseFloat(x),parseFloat(y));
	};
}
