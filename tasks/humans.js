/*eslint-env node */

import gulp from "gulp";
import gulpLoadPlugins from "gulp-load-plugins";
import config from "./config";

var plugins = gulpLoadPlugins();


gulp.task("humans", () => gulp
    .src(config.dir.html)
    .pipe(plugins.humans(config.humans))
);
