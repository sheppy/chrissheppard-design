/* eslint-env node */

import gulp from "gulp";
import del from "del";
import config from "./config";


gulp.task("clean:dev", () => del(config.dir.dev));
gulp.task("clean:dist", () => del(config.dir.dist));
