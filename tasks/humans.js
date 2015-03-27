/*eslint-env node */

"use strict";

var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();
var config = require("./config");


gulp.task("humans", function () {
    gulp.src(config.dist.html)
        .pipe(plugins.humans({
            header: "Chris Sheppard",
            team: {
                "Chris Sheppard": {
                    Twitter: "@ikiholygoat",
                    Website: "http://www.chrissheppard.co.uk/",
                    Country: "United Kingdom"
                }
            },
            site: {
                Standards: "HTML5, CSS3",
                Components: "Normalize.css",
                Software: "WebStorm"
            },
            note: "Built with love by Chris Sheppard.",
            out: config.dist.humans
        }));
});
