"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../../src");
(0, src_1.When)('a step throws an exception', function () {
    throw new Error('BOOM');
});
//# sourceMappingURL=stack-traces.js.map