"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../../src");
(0, src_1.Given)('an implemented non-pending step', function () {
    // no-op
});
(0, src_1.Given)('an implemented step that is skipped', function () {
    // no-op
});
(0, src_1.Given)('an unimplemented pending step', function () {
    return 'pending';
});
//# sourceMappingURL=pending.js.map