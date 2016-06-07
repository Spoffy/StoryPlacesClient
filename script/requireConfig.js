// provides configurations for require.js

require.config({
    paths: {
        jquery: 'libs/jquery-1.12.3.min',
        underscore: 'libs/underscore-1.8.3.min',
        backbone: 'libs/backbone-1.3.3.min',
        backbone_dual: 'libs/Backbone.dualStorage-1.4.0/backbone.dualstorage.amd',
        moment: 'libs/moment.min',
        leaflet: 'libs/leaflet',
        SPGPS: 'utils/SPGPS',
        iconRepository: 'map/icons/iconRepository',
        iconFactory: 'map/icons/iconFactory',
        map: 'map/map',
        mapReadingView: 'views/mapReadingView',
        listReadingView: 'views/listReadingView',
        cardView: 'views/cardView',
        readingView: 'views/readingView',
        Card: 'models/card',
        CardState: 'models/cardState',
        Story: 'models/story',
        Reading: 'models/reading',
        Marker: 'models/marker',
        StoryRepository: 'repositories/storyRepository',
        ReadingRepository: 'repositories/readingRepository',
        CardCollection: 'collections/cardCollection',
        CardStateCollection: 'collections/cardStateCollection',
        StoryCollection: 'collections/storyCollection',
        MarkerCollection: 'collections/markerCollection'
    }
});

require(['app'], function(App){
    App.initialize();    
});