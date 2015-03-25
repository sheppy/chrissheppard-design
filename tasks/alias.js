var gulp = require("gulp");
var runSequence = require("run-sequence");


gulp.task("build", function (callback) {
    runSequence(
        "clean",
        "prod-html",
        "prod-css",
        callback
    );
});


gulp.task("default", function (callback) {
    runSequence(
        "clean",
        "html",
        "css",
        callback
    );
});
