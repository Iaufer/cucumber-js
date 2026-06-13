"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = __importDefault(require("node:path"));
const get_definition_line_and_uri_1 = require("./get_definition_line_and_uri");
describe(get_definition_line_and_uri_1.getDefinitionLineAndUri.name, () => {
    const isExcluded = (fileName) => fileName.includes('get_definition_line_and_uri_spec');
    it('correctly gets the relative filename and line of the caller when cjs', async () => {
        const { wrap } = (await import(
        // @ts-expect-error sample fixture
        './get_definition_line_and_uri_sample.cjs'));
        const { uri, line } = wrap(() => (0, get_definition_line_and_uri_1.getDefinitionLineAndUri)('.', isExcluded));
        node_assert_1.default.strictEqual(node_path_1.default.normalize(uri), node_path_1.default.normalize('src/support_code_library_builder/get_definition_line_and_uri_sample.cjs'));
        node_assert_1.default.strictEqual(line, 3);
    });
    it('correctly gets the relative filename and line of the caller when esm', async () => {
        const { wrap } = (await import(
        // @ts-expect-error sample fixture
        './get_definition_line_and_uri_sample.mjs'));
        const { uri, line } = wrap(() => (0, get_definition_line_and_uri_1.getDefinitionLineAndUri)('.', isExcluded));
        node_assert_1.default.strictEqual(node_path_1.default.normalize(uri), node_path_1.default.normalize('src/support_code_library_builder/get_definition_line_and_uri_sample.mjs'));
        node_assert_1.default.strictEqual(line, 3);
    });
});
//# sourceMappingURL=get_definition_line_and_uri_spec.js.map