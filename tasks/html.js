var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();
var fs = require("fs");
var path = require("path");
var _ = require("lodash");


var compileHTML = function () {
    return gulp.src("./src/templates/pages/**/*.jade")
        .pipe(plugins.plumber())
        .pipe(plugins.data(function (file) {
            // Extend with global data
            var global, page;
            try {
                global = JSON.parse(fs.readFileSync("./src/data/global.json"));
                page = JSON.parse(
                    fs.readFileSync("./src/data/" + path.basename(file.path, ".jade") + ".json")
                );
            } catch (e) {
                plugins.util.log(plugins.util.colors.red(e.message));
            }
            return _.extend({}, global, page);
        }))
        .pipe(plugins.jade({
            pretty: true
        }))
        .pipe(plugins.plumber.stop());
};


// Validate HTML
gulp.task("html-lint", function () {
    return compileHTML()
        .pipe(plugins.plumber())
        .pipe(plugins.html5Lint())
        .pipe(plugins.plumber.stop());
});


// Save HTML
gulp.task("html", function () {
    return compileHTML()
        .pipe(gulp.dest("./public"));
});


// Save production HTML
gulp.task("html-prod", function () {
    return compileHTML()
        .pipe(plugins.plumber())
        .pipe(plugins.htmlmin({
            collapseWhitespace: true,
            preserveLineBreaks: true,
            removeComments: false,
            collapseBooleanAttributes: true,
            removeAttributeQuotes: false,
            removeRedundantAttributes: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true
        }))
        .pipe(plugins.plumber.stop())
        .pipe(gulp.dest("./public/"));
});
