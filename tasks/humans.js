var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();


gulp.task("humans", function () {
    gulp.src("./public/**/*.html")
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
            out: "./public/humans.txt"
        }));
});
