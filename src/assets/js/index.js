require("babel/polyfill");

import Router from "./core/router";

var router = new Router();

router
    .add("/about", function () {
        console.log("about route");
    })
    .add("/products/:productId/edit/:extra", function () {
        console.log("products route", arguments);
    })
    .add(function () {
        console.log("default route");
    })
    .listen();

//router.navigate("/about");

window.router = router;
