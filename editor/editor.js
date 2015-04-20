(function() {
    var jsonIsValid = function(json) {
        try {
            JSON.parse(json);
            return true;
        } catch (e) {
            return false;
        }
    };

    var cloneDeep = function(obj) {
        return JSON.parse(JSON.stringify(obj));
    };

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
                    lm.trigger('sidebarchange', true);
                }
            }
        });

        var lm = _.extend({
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
            },
            getSidebarState: function() {
                return $sidebarContainer.hasClass('editor_sidebarExpanded');
            }
        }, Backbone.Events);

        return lm;
    });

    // changing this model occurs editor and viewer
    cm.define('wizardConfigModel', [], function() {
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
                return cloneDeep(this.get('config'));
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

    cm.define('viewer', ['wizardConfigModel', 'layoutManager'], function(cm) {
        var wizardConfigModel = cm.get('wizardConfigModel');
        var layoutManager = cm.get('layoutManager');

        var $container = layoutManager.getViewerContainer();

        var vcm;
        var update = function(cfg) {
            $container.empty();
            var $mapContainer = $('<div>');
            $container.append($mapContainer);
            vcm = nsGmx.createGmxApplication($mapContainer.get(0), cfg);
            vcm.create().then(function() {
                layoutManager.expandSidebar();
            });
        };

        update(wizardConfigModel.getConfig());
        wizardConfigModel.on('configchange', function(cfg) {
            update(cfg);
        });

        layoutManager.on('sidebarchange', function(isExpanded) {
            vcm.get('map').invalidateSize();
        });

        return {
            update: update,
            getCm: function() {
                return vcm;
            }
        };
    });

    cm.define('sidebarPanel', ['layoutManager'], function() {
        var $container = cm.get('layoutManager').getSidebarContainer();
        var $sidebarPanel = $('<div>').addClass('sidebarPanel').appendTo($container);
        var $toolbarContainer = $('<div>').addClass('sidebarPanel-toolbarContainer').appendTo($sidebarPanel);
        var $codeEditorContainer = $('<div>').addClass('sidebarPanel-codeEditorContainer').appendTo($sidebarPanel);
        return {
            getToolbarContainer: function() {
                return $toolbarContainer;
            },
            getCodeEditorContainer: function() {
                return $codeEditorContainer;
            }
        }
    });

    cm.define('codeEditor', ['wizardConfigModel', 'sidebarPanel', 'layoutManager'], function(cm) {
        var wizardConfigModel = cm.get('wizardConfigModel');
        var layoutManager = cm.get('layoutManager');
        var $container = cm.get('sidebarPanel').getCodeEditorContainer();
        var $aceContainer = $('<div>')
            .css('position', 'relative')
            .css('width', '100%')
            .css('height', '100%')
            .appendTo($container);
        var codeEditor = ace.edit($aceContainer.get(0));
        codeEditor.setTheme("ace/theme/chrome");
        codeEditor.getSession().setMode("ace/mode/json");
        codeEditor.setValue(JSON.stringify(wizardConfigModel.getConfig(), null, '    '));
        codeEditor.selection.clearSelection();
        layoutManager.on('sidebarchange', function(expanded) {
            codeEditor.resize();
        });
        wizardConfigModel.on('configchange', function(cfg) {
            codeEditor.setValue(JSON.stringify(cfg, null, '    '));
        });
        return codeEditor;
    });

    cm.define('toolbar', ['sidebarPanel'], function(cm) {
        var $container = cm.get('sidebarPanel').getToolbarContainer();
        var dropdownMenuWidget = new nsGmx.DropdownMenuWidget({
            items: [{
                title: 'Refresh',
                id: 'btn-refresh'
            }, {
                title: 'Save',
                id: 'btn-save'
            }]
        });
        dropdownMenuWidget.appendTo($container);
        return dropdownMenuWidget;
    });

    cm.define('saveButton', ['toolbar', 'codeEditor', 'mapsResourceServer'], function(cm) {
        var codeEditor = cm.get('codeEditor');
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

            if (jsonIsValid(codeEditor.getValue())) {
                mapsResourceServer.sendPostRequest('TinyReference/Create.ashx', {
                    content: codeEditor.getValue()
                }).then(function(response) {
                    var viewr = origin.replace('editor.html', 'viewer.html');
                    var unhash = viewr.indexOf('#') === -1 ? viewr : viewr.slice(0, viewr.indexOf('#'));
                    var permalink = unhash + '?config=' + response.Result;
                    $('#popover-save').html(Handlebars.compile(nsGmx.Templates.Editor.saveDialog)({
                        permalink: permalink
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
        return $('#btn-save');
    });

    cm.define('refreshButton', ['toolbar', 'codeEditor', 'viewer'], function() {
        var viewer = cm.get('viewer');
        var codeEditor = cm.get('codeEditor');
        $('#btn-refresh').click(function(je) {
            if (jsonIsValid(codeEditor.getValue())) {
                viewer.update(JSON.parse(codeEditor.getValue()));
            } else {
                console.log('invalid json');
            }
        });
        return $('#btn-refresh');
    });

    cm.define('collapseButton', ['layoutManager'], function() {
        var layoutManager = cm.get('layoutManager');
        var $container = layoutManager.getRootContainer();
        var $collapseButton = $('<div>').addClass('editor-collapseButton').appendTo($container);
        $collapseButton.click(function() {
            layoutManager.toggleSidebar();
        });
        var updateButton = function(sidebarIsExpanded) {
            $collapseButton.toggleClass('icon-angle-left', sidebarIsExpanded);
            $collapseButton.toggleClass('icon-angle-right', !sidebarIsExpanded);
        };
        layoutManager.on('sidebarchange', updateButton);
        updateButton(layoutManager.getSidebarState());
        return $collapseButton;
    });

    cm.create();
})();