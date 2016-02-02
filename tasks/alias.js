/* eslint-env node */

import gulp from "gulp";
import runSequence from "run-sequence";


gulp.task("dist", callback =>
    runSequence(
        "clean:dist",
        "html:dist",
        "modernizr:dist",
        "css:dist",
        // "humans",
        callback
    )
);

gulp.task("dev", callback =>
    runSequence(
        "clean:dev",
        ["html:dev", "modernizr:dev", "css:dev"],
        callback
    )
);

gulp.task("default", ["dev"]);
