define(['jquery'], function ($) {

    var gpsOptions = {enableHighAccuracy: true, timeout: 20000, maximumAge: 10000};

    var onGeoSuccess = function (location) {
        var lat = location.coords.latitude;
        var lon = location.coords.longitude;
        var acc = location.coords.accuracy;

        hideGPSWarning();

        localStorage.setItem("GPSLat", lat);
        localStorage.setItem("GPSLon", lon);

        localStorage.setItem("GPSAcc", acc);

        console.log("GPS " + lat + " " + lon + " " + acc);
        var event = document.createEvent('Event');
        event.initEvent('gpsupdate', true, true);
        document.dispatchEvent(event);
    };

    var showGPSWarning = function () {
        $('#gpsErrorBar').show();
        $('body').css('padding-top', $('#gpsErrorBar').css('height'));
    };

    var hideGPSWarning = function () {
        $('#gpsErrorBar').hide();
        $('body').css('padding-top', 0);
    };

    var deg2rad = function (deg) {
        return deg * (Math.PI / 180);
    };

    var getDistanceFromLatLonInKm = function (lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    };

    var testLocator = function (successCallback, errorCallback) {

        if (!navigator.geolocation) {
            errorCallback();
        }

        navigator.geolocation.getCurrentPosition(successCallback, errorCallback, gpsOptions);
    };

    var initiateLocator = function () {
        navigator.geolocation.watchPosition(onGeoSuccess, showGPSWarning, gpsOptions);
    };

    // return functions as an object
    return {
        getDistanceFromLatLonInKm: getDistanceFromLatLonInKm,
        initiateLocator: initiateLocator,
        testLocator: testLocator
    };
});
