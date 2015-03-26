var gulp = require("gulp");
var runSequence = require("run-sequence");


gulp.task("prod", ["lint"], function (callback) {
    runSequence(
        "clean",
        "html-prod",
        "css-prod",
        callback
    );
});


gulp.task("dev", ["lint"], function (callback) {
    runSequence(
        "clean",
        "html",
        "css",
        callback
    );
});


gulp.task("lint", ["html-lint", "js-lint"]);
gulp.task("default", ["prod"]);
