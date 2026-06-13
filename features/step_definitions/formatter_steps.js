"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const chai_1 = require("chai");
const chai_exclude_1 = __importDefault(require("chai-exclude"));
const fs_1 = __importDefault(require("mz/fs"));
const __1 = require("../../");
const formatter_output_helpers_1 = require("../support/formatter_output_helpers");
(0, chai_1.use)(chai_exclude_1.default);
(0, __1.Then)('the message formatter output matches the fixture {string}', async function (filePath) {
    let actual = this.lastRun.envelopes; // .map((e: Envelope) => JSON.stringify(e))
    actual = (0, formatter_output_helpers_1.normalizeMessageOutput)(actual, this.tmpDir);
    actual = (0, formatter_output_helpers_1.stripMetaMessages)(actual);
    const fixturePath = node_path_1.default.join(__dirname, '..', 'fixtures', filePath);
    const expected = require(fixturePath); // eslint-disable-line @typescript-eslint/no-require-imports
    try {
        (0, chai_1.expect)(actual).excludingEvery(formatter_output_helpers_1.ignorableKeys).to.deep.eq(expected);
    }
    catch (e) {
        if (process.env.GOLDEN) {
            await fs_1.default.writeFile(fixturePath + '.ts', 'module.exports = ' + JSON.stringify(actual, null, 2), 'utf-8');
        }
        else {
            throw e;
        }
    }
});
(0, __1.Then)('the json formatter output matches the fixture {string}', async function (filePath) {
    const actualPath = node_path_1.default.join(this.tmpDir, `json.out`);
    const actualJson = await fs_1.default.readFile(actualPath, 'utf8');
    const actual = (0, formatter_output_helpers_1.normalizeJsonOutput)(actualJson, this.tmpDir);
    const fixturePath = node_path_1.default.join(__dirname, '..', 'fixtures', filePath);
    const expected = require(fixturePath); // eslint-disable-line @typescript-eslint/no-require-imports
    try {
        (0, chai_1.expect)(actual).to.eql(expected);
    }
    catch (e) {
        if (process.env.GOLDEN) {
            await fs_1.default.writeFile(fixturePath + '.ts', 'module.exports = ' + JSON.stringify(actual, null, 2), 'utf-8');
        }
        else {
            e.message = `${e.message}\n\nTry running again with GOLDEN=1 if you believe the fixtures need to be overwritten with actual results`;
            throw e;
        }
    }
});
(0, __1.Then)('the html formatter output is complete', async function () {
    const actualPath = node_path_1.default.join(this.tmpDir, `html.out`);
    const actual = await fs_1.default.readFile(actualPath, 'utf8');
    (0, chai_1.expect)(actual).to.contain('<html lang="en">');
    (0, chai_1.expect)(actual).to.contain('</html>');
});
(0, __1.Then)('the formatter has no externalised attachments', async function () {
    const actual = fs_1.default
        .readdirSync(this.tmpDir)
        .filter((filename) => filename.startsWith('attachment-')).length;
    (0, chai_1.expect)(actual).to.eq(0);
});
(0, __1.Then)('the formatter has these external attachments:', async function (table) {
    const actual = fs_1.default
        .readdirSync(this.tmpDir)
        .filter((filename) => filename.startsWith('attachment-'))
        .map((filename) => fs_1.default.readFileSync(node_path_1.default.join(this.tmpDir, filename), { encoding: 'utf-8' }));
    actual.sort();
    (0, chai_1.expect)(actual).to.deep.eq(table.raw().map((row) => row[0]));
});
//# sourceMappingURL=formatter_steps.js.map