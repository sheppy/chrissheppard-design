/* global describe, it */

import chai from "chai";

chai.should();

// var Accordion = proxyquire("../src/assets/js/accordion/accordion.js", { "./temp.js": temp });

// import Accordion from "../src/assets/js/accordion/accordion.js";

describe("Array", () => {
    describe("#indexOf()", () => {
        it("should return -1 when the value is not present", () => {
            [1, 2, 3].indexOf(5).should.equal(-1);
            [1, 2, 3].indexOf(0).should.equal(-1);
        });
    });
});
