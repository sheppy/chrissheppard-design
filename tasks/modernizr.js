/*eslint-env node */

var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();
var config = require("./config");


// Compile Modernizr
gulp.task("modernizr", function () {
    return gulp.src([config.src.js, config.src.sass])
        .pipe(plugins.plumber())
        .pipe(plugins.modernizr())
        .pipe(plugins.plumber.stop())
        .pipe(gulp.dest(config.dist.jsDir));
});
