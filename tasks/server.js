/*eslint-env node */

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

    gulp.watch(path.join(config.dir.scss, config.glob.scss), ["css"]);

    gulp.watch(path.join(config.dir.es6, config.glob.es6), ["js-lint", "js-test", "js"]);

    gulp.watch([
        path.join(config.dir.jade, config.glob.jade),
        path.join(config.dir.data, config.glob.json)
    ], ["html", browserSync.reload]);
});
