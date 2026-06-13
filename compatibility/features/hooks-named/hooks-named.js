"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../../src");
(0, src_1.Before)({ name: 'A named before hook' }, function () {
    // no-op
});
(0, src_1.When)('a step passes', function () {
    // no-op
});
(0, src_1.After)({ name: 'A named after hook' }, function () {
    // no-op
});
//# sourceMappingURL=hooks-named.js.map