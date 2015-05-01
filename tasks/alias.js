/*eslint-env node */

var gulp = require("gulp");
var runSequence = require("run-sequence");


gulp.task("prod", ["test"], function (callback) {
    runSequence(
        "clean",
        "html-prod",
        "css-prod",
        "js-prod",
        callback
    );
});


gulp.task("dev", ["test"], function (callback) {
    runSequence(
        "clean",
        ["html", "modernizr", "css", "js"],
        callback
    );
});


gulp.task("lint", ["html-lint", "js-lint"]);

gulp.task("test", ["lint"], function (callback) {
    runSequence(
        "clean:test",
        ["js-test"],
        callback
    );
});

gulp.task("default", ["prod"]);
