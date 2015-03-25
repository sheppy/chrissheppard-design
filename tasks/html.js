var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();


// Compile jade files to HTML
gulp.task("html", function () {
    return gulp.src("./src/templates/pages/**/*.jade")
        .pipe(plugins.plumber())
        .pipe(plugins.jade({
            pretty: true
        }))
        .pipe(plugins.plumber.stop())
        .pipe(gulp.dest("./public"));
});
