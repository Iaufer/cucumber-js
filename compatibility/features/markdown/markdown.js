"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const src_1 = require("../../../src");
(0, src_1.Given)('some TypeScript code:', function (dataTable) {
    (0, node_assert_1.default)(dataTable);
});
(0, src_1.Given)('some classic Gherkin:', function (gherkin) {
    (0, node_assert_1.default)(gherkin);
});
(0, src_1.When)('we use a data table and attach something and then {word}', async function (word, dataTable) {
    (0, node_assert_1.default)(dataTable);
    await this.log(`We are logging some plain text (${word})`);
    if (word === 'fail') {
        throw new Error('You asked me to fail');
    }
});
(0, src_1.Then)('this might or might not run', function () {
    // no-op
});
//# sourceMappingURL=markdown.js.map