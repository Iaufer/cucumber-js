"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../../src");
(0, src_1.Before)('@passing-hook', async function () {
    // no-op
});
(0, src_1.Before)('@fail-before', function () {
    throw new Error('Exception in conditional hook');
});
(0, src_1.When)('a step passes', function () {
    // no-op
});
(0, src_1.After)('@fail-after', function () {
    throw new Error('Exception in conditional hook');
});
(0, src_1.After)('@passing-hook', async function () {
    // no-op
});
//# sourceMappingURL=hooks-conditional.js.map