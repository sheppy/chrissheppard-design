/* eslint-env node */

import gulp from "gulp";
import path from "path";
import config from "./config";


gulp.task("assets:dev", () => {
    return gulp
        .src(path.join(config.dir.src, "public", "**/*"))
        .pipe(gulp.dest(path.join(config.dir.dev)));
});

gulp.task("assets:dist", () => {
    return gulp
        .src(path.join(config.dir.src, "public", "**/*"))
        .pipe(gulp.dest(path.join(config.dir.dist, "public")));
});
