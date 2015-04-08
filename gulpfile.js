var gulp = require('gulp');
var path = require('path');

require('./external/GMXBuilder')(gulp, {
    tempDir: './temp',
    distDir: './dist',
    watchExtensions: ['.js', '.css', '.html', '.less', '.svg']
}, [{
    id: 'gmxApplicationConstructor',
    components: [{
        id: 'Leaflet-GeoMixer',
        srcDir: './external/Leaflet-GeoMixer',
        distFiles: ['./dist/leaflet-geomixer-src.js'],
        build: true,
        watch: false
    }, {
        id: 'Leaflet.TileLayer.Mercator',
        srcDir: './external/Leaflet.TileLayer.Mercator',
        distFiles: ['./src/TileLayer.Mercator.js'],
        build: false,
        watch: false
    }, {
        id: 'Leaflet.gmxBaseLayersManager',
        srcDir: './external/Leaflet.gmxBaseLayersManager',
        distFiles: [
            './src/gmxBaseLayersManager.js',
            './src/initBaseLayersManager.js'
        ],
        build: false,
        watch: false
    }, {
        id: 'gmxControls',
        srcDir: './external/gmxControls',
        distFiles: [
            './dist/gmxControls-src.js',
            './dist/css/gmxControls.css',
            './dist/css/img/band.png',
            './dist/css/img/coords.png',
            './dist/css/img/gmxSprite.png',
            './dist/css/img/logo_footer.png',
            './dist/css/img/logo_footer_color.png'
        ],
        build: true,
        watch: false
    }]
}]);