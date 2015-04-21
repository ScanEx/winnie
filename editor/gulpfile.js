var gulp = require('gulp');
var concat = require('gulp-concat');
var header = require('gulp-header');
var footer = require('gulp-footer');
var streamqueue = require('streamqueue');
var html2jsobject = require('gulp-html2jsobject');

var styles = ['editor.css', 'wizard.css'];
var scripts = ['editor.js', 'wizard.js', 'configTemplates.js'];
var templates = ['saveDialog.html', 'wizard.html', 'apptypeSwitch.html'];
var images = ['wizard-apptype-map.svg', 'wizard-apptype-storytelling.svg', 'wizard-apptype-sidebar.svg', 'mapbg.png'];

gulp.task('default', function() {
    var sourcesStream = gulp.src(scripts);

    var templatesStream = gulp.src(templates)
        .pipe(html2jsobject('nsGmx.Templates.Editor'))
        .pipe(concat('templates.js'))
        .pipe(header('nsGmx.Templates.Editor = {};\n'))
        .pipe(header('nsGmx.Templates = nsGmx.Templates || {};'))
        .pipe(header('var nsGmx = nsGmx || {};'));

    var cssStream = gulp.src(styles);

    var imgStream = gulp.src(images);

    var jsStream = streamqueue({
            objectMode: true
        }, templatesStream, sourcesStream)
        .pipe(footer(';'))
        .pipe(concat('editor.js'));

    var finalStream = streamqueue({
            objectMode: true
        }, jsStream, cssStream, imgStream)
        .pipe(gulp.dest('build'));
});

gulp.task('watch', ['default'], function() {
    console.log([].concat(styles, scripts, templates));
    gulp.watch([].concat(styles, scripts, templates), ['default']);
});