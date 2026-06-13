"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../../src");
(0, src_1.Given)('a step that does not skip', function () {
    // no-op
});
(0, src_1.Given)('a step that is skipped', function () {
    // no-op
});
(0, src_1.Given)('I skip a step', function () {
    return 'skipped';
});
//# sourceMappingURL=skipped.js.map