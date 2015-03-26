var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();
var stylish = require("jshint-stylish");


gulp.task("lint", function () {
    return gulp.src(["gulpfile.js", "./tasks/*.js"])
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter(stylish))
        .pipe(plugins.jscs());
});
