(function() {
    cm.define('mapsResourceServer', [], function() {
        return nsGmx.Auth.getResourceServer('geomixer');
    });

    cm.define('authManager', ['mapsResourceServer'], function() {
        return nsGmx.Auth.getAuthManager();
    });

    cm.define('layoutManager', [], function(cm) {
        var $rootContainer = $('.editor');
        var $sidebarContainer = $('<div>').addClass('editor-sidebarContainer').appendTo($rootContainer);
        var $viewerContainer = $('<div>').addClass('editor-viewerContainer').appendTo($rootContainer);

        $sidebarContainer.on('transitionend', function(je) {
            if (je.originalEvent.propertyName === 'width') {
                if ($sidebarContainer.hasClass('editor_sidebarExpanded')) {
                    $viewerContainer.addClass('editor_sidebarExpanded');
                }
            }
        });

        return _.extend({
            getRootContainer: function() {
                return $rootContainer;
            },
            getSidebarContainer: function() {
                return $sidebarContainer;
            },
            getViewerContainer: function() {
                return $viewerContainer;
            },
            expandSidebar: function() {
                $sidebarContainer.addClass('editor_sidebarExpanded');
                this.trigger('sidebarchange', true);
            },
            collapseSidebar: function() {
                $sidebarContainer.removeClass('editor_sidebarExpanded');
                $viewerContainer.removeClass('editor_sidebarExpanded');
                this.trigger('sidebarchange', false);
            },
            toggleSidebar: function() {
                if ($sidebarContainer.hasClass('editor_sidebarExpanded')) {
                    this.collapseSidebar();
                    return false;
                } else {
                    this.expandSidebar();
                    return true;
                }
            }
        }, Backbone.Events);
    });

    cm.define('configManager', [], function() {
        var ConfigModel = Backbone.Model.extend({
            initialize: function(cfg) {
                this.setConfig(cfg);
                this.on('change:config', function() {
                    this.trigger('configchange', this.get('config'));
                }.bind(this));
            },
            setConfig: function(cfg) {
                this.set('config', cfg);
            },
            getConfig: function() {
                return this.get('config');
            }
        });

        return new ConfigModel({
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
            },
            layersTreeWidget: {

            }
        });
    });

    cm.define('viewer', ['configManager', 'layoutManager'], function(cm) {
        var configManager = cm.get('configManager');
        var layoutManager = cm.get('layoutManager');

        var $container = layoutManager.getViewerContainer();

        var cm;
        var update = function() {
            var cfg = configManager.getConfig();
            var $mapContainer = $('<div>');
            $container.append($mapContainer);
            cm = nsGmx.createGmxApplication($mapContainer.get(0), cfg);
            cm.create();
        };

        update();
        configManager.on('configchange', function(cfg) {
            update();
        });

        return {
            update: update,
            getCm: function() {
                return cm;
            }
        };
    });

    // cm.define('editor', ['sampleconfig'], function(cm) {
    //     var container = $('<div>')
    //         .css('position', 'relative')
    //         .css('width', '100%')
    //         .css('height', '100%');

    //     $('.editor-codeFrame').append(container);

    //     var editor = ace.edit(container.get(0));
    //     editor.setTheme("ace/theme/chrome");
    //     editor.getSession().setMode("ace/mode/json");
    //     editor.setValue(JSON.stringify(cm.get('sampleconfig'), null, '    '));
    //     editor.selection.clearSelection();
    //     return editor;
    // });

    // cm.define('toolbar', [], function(cm) {
    //     var dropdownMenuWidget = new nsGmx.DropdownMenuWidget({
    //         items: [{
    //             title: 'Refresh',
    //             id: 'btn-refresh'
    //         }, {
    //             title: 'Save',
    //             id: 'btn-save'
    //         }]
    //     });
    //     dropdownMenuWidget.appendTo($('.editor-toolbarFrame'));
    //     return dropdownMenuWidget;
    // });

    // cm.define('viewer', ['toolbar', 'editor'], function(cm) {
    //     var editor = cm.get('editor');
    //     var $container = $('.editor-mapFrame');

    //     var cm;
    //     var update = function() {
    //         try {
    //             var cfg = JSON.parse(editor.getValue());
    //             $container.empty();
    //             var $mapContainer = $('<div>')
    //                 .css('position', 'relative')
    //                 .css('width', '100%')
    //                 .css('height', '100%');
    //             $container.append($mapContainer);
    //             cm = nsGmx.createGmxApplication($mapContainer.get(0), cfg);
    //             cm.create();
    //         } catch (e) {
    //             console.log('invalid JSON');
    //         }
    //     };

    //     update();
    //     $('#btn-refresh').click(function() {
    //         update();
    //     });
    //     return {
    //         update: update,
    //         getCm: function() {
    //             return cm;
    //         }
    //     };
    // });

    // cm.define('saveButton', ['toolbar', 'editor', 'mapsResourceServer'], function(cm) {
    //     var jsonIsValid = function() {
    //         try {
    //             JSON.parse(editor.getValue());
    //             return true;
    //         } catch (e) {
    //             return false;
    //         }
    //     };

    //     var editor = cm.get('editor');
    //     var mapsResourceServer = cm.get('mapsResourceServer');

    //     $('#btn-save').popover({
    //         content: '<div id="popover-save"></div>',
    //         container: 'body',
    //         placement: 'bottom',
    //         html: true
    //     });

    //     $('#btn-save').on('shown.bs.popover', function() {
    //         var origin = window.location.search ?
    //             window.location.href.slice(0, window.location.href.indexOf(window.location.search)) :
    //             window.location.href;

    //         $('#popover-save').html(Handlebars.compile(nsGmx.Templates.Editor.saveDialog)({
    //             permalink: false
    //         }));

    //         if (jsonIsValid()) {
    //             mapsResourceServer.sendPostRequest('TinyReference/Create.ashx', {
    //                 content: editor.getValue()
    //             }).then(function(response) {
    //                 $('#popover-save').html(Handlebars.compile(nsGmx.Templates.Editor.saveDialog)({
    //                     permalink: origin.replace('editor.html', 'viewer.html') + '?config=' + response.Result
    //                 }));
    //             }).fail(function() {
    //                 $('#popover-save').html('unknown error');
    //             });
    //         } else {
    //             $('#popover-save').html('invalid json');
    //         }
    //     });

    //     $('#btn-save').on('hide.bs.popover', function() {
    //         $('#popover-save').empty();
    //     });
    //     return true;
    // });

    // cm.define('collapseButton', ['viewer', 'editor'], function() {
    //     var viewer = cm.get('viewer');
    //     var editor = cm.get('editor');
    //     var $mapView = $('.editor-mapFrame');
    //     var $sidebarView = $('.editor-sidebarFrame');
    //     var $buttonView = $('.editor-collapseButton');
    //     var toggleButtonState = function() {
    //         $buttonView.toggleClass('icon-angle-left', !$sidebarView.hasClass('editor_sidebarCollapsed'));
    //         $buttonView.toggleClass('icon-angle-right', $sidebarView.hasClass('editor_sidebarCollapsed'));
    //     };
    //     var kickMap = function() {
    //         viewer.getCm().get('map') && viewer.getCm().get('map').invalidateSize();
    //         editor.resize();
    //     };
    //     $sidebarView.on('transitionend', function(je) {
    //         if (je.originalEvent.propertyName === 'width') {
    //             if (!$sidebarView.hasClass('editor_sidebarCollapsed')) {
    //                 $mapView.removeClass('editor_sidebarCollapsed');
    //             }
    //             kickMap();
    //         }
    //     });
    //     $buttonView.on('click', function() {
    //         $sidebarView.toggleClass('editor_sidebarCollapsed');
    //         if ($sidebarView.hasClass('editor_sidebarCollapsed')) {
    //             $mapView.addClass('editor_sidebarCollapsed');
    //         }
    //         toggleButtonState();
    //         kickMap();
    //     });
    //     toggleButtonState();
    //     return true;
    // });

    cm.create();
})();