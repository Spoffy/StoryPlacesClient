define([
	'views/debugView'	
	], function (DebugView) {

	var onGeoSuccess = function (location) {
		var lat = location.coords.latitude;
		var lon = location.coords.longitude;
		var acc = location.coords.accuracy;

		localStorage.setItem("GPSLat", lat);
		localStorage.setItem("GPSLon", lon);
		localStorage.setItem("GPSAcc", acc);

		console.log("GPS " + lat + " " + lon + " " + acc);
		
		var event = document.createEvent('Event');
		event.initEvent('gpsupdate', true, true);
		document.dispatchEvent(event);
	};

	var onGeoError = function (error) {
		console.log(error);
	};

	var deg2rad = function (deg) {
		return deg * (Math.PI / 180);
	};

	var readingView;

	var getDistanceFromLatLonInKm = function (lat1, lon1, lat2, lon2) {
		var R = 6371; // Radius of the earth in km
		var dLat = deg2rad(lat2 - lat1);  // deg2rad below
		var dLon = deg2rad(lon2 - lon1);
		var a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
			Math.sin(dLon / 2) * Math.sin(dLon / 2)
			;
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c; // Distance in km
		return d;
	};

	var initiateLocator = function () {
		var html5Options = { enableHighAccuracy: true, timeout: 6000, maximumAge: 10000 };
		navigator.geolocation.watchPosition(onGeoSuccess, onGeoError, html5Options);
	};

	// return functions as an object
	var GPS = {
		getDistanceFromLatLonInKm: getDistanceFromLatLonInKm,
		initiateLocator: initiateLocator
	};

	return GPS;
});
