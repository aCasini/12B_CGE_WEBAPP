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
    		navigator.geolocation.getCurrentPosition(onSuccess, onError);
    		app.showMap();
    	}
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
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
}

/**
 * Errore della Geolocalizzazione
 */
function onError(){
	alert('code: '    + error.code    + '\n' +
	          'message: ' + error.message + '\n');
}
