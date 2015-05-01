/*eslint-env node */

var path = require("path");
var gulp = require("gulp");
var browserSync = require("browser-sync");
var config = require("./config");


gulp.task("server", ["dev"], function () {
    browserSync({
        ui: false,
        server: {
            baseDir: config.dir.dist
        },
        notify: false
    });

    gulp.watch(path.join(config.dir.scss, config.glob.scss), ["css"]);
    gulp.watch([
        path.join(config.dir.jade, config.glob.jade),
        path.join(config.dir.data, config.glob.json)
    ], ["html", browserSync.reload]);
});
