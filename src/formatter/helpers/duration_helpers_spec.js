"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const duration_helpers_1 = require("./duration_helpers");
describe('duration helpers', () => {
    describe('durationToNanoseconds', () => {
        it('should convert under a second', () => {
            (0, chai_1.expect)((0, duration_helpers_1.durationToNanoseconds)({ seconds: 0, nanos: 257344166 })).to.eq(257344166);
        });
        it('should convert over a second', () => {
            (0, chai_1.expect)((0, duration_helpers_1.durationToNanoseconds)({ seconds: 2, nanos: 1043459 })).to.eq(2001043459);
        });
    });
});
//# sourceMappingURL=duration_helpers_spec.js.map