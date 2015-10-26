/* eslint-env node */

import path from "path";
import gulp from "gulp";
import browserSync from "browser-sync";
import config from "./config";


gulp.task("server", ["dev"], () => {
    browserSync({
        ui: false,
        open: false,
        server: {
            baseDir: config.dir.dist
        },
        notify: false
    });

    gulp.watch(path.join(config.dir.src, config.glob.scss), ["css"]);

    gulp.watch(path.join(config.dir.src, config.glob.es6), ["js-lint", "js-test", "js"]);

    gulp.watch([
        path.join(config.dir.src, config.glob.nunj),
        path.join(config.dir.src, config.dir.data, config.glob.json)
    ], ["html", browserSync.reload]);
});
