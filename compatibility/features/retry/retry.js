"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../../src");
(0, src_1.Given)('a step that always passes', function () {
    // no-op
});
let secondTimePass = 0;
(0, src_1.Given)('a step that passes the second time', function () {
    secondTimePass++;
    if (secondTimePass < 2) {
        throw new Error('Exception in step');
    }
});
let thirdTimePass = 0;
(0, src_1.Given)('a step that passes the third time', function () {
    thirdTimePass++;
    if (thirdTimePass < 3) {
        throw new Error('Exception in step');
    }
});
(0, src_1.Given)('a step that always fails', function () {
    throw new Error('Exception in step');
});
//# sourceMappingURL=retry.js.map