/*eslint-env node */

var gulp = require("gulp");
var del = require("del");
var config = require("./config");


gulp.task("clean:test", function (cb) {
    del([
        config.dir.coverage
    ], cb);
});

gulp.task("clean", function (cb) {
    del([
        config.dir.dist
    ], cb);
});
