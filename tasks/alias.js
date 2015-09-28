/* eslint-env node */

import gulp from "gulp";
import runSequence from "run-sequence";


gulp.task("prod", ["test"], callback =>
    runSequence(
        "clean",
        "html-prod",
        "css-prod",
        "js-prod",
        callback
    )
);

gulp.task("dev", ["lint"], callback =>
    runSequence(
        "clean",
        ["html", "modernizr", "css", "js"],
        callback
    )
);

gulp.task("lint", ["html-lint", "js-lint"]);

gulp.task("test", ["lint"], callback =>
    runSequence(
        "clean:test",
        ["js-test"],
        callback
    )
);

gulp.task("default", ["prod"]);
