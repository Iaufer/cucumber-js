"use strict";
// Tests depend on the lines the steps are defined on
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseSupportCodeLibrary = getBaseSupportCodeLibrary;
const runtime_helpers_1 = require("../runtime_helpers");
function getBaseSupportCodeLibrary() {
    return (0, runtime_helpers_1.buildSupportCodeLibrary)(__dirname, ({ Given }) => {
        Given('a failing step', function () {
            throw 'error';
        });
        Given('an ambiguous step', function () { });
        Given(/an? ambiguous step/, function () { });
        Given('a pending step', function () {
            return 'pending';
        });
        let willPass = false;
        Given('a flaky step', function () {
            if (willPass) {
                return;
            }
            willPass = true;
            throw 'error';
        });
        Given('a passing step', function () { });
        Given('a skipped step', function () {
            return 'skipped';
        });
        Given('attachment step1', async function () {
            await this.attach('Some info');
            await this.attach('{"name": "some JSON"}', 'application/json');
            await this.attach(Buffer.from([137, 80, 78, 71]), {
                mediaType: 'image/png',
                fileName: 'screenshot.png',
            });
        });
        Given('attachment step2', async function () {
            await this.attach('Other info');
            throw 'error';
        });
    });
}
//# sourceMappingURL=steps.js.map