"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../../src");
(0, src_1.Before)(function () {
    // no-op
});
(0, src_1.When)('a step passes', function () {
    // no-op
});
(0, src_1.When)('a step fails', function () {
    throw new Error('Exception in step');
});
(0, src_1.After)(function () {
    // no-op
});
//# sourceMappingURL=hooks.js.map