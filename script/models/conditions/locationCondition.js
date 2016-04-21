define([
    'underscore',
    'backbone',
    'utils/SPGPS',
    'utils/debug'
], function (_, Backbone, GPS, Debug) {

    var LocationCondition = Backbone.Model.extend({
        
        resolveCondition: function (context) {
            if (this.get("locationType") == "circle") {
                return this.resolveCircle(context);
            }
        },

        resolveCircle: function (context) {
            var dis =  GPS.getDistanceFromLatLonInKm(localStorage.getItem("GPSLat"), localStorage.getItem("GPSLon"), this.get("locationData").lat, this.get("locationData").lon)
            console.log("circle check", dis, this.get("locationData").radius, localStorage.getItem("GPSLat"), localStorage.getItem("GPSLon"), this.get("locationData").lat, this.get("locationData").lon)
            Debug.printDebug("circle check " + this.get("name") + " distance:" + dis + " radius:" + this.get("locationData").radius + " ulat:" + localStorage.getItem("GPSLat") + " ulon:" + localStorage.getItem("GPSLon") + " tlat:" + this.get("locationData").lat + " tlon:" + this.get("locationData").lon)
            return (this.get("bool") && dis < this.get("locationData").radius)
        }

    });
    
    return LocationCondition;

});