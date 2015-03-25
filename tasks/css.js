var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();


// Compile CSS
gulp.task("css", function () {
    return gulp.src("./src/assets/scss/*.scss")
        .pipe(plugins.plumber())
        .pipe(plugins.sass())
        .pipe(plugins.autoprefixer({
            browsers: ["last 2 versions"],
            cascade: false
        }))
        .pipe(plugins.csscomb())
        .pipe(plugins.combineMq({beautify: false}))
        .pipe(plugins.csso())
        .pipe(plugins.cssbeautify({autosemicolon: true}))
        .pipe(plugins.plumber.stop())
        .pipe(gulp.dest("./public/assets/css"));
});
