/*eslint-env node */

"use strict";

var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();
var stylish = require("jshint-stylish");


gulp.task("js-lint", function () {
    return gulp.src(["gulpfile.js", "./tasks/*.js"])
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter(stylish))
        .pipe(plugins.eslint({ configFile: "./.eslintrc", reset: true }))
        .pipe(plugins.eslint.format())
        .pipe(plugins.eslint.failOnError())
        .pipe(plugins.jscs());
});
