/*eslint-env node */

import gulp from "gulp";
import del from "del";
import config from "./config";



gulp.task("clean:test", () => del(config.dir.coverage));

gulp.task("clean", () => del(config.dir.dist));
