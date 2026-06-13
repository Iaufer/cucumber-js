"use strict";
// Tests depend on the lines the steps are defined on
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsageSupportCodeLibrary = getUsageSupportCodeLibrary;
const runtime_helpers_1 = require("../runtime_helpers");
function getUsageSupportCodeLibrary(clock) {
    return (0, runtime_helpers_1.buildSupportCodeLibrary)(__dirname, ({ Given }) => {
        Given('abc', function () {
            clock.tick(1);
        });
        let count = 0;
        Given(/def?/, function () {
            if (count === 0) {
                clock.tick(2);
                count += 1;
            }
            else {
                clock.tick(1);
            }
        });
        Given('ghi', function () { });
    });
}
//# sourceMappingURL=usage_steps.js.map