require("babel/polyfill");

import Router from "./core/router";

const router = new Router();

router
    .add("/about", () => {
        // console.log("about route");
    })
    .add("/products/:productId/edit/:extra", () => {
        // console.log("products route", arguments);
    })
    .add(() => {
        // console.log("default route");
    })
    .listen();

// router.navigate("/about");

// For testing
window.router = router;
