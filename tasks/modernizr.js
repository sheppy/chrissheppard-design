/*eslint-env node */

import path from "path";
import gulp from "gulp";
import gulpLoadPlugins from "gulp-load-plugins";
import config from "./config";

var plugins = gulpLoadPlugins();


// Compile Modernizr
gulp.task("modernizr", () => gulp
    .src([
        path.join(config.dir.es6, config.glob.es6),
        path.join(config.dir.scss, config.glob.scss)
    ])
    .pipe(plugins.plumber())
    .pipe(plugins.modernizr())
    .pipe(plugins.plumber.stop())
    .pipe(gulp.dest(config.dir.js))
);
