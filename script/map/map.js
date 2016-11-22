/* *****************************************************************************
 *
 * StoryPlaces
 *

This application was developed as part of the Leverhulme Trust funded 
StoryPlaces Project. For more information, please visit storyplaces.soton.ac.uk

Copyright (c) 2016
  University of Southampton
    Charlie Hargood, cah07r.ecs.soton.ac.uk
    Kevin Puplett, k.e.puplett.soton.ac.uk
    David Pepper, d.pepper.soton.ac.uk

All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * The name of the Universities of Southampton nor the name of its 
      contributors may be used to endorse or promote products derived from 
      this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE ABOVE COPYRIGHT HOLDERS BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

***************************************************************************** */

"use strict";

define([
    'leaflet'
], function (L) {
    
    var tileLayer;
    var map;
    
    var StoryMap = L.Map.extend({
        defaultLocation: [50.935360, -1.396226],
        defaultZoom: 16,
        trackGPSLocation: false,
        attributionText: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        tileUrl: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png?',

        initialize: function(mapDomElement) {
          console.log("**  Initialising Map into ", mapDomElement);
          L.Map.prototype.initialize.call(this, mapDomElement, {zoomControl: false});

          this.setView(this.defaultLocation, this.defaultZoom);

          tileLayer = L.tileLayer(this.tileUrl, { attribution: this.attributionText });
          tileLayer.addTo(this);

          if (this.trackGPSLocation) {
              this.setupGPSTracking();
          }

          this.on('click', function(e){
              document.mclat = e.latlng.lat
              document.mclng = e.latlng.lng    
          });            

        },

        setupGPSTracking: function () {
            this.locate({setView: true, maxZoom: 16, watch: true, maximumAge: 10000});
        },

        centerOn: function(latlng) {
            this.setView(latlng);
        },

        reattachMapObject: function (mapDomElement) {
            console.log("** Reattaching Map into ", mapDomElement);
            mapDomElement.parentElement.replaceChild(this.getContainer(), mapDomElement);
        },

        refresh: function() {
            this.invalidateSize();
        },

        //Story Marker Handling
        //#####################

        leafletMarkers: {},

        createMarker: function(storyMarker) {
            var marker = L.marker( [ storyMarker.get("lat"), storyMarker.get("lon") ]
                                 , { icon: storyMarker.get("icon") }
                                 );
            if(storyMarker.get("popupContent")) {
                marker.bindPopup(storyMarker.get("popupContent"));
            }

            return marker;
        },

        /* Get the Leaflet marker current associated with the story marker, or creates a new one.
        */
        getOrCreateLeafletMarker: function(storyMarker) {
            return this.leafletMarkers[storyMarker.id] || this.createMarker(storyMarker);
        },

        getLeafletMarker: function(storyMarker) {
            return this.leafletMarkers[storyMarker.id];
        },

        mapStoryMarkerToLeafletMarker: function(storyMarker, leafletMarker) {
            this.leafletMarkers[storyMarker.id] = leafletMarker;
        },

        /* Add a leaflet marker and watch the Story marker for changes
        */
        addStoryMarkerToMap: function (storyMarker) {
            if (!storyMarker) { return; }
            //Get provides protection against creating more than 1 marker per Story Marker
            var leafletMarker = this.getOrCreateLeafletMarker(storyMarker);
            this.mapStoryMarkerToLeafletMarker(storyMarker, leafletMarker);
            
            leafletMarker.addTo(this);
            this.watchStoryMarker(storyMarker);
        },

        /* Remove the leaflet marker and stop watching the Story Marker for changes
        */
        removeStoryMarkerFromMap: function (storyMarker) {
            if (!storyMarker) { return; }
            if (this.getLeafletMarker(storyMarker)) {
                this.removeLayer(storyMarker);
            }
        },

        /* Watches the story marker for changes that would affect the leaflet marker.
        */
        watchStoryMarker: function(storyMarker) {
            this.updateMarkerIcon(storyMarker, storyMarker.get("icon"));
            storyMarker.on("change:icon", this.updateMarkerIcon, this);

            this.updateMarkerVisibility(storyMarker, storyMarker.get("visible"));
            storyMarker.on("change:visible", this.updateMarkerVisibility, this);

            //Add Lat/Lon?
        },

        unwatchStoryMarker: function(storyMarker) {
            storyMarker.off(null, null, this);
        },

        updateMarkerVisibility: function(storyMarker, visibility) {
            var leafletMarker = this.getOrCreateLeafletMarker(storyMarker);
            //Opacity may not work... can use "map.hasLayer" instead?
            //var opacity = visibility? 1 : 0;
            //leafletMarker.setOpacity(opacity);
        },

        updateMarkerIcon: function(storyMarker, newIcon) {
            //Handles the case when it's set to null/undefined in the model.
            if(!newIcon) { return; }
            var leafletMarker = this.getOrCreateLeafletMarker(storyMarker);
            leafletMarker.setIcon(newIcon);
        }
    });

    StoryMap.bindMapIntoDOM = function (mapDomElement) {
        if (!map) {
            map = new StoryMap(mapDomElement);
        } else {
            this.reattachMapObject(mapDomElement);
        }
    };

    return StoryMap;
});
