"use strict";
// Tests depend on the lines the steps are defined on
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJsonFormatterSupportCodeLibrary = getJsonFormatterSupportCodeLibrary;
exports.getJsonFormatterSupportCodeLibraryWithHooks = getJsonFormatterSupportCodeLibraryWithHooks;
const runtime_helpers_1 = require("../runtime_helpers");
function getJsonFormatterSupportCodeLibrary(clock) {
    return (0, runtime_helpers_1.buildSupportCodeLibrary)(__dirname, ({ Given }) => {
        Given('a passing step', function () {
            clock.tick(1);
        });
        let willPass = false;
        Given('a flaky step', function () {
            if (willPass) {
                return;
            }
            willPass = true;
            throw 'error';
        });
        Given('a failing step', function () {
            throw 'error';
        });
        Given('a step that attaches buffer \\(image\\/png)', async function () {
            await this.attach(Buffer.from([137, 80, 78, 71]), 'image/png');
        });
        Given('a step that attaches base64-encoded string', async function () {
            await this.attach(Buffer.from('foo').toString('base64'), 'base64:text/plain');
        });
        Given('a step that attaches string literal', async function () {
            await this.attach('foo', 'text/plain');
        });
        Given('a step {int}', function (_int) { });
    });
}
function getJsonFormatterSupportCodeLibraryWithHooks() {
    return (0, runtime_helpers_1.buildSupportCodeLibrary)(__dirname, ({ After, Before, Given }) => {
        Given('a passing step', function () { });
        Before(function () { });
        After(function () { });
    });
}
//# sourceMappingURL=json_formatter_steps.js.map