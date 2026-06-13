"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const src_1 = require("../../../src");
(0, src_1.Before)(async function () {
    await this.attach(node_fs_1.default.createReadStream(node_path_1.default.join(process.cwd(), 'node_modules', '@cucumber', 'compatibility-kit', 'features', 'hooks-attachment', 'cucumber.svg')), 'image/svg+xml');
});
(0, src_1.When)('a step passes', function () {
    // no-op
});
(0, src_1.After)(async function () {
    await this.attach(node_fs_1.default.createReadStream(node_path_1.default.join(process.cwd(), 'node_modules', '@cucumber', 'compatibility-kit', 'features', 'hooks-attachment', 'cucumber.svg')), 'image/svg+xml');
});
//# sourceMappingURL=hooks-attachment.js.map