(function() {
    cm.define('editor', [], function(cm) {
        var editor = ace.edit('editor');
        editor.setTheme("ace/theme/chrome");
        editor.getSession().setMode("ace/mode/json");
        return editor;
    });

    cm.define('toolbar', [], function(cm) {
        var dropdownMenuWidget = new nsGmx.DropdownMenuWidget({
            items: [{
                title: 'Refresh'
            }, {
                title: 'Permalink'
            }]
        });
        dropdownMenuWidget.appendTo($('.editor-toolbarFrame'));
        return dropdownMenuWidget;
    });

    cm.create();
})();