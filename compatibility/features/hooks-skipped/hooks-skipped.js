"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../../src");
(0, src_1.Before)({}, function () {
    // no-op
});
(0, src_1.Before)({ tags: '@skip-before' }, function () {
    return 'skipped';
});
(0, src_1.Before)({}, function () {
    // no-op
});
(0, src_1.When)('a normal step', function () {
    // no-op
});
(0, src_1.When)('a step that skips', function () {
    return 'skipped';
});
(0, src_1.After)({}, function () {
    // no-op
});
(0, src_1.After)({ tags: '@skip-after' }, function () {
    return 'skipped';
});
(0, src_1.After)({}, function () {
    // no-op
});
//# sourceMappingURL=hooks-skipped.js.map