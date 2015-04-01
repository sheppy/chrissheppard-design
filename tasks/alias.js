/*eslint-env node */

var gulp = require("gulp");
var runSequence = require("run-sequence");


gulp.task("prod", ["lint"], function (callback) {
    runSequence(
        "clean",
        "html-prod",
        "css-prod",
        "js-prod",
        callback
    );
});


gulp.task("dev", ["lint"], function (callback) {
    runSequence(
        "clean",
        ["html", "modernizr", "css", "js"],
        callback
    );
});


gulp.task("lint", ["html-lint", "js-lint"]);
gulp.task("default", ["prod"]);
