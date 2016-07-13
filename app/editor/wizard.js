var nsGmx = nsGmx || {};
nsGmx.ConfigWizard = (function() {
    var mousetoggle = function(el, className) {
        $(el).on('mouseenter', function() {
            $(this).addClass(className);
        }).on('mouseleave', function() {
            $(this).removeClass(className);
        });
    };

    var ApptypeSwitch = function() {
        this._view = $(nsGmx.Templates.Editor.apptypeSwitch);
        mousetoggle(this._view, 'apptypeSwitch_hovered');
        mousetoggle(this._view.find('.apptypeSwitch-button'), 'apptypeSwitch-button_hovered');
        this._view.find('.apptypeSwitch-button').on('click', function(je) {
            this._view.find('.apptypeSwitch-button').removeClass('apptypeSwitch-button_active');
            $(je.currentTarget).addClass('apptypeSwitch-button_active');
            this.trigger('switch', $(je.currentTarget).attr('data-apptype'));
        }.bind(this));
    };

    ApptypeSwitch.prototype = Backbone.Events;

    ApptypeSwitch.prototype.appendTo = function(container) {
        this._view.appendTo(container);
    };

    var ConfigWizard = function() {
        this._view = $(nsGmx.Templates.Editor.wizard);
        this._configTemplates = {};
        this._apptypeSwitch = new ApptypeSwitch();
        this._apptypeSwitch.appendTo(this._view.find('.configWizard-apptypeSwitch'))
        this._apptypeSwitch.on('switch', function(apptype) {
            this.trigger('configchange', nsGmx.ConfigTemplates[apptype]);
        }.bind(this));
    };

    ConfigWizard.prototype = Backbone.Events;

    ConfigWizard.prototype.appendTo = function(container) {
        this._view.appendTo(container);
    };

    return ConfigWizard;
})();
