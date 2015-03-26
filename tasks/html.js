var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();
var fs = require("fs");
var path = require("path");
var _ = require("lodash");


// Compile jade files to HTML
gulp.task("html", function () {
    return gulp.src("./src/templates/pages/**/*.jade")
        .pipe(plugins.plumber())
        .pipe(plugins.data(function(file) {
            // Extend with global data
            var global, page;
            try {
                global = JSON.parse(fs.readFileSync("./src/data/global.json"));
                page = JSON.parse(fs.readFileSync("./src/data/" + path.basename(file.path, ".jade") + ".json"));
            } catch(e) {
                plugins.util.log(plugins.util.colors.red(e.message));
            }
            return _.extend({}, global, page);
        }))
        .pipe(plugins.jade({
            pretty: true
        }))
        .pipe(plugins.plumber.stop())
        .pipe(gulp.dest("./public"));
});
