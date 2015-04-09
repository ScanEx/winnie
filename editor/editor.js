(function() {
    cm.define('sampleconfig', [], function() {
        return {
            map: {
                center: [55.750303, 37.619934],
                zoom: 8
            },
            gmxMap: {
                mapID: '37TYY',
                apiKey: 'W4IH6K7CJ4'
            },
            zoomControl: 'leaflet',
            hideControl: false,
            centerControl: {
                color: '#121212'
            }
        };
    });

    cm.define('editor', ['sampleconfig'], function(cm) {
        var container = $('<div>')
            .css('position', 'relative')
            .css('width', '100%')
            .css('height', '100%');

        $('.editor-codeFrame').append(container);

        var editor = ace.edit(container.get(0));
        editor.setTheme("ace/theme/chrome");
        editor.getSession().setMode("ace/mode/json");
        editor.setValue(JSON.stringify(cm.get('sampleconfig'), null, '    '));
        editor.selection.clearSelection();
        return editor;
    });

    cm.define('toolbar', [], function(cm) {
        var dropdownMenuWidget = new nsGmx.DropdownMenuWidget({
            items: [{
                title: 'Refresh',
                id: 'btn-refresh'
            }, {
                title: 'Permalink',
                id: 'btn-permalink'
            }]
        });
        dropdownMenuWidget.appendTo($('.editor-toolbarFrame'));
        return dropdownMenuWidget;
    });

    cm.define('viewer', ['toolbar', 'editor'], function(cm) {
        var editor = cm.get('editor');
        var $container = $('.editor-mapFrame');

        var update = function() {
            try {
                var cfg = JSON.parse(editor.getValue());
                $container.empty();
                var $mapContainer = $('<div>')
                    .css('position', 'relative')
                    .css('width', '100%')
                    .css('height', '100%');
                $container.append($mapContainer);
                nsGmx.createMapApplication($mapContainer.get(0), cfg).create();
            } catch (e) {
                console.log('invalid JSON');
            }
        };

        $container.empty();
        update();
        $('#btn-refresh').click(function() {
            update();
        });
        return null;
    });

    cm.create();
})();