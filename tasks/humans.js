/*eslint-env node */

var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();
var config = require("./config");


gulp.task("humans", function () {
    return gulp
        .src(config.dir.html)
        .pipe(plugins.humans(config.humans));
});
