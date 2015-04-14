(function() {
    cm.define('mapsResourceServer', [], function() {
        return nsGmx.Auth.getResourceServer('geomixer');
    });

    cm.define('authManager', ['mapsResourceServer'], function() {
        return nsGmx.Auth.getAuthManager();
    });

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
                title: 'Save',
                id: 'btn-save'
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

        update();
        $('#btn-refresh').click(function() {
            update();
        });
        return {
            update: update
        };
    });

    cm.define('saveButton', ['toolbar', 'editor', 'mapsResourceServer'], function(cm) {
        var jsonIsValid = function() {
            try {
                JSON.parse(editor.getValue());
                return true;
            } catch (e) {
                return false;
            }
        };

        var editor = cm.get('editor');
        var mapsResourceServer = cm.get('mapsResourceServer');

        $('#btn-save').popover({
            content: '<div id="popover-save"></div>',
            container: 'body',
            placement: 'bottom',
            html: true
        });

        $('#btn-save').on('shown.bs.popover', function() {
            var origin = window.location.search ?
                window.location.href.slice(0, window.location.href.indexOf(window.location.search)) :
                window.location.href;

            $('#popover-save').html(Handlebars.compile(nsGmx.Templates.Editor.saveDialog)({
                permalink: false
            }));

            if (jsonIsValid()) {
                mapsResourceServer.sendPostRequest('TinyReference/Create.ashx', {
                    content: editor.getValue()
                }).then(function(response) {
                    $('#popover-save').html(Handlebars.compile(nsGmx.Templates.Editor.saveDialog)({
                        permalink: origin.replace('editor.html', 'viewer.html') + '?config=' + response.Result
                    }));
                }).fail(function() {
                    $('#popover-save').html('unknown error');
                });
            } else {
                $('#popover-save').html('invalid json');
            }
        });

        $('#btn-save').on('hide.bs.popover', function() {
            $('#popover-save').empty();
        });
        return true;
    });

    cm.define('collapseCodeButton', ['viewer'], function() {
        var viewer = cm.get('viewer');
        var $editorView = $('.editor');
        var $buttonView = $('.editor-collapseCodeButton');
        var toggle = function() {
            $buttonView.toggleClass('icon-angle-left', !$editorView.hasClass('editor_sidebarCollapsed'));
            $buttonView.toggleClass('icon-angle-right', $editorView.hasClass('editor_sidebarCollapsed'));
            viewer.update();
        };
        $buttonView.on('click', function() {
            $editorView.toggleClass('editor_sidebarCollapsed');
            toggle();
        });
        toggle();
        return true;
    });

    cm.create();
})();