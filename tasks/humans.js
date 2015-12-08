/* eslint-env node */

import gulp from "gulp";
import path from "path";
import gulpLoadPlugins from "gulp-load-plugins";
import config from "./config";

const plugins = gulpLoadPlugins();


gulp.task("humans", () => gulp
    .src(path.join(config.dir.src, config.dir.html))
    .pipe(plugins.plumber())
    .pipe(plugins.humans(config.humans))
);
