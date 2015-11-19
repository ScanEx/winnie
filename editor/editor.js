(function() {
    function jsonIsValid(json) {
        try {
            JSON.parse(json);
            return true;
        } catch (e) {
            return false;
        }
    }

    function cloneDeep(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    var ConfigModel = Backbone.Model.extend({
        initialize: function(cfg) {
            this.setValue(cfg);
        },
        setValue: function(val) {
            this.set('value', val);
        },
        getValue: function() {
            return this.get('value');
        },
        _setProperties: function(obj, props) {
            var val = {};
            for (var i = 0; i < props.length; i++) {
                obj[props[i]] && (val[props[i]] = obj[props[i]]); 
            }
        }
    });

    var AppConfigModel = ConfigModel.extend({
        setValue: function(val) {
            ConfigModel.prototype.setValue.call(this, _.pick(val, 'app', 'layers', 'user'));
        }
    });

    var StateConfigModel = ConfigModel.extend({
        setValue: function(val) {
            ConfigModel.prototype.setValue.call(this, _.pick(val, 'state'));
        }
    });

    cm.define('urlManager', [], function(cm) {
        var parser = document.createElement('a');
        parser.href = window.location.href;

        var getQueryVariable = function(variable) {
            var query = parser.search.substring(1);
            var vars = query.split('&');
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=');
                if (decodeURIComponent(pair[0]) == variable) {
                    return decodeURIComponent(pair[1]);
                }
            }
        };

        return {
            getParam: getQueryVariable
        };
    });

    cm.define('winnieConfig', [], function(cm, cb) {
        $.ajax('resources/winnieConfig.json').then(function(cfg) {
            cb(cfg);
        }, function() {
            cb(false);
        });
    });

    cm.define('permalinkConfig', ['urlManager'], function(cm, cb) {
        var urlManager = cm.get('urlManager');
        if (urlManager.getParam('config')) {
            var oReq = new XMLHttpRequest();
            oReq.onload = function(e) {
                if (e.currentTarget.readyState === 4 && e.currentTarget.status === 200) {
                    try {
                        var rt = e.currentTarget.response || e.currentTarget.responseText;
                        var jr = JSON.parse(rt.slice(1, -1));
                        var cfg = JSON.parse(jr.Result);
                        cb(cfg);
                    } catch (e) {
                        console.warn('invalid JSON');
                        cb({});
                    }
                }
            };
            oReq.open('get', 'http://maps.kosmosnimki.ru/TinyReference/Get.ashx?id=' + urlManager.getParam('config'), true);
            oReq.send();
        } else {
            return {};
        }
    });

    cm.define('defaultConfig', [], function(cm, cb) {
        $.ajax('resources/defaultMapConfig.json').then(function(cfg) {
            cb(cfg);
        }, function() {
            cb({});
        });
    });

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
        var $wizardContainer = $('<div>').addClass('editor-wizardContainer').appendTo($rootContainer);

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
                return $sidebarContainer.show();
            },
            getViewerContainer: function() {
                return $viewerContainer.show();
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
            },
            getWizardContainer: function() {
                return $wizardContainer;
            }
        }, Backbone.Events);

        return lm;
    });

    cm.define('appConfigModel', ['permalinkConfig', 'defaultConfig'], function(cm) {
        var permalinkConfig = cm.get('permalinkConfig');
        var defaultConfig = cm.get('defaultConfig');
        var appConfigModel = new AppConfigModel(_.isEmpty(permalinkConfig) ? defaultConfig : permalinkConfig);
        return appConfigModel;
    });

    cm.define('stateConfigModel', ['permalinkConfig', 'defaultConfig'], function() {
        var permalinkConfig = cm.get('permalinkConfig');
        var defaultConfig = cm.get('defaultConfig');
        var stateConfigModel = new StateConfigModel(_.isEmpty(permalinkConfig) ? defaultConfig : permalinkConfig);
        return stateConfigModel;
    });

    cm.define('viewer', ['layoutManager', 'appConfigModel', 'stateConfigModel'], function(cm) {
        var layoutManager = cm.get('layoutManager');
        var appConfigModel = cm.get('appConfigModel');
        var stateConfigModel = cm.get('stateConfigModel');

        var Viewer = L.Class.extend({
            includes: [L.Mixin.Events],
            initialize: function(options) {
                L.setOptions(this, options);
                this._vcm = null;

                this.options.appConfigModel.on('change', this.update.bind(this));
                this.options.stateConfigModel.on('change', this.update.bind(this));
                this.update();

                this.options.layoutManager.on('sidebarchange', function(isExpanded) {
                    this._vcm.get('map').invalidateSize();
                }.bind(this));
            },
            update: function() {
                if (this._changing) {
                    return;
                }
                var cfg = _.extend({}, this.options.appConfigModel.getValue(), this.options.stateConfigModel.getValue());
                this.options.container.innerHTML = '';
                var mapContainerEl = L.DomUtil.create('div', 'editor-viewerContainer', this.options.container);
                this._vcm = nsGmx.createGmxApplication(mapContainerEl, cfg);
                this._vcm.create().then(function() {
                    this.fire('created');
                    this._bindUpdatingEvents();
                    this.options.layoutManager.expandSidebar();
                }.bind(this));
            },
            getCm: function() {
                return $.Deferred(function(def) {
                    if (this._vcm) {
                        def.resolve(this._vcm);
                    } else {
                        this.once('created', function() {
                            def._resolve(this._vcm);
                        });
                    }
                }.bind(this)).promise();
            },
            _bindUpdatingEvents: function() {
                this._vcm.get('baseLayersManager').on('baselayeractiveids baselayerchange', this._updateStateConfigModel.bind(this));
                this._vcm.get('layersTree').on('childChange', this._updateStateConfigModel.bind(this));
                this._vcm.get('map').on('dragend zoomend', this._updateStateConfigModel.bind(this));
            },
            _updateStateConfigModel: function() {
                this._changing = true;
                this.options.stateConfigModel.setValue({
                    state: this._vcm.get('permalinkManager').serialize().components
                });
                this._changing = false;
            }
        });

        return new Viewer({
            container: layoutManager.getViewerContainer()[0],
            layoutManager: layoutManager,
            appConfigModel: appConfigModel,
            stateConfigModel: stateConfigModel
        });
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

    cm.define('codeEditor', ['appConfigModel', 'sidebarPanel', 'layoutManager', 'viewer'], function(cm) {
        var viewer = cm.get('viewer');
        var appConfigModel = cm.get('appConfigModel');
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
        codeEditor.setValue(JSON.stringify(appConfigModel.getValue(), null, '    '));
        codeEditor.selection.clearSelection();
        layoutManager.on('sidebarchange', function(expanded) {
            codeEditor.resize();
        });
        appConfigModel.on('change', function() {
            codeEditor.setValue(JSON.stringify(appConfigModel.getValue(), null, '    '));
            codeEditor.selection.clearSelection();
        });
        return codeEditor;
    });

    cm.define('toolbar', ['sidebarPanel'], function(cm) {
        var $container = cm.get('sidebarPanel').getToolbarContainer();
        var dropdownMenuWidget = new nsGmx.DropdownMenuWidget({
            items: [{
                title: 'Refresh',
                id: 'btn-refresh',
                fonticon: 'icon-refresh'
            }, {
                title: 'Save',
                id: 'btn-save',
                fonticon: 'icon-link'
            }, {
                title: 'Wizard',
                id: 'btn-wizard',
                fonticon: 'icon-magic'
            }]
        });
        dropdownMenuWidget.appendTo($container);
        return dropdownMenuWidget;
    });

    cm.define('saveButton', ['toolbar', 'appConfigModel', 'mapsResourceServer', 'viewer', 'winnieConfig'], function(cm) {
        var viewer = cm.get('viewer');
        var winnieConfig = cm.get('winnieConfig');
        var appConfigModel = cm.get('appConfigModel');
        var stateConfigModel = cm.get('stateConfigModel');
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

            if (appConfigModel.getValue()) {
                viewer.getCm().then(function(vcm) {
                    var cfg = _.extend({}, appConfigModel.getValue(), stateConfigModel.getValue());
                    mapsResourceServer.sendPostRequest('TinyReference/Create.ashx', {
                        content: JSON.stringify(cfg)
                    }).then(function(response) {
                        var permalink = window.location.protocol + '//' + window.location.host + winnieConfig.viewerUrl + '?config=' + response.Result;
                        $('#popover-save').html(Handlebars.compile(nsGmx.Templates.Editor.saveDialog)({
                            permalink: permalink
                        }));
                    }).fail(function() {
                        $('#popover-save').html('unknown error');
                    });
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

    cm.define('refreshButton', ['toolbar', 'codeEditor', 'appConfigModel'], function() {
        var appConfigModel = cm.get('appConfigModel');
        var codeEditor = cm.get('codeEditor');
        $('#btn-refresh').click(function(je) {
            if (jsonIsValid(codeEditor.getValue())) {
                appConfigModel.setValue(JSON.parse(codeEditor.getValue()));
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

    cm.define('wizardButton', ['toolbar', 'layoutManager'], function() {
        var layoutManager = cm.get('layoutManager');
        var $btn = $('#btn-wizard');
        $btn.click(function() {
            layoutManager.getWizardContainer().show();
        });
        return $btn;
    });

    cm.define('configWizard', ['layoutManager', 'appConfigModel', 'permalinkConfig'], function() {
        var appConfigModel = cm.get('appConfigModel');
        var permalinkConfig = cm.get('permalinkConfig');
        var layoutManager = cm.get('layoutManager');

        if (!_.isEmpty(permalinkConfig)) {
            layoutManager.getWizardContainer().hide();
        }

        var configWizard = new nsGmx.ConfigWizard();
        configWizard.appendTo(layoutManager.getWizardContainer());

        configWizard.on('configchange', function(cfg) {
            appConfigModel.setValue(cfg);
            layoutManager.getWizardContainer().hide();
        });
        return configWizard;
    });

    cm.define('globals', ['appConfigModel', 'stateConfigModel'], function(cm) {
        window.acm = cm.get('appConfigModel');
        window.scm = cm.get('stateConfigModel');
        window.lm = cm.get('layoutManager');
        return null;
    });

    cm.create();
})();