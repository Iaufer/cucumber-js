"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_url_1 = require("node:url");
const node_path_1 = __importDefault(require("node:path"));
const chai_1 = require("chai");
const builder_1 = __importDefault(require("./builder"));
describe('custom class loading', () => {
    const varieties = [
        'legacy_esm.mjs',
        'legacy_exports_dot_default.cjs',
        'legacy_module_dot_exports.cjs',
    ];
    varieties.forEach((filename) => {
        describe(filename, () => {
            it('should handle a relative path', async () => {
                const CustomClass = await builder_1.default.loadCustomClass('formatter', `./fixtures/${filename}`, __dirname);
                (0, chai_1.expect)(typeof CustomClass).to.eq('function');
            });
            it('should handle a file:// url', async () => {
                const fileUrl = (0, node_url_1.pathToFileURL)(node_path_1.default.resolve(__dirname, `./fixtures/${filename}`)).toString();
                const CustomClass = await builder_1.default.loadCustomClass('formatter', fileUrl, __dirname);
                (0, chai_1.expect)(typeof CustomClass).to.eq('function');
            });
        });
    });
});
//# sourceMappingURL=builder_spec.js.map