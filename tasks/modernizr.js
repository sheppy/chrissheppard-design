/*eslint-env node */

var path = require("path");
var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();
var config = require("./config");


// Compile Modernizr
gulp.task("modernizr", function () {
    return gulp
        .src([
            path.join(config.dir.es6, config.glob.es6),
            path.join(config.dir.scss, config.glob.scss)
        ])
        .pipe(plugins.plumber())
        .pipe(plugins.modernizr())
        .pipe(plugins.plumber.stop())
        .pipe(gulp.dest(config.dir.js));
});
