(function() {
    cm.define('layoutManager', [], function() {
        var mapEl = L.DomUtil.create('div', 'mapContainer', document.body);
        return {
            getMapContainer: function() {
                return mapEl;
            }
        }
    });
    
    cm.define('mapApplicationConstructor', ['layoutManager'], function(cm, cb) {
        var layoutManager = cm.get('layoutManager');
        var macm = nsGmx.createMapApplication(layoutManager.getMapContainer(), {
            gmxMap: {
                mapID: 'UFKQE'
            }
        })
        macm.create().then(function() {
            cb(macm);
        });
    });

    cm.create();
})();