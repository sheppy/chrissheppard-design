/*eslint-env node */

"use strict";

var gulp = require("gulp");
var del = require("del");
var config = require("./config");


gulp.task("clean", function (cb) {
    del([
        config.dist.dir
    ], cb);
});
