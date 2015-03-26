var gulp = require("gulp");
var browserSync = require("browser-sync");
var config = require("./config");


gulp.task("server", ["dev"], function () {
    browserSync({
        ui: false,
        server: {
            baseDir: config.dist.dir
        },
        notify: false
    });

    gulp.watch(config.src.sass, ["css"]);
    gulp.watch([config.src.jade, config.src.data], ["html", browserSync.reload]);
});
