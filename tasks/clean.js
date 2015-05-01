/*eslint-env node */

import gulp from "gulp";
import del from "del";
import config from "./config";


gulp.task("clean:test", cb => del(config.dir.coverage, cb));

gulp.task("clean", cb => del(config.dir.dist, cb));
