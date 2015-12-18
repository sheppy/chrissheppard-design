/* eslint-env node */

import gulp from "gulp";
import runSequence from "run-sequence";


gulp.task("dist", ["test"], callback =>
    runSequence(
        "clean:dist",
        "html:dist",
        "css:dist",
        "js:dist",
        // "humans",
        callback
    )
);

gulp.task("dev", ["test"], callback =>
    runSequence(
        "clean:dev",
        ["html:dev", "modernizr:dev", "css:dev", "js:dev"],
        callback
    )
);

gulp.task("test", ["lint"], callback =>
    runSequence(
        "clean:test",
        ["js-test"],
        callback
    )
);

gulp.task("lint", ["html:lint", "js:lint"]);

gulp.task("default", ["dev"]);
