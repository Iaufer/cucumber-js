"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_url_1 = require("node:url");
const node_path_1 = __importDefault(require("node:path"));
const chai_1 = require("chai");
const resolve_implementation_1 = require("./resolve_implementation");
describe('resolveImplementation', () => {
    const varieties = [
        'esm.mjs',
        'exports_dot_default.cjs',
        'module_dot_exports.cjs',
    ];
    describe('legacy classes', () => {
        varieties.forEach((filename) => {
            describe(filename, () => {
                it('should handle a relative path', async () => {
                    const CustomClass = await (0, resolve_implementation_1.resolveImplementation)(`./fixtures/legacy_${filename}`, __dirname);
                    (0, chai_1.expect)(typeof CustomClass).to.eq('function');
                });
                it('should handle a file:// url', async () => {
                    const fileUrl = (0, node_url_1.pathToFileURL)(node_path_1.default.resolve(__dirname, `./fixtures/legacy_${filename}`)).toString();
                    const CustomClass = await (0, resolve_implementation_1.resolveImplementation)(fileUrl, __dirname);
                    (0, chai_1.expect)(typeof CustomClass).to.eq('function');
                });
            });
        });
    });
    describe('plugins', () => {
        varieties.forEach((filename) => {
            describe(filename, () => {
                it('should handle a relative path', async () => {
                    const plugin = await (0, resolve_implementation_1.resolveImplementation)(`./fixtures/plugin_${filename}`, __dirname);
                    (0, chai_1.expect)(typeof plugin).to.eq('object');
                });
                it('should handle a file:// url', async () => {
                    const fileUrl = (0, node_url_1.pathToFileURL)(node_path_1.default.resolve(__dirname, `./fixtures/plugin_${filename}`)).toString();
                    const plugin = await (0, resolve_implementation_1.resolveImplementation)(fileUrl, __dirname);
                    (0, chai_1.expect)(typeof plugin).to.eq('object');
                });
            });
        });
    });
});
//# sourceMappingURL=resolve_implementation_spec.js.map