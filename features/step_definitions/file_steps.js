"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const chai_1 = require("chai");
const has_ansi_1 = __importDefault(require("has-ansi"));
const fs_1 = __importDefault(require("mz/fs"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const mustache_1 = __importDefault(require("mustache"));
const helpers_1 = require("../support/helpers");
const __1 = require("../../");
(0, __1.Given)('a file named {string} with:', async function (filePath, fileContent) {
    const absoluteFilePath = node_path_1.default.join(this.tmpDir, filePath);
    if (filePath === '@rerun.txt') {
        fileContent = fileContent.replace(/\//g, node_path_1.default.sep);
    }
    await fs_extra_1.default.outputFile(absoluteFilePath, fileContent);
});
(0, __1.Given)('an empty file named {string}', async function (filePath) {
    const absoluteFilePath = node_path_1.default.join(this.tmpDir, filePath);
    await fs_extra_1.default.outputFile(absoluteFilePath, '');
});
(0, __1.Given)('a directory named {string}', async function (filePath) {
    const absoluteFilePath = node_path_1.default.join(this.tmpDir, filePath);
    await fs_extra_1.default.mkdirp(absoluteFilePath);
});
(0, __1.Given)('{string} is an absolute path', function (filePath) {
    filePath = mustache_1.default.render(filePath, this);
    (0, chai_1.expect)(node_path_1.default.isAbsolute(filePath)).to.eql(true);
});
(0, __1.Then)('the file {string} has the text:', async function (filePath, text) {
    filePath = mustache_1.default.render(filePath, this);
    const absoluteFilePath = node_path_1.default.resolve(this.tmpDir, filePath);
    const content = await fs_1.default.readFile(absoluteFilePath, 'utf8');
    const actualContent = (0, helpers_1.normalizeText)(content);
    const expectedContent = (0, helpers_1.normalizeText)(text);
    (0, chai_1.expect)(actualContent).to.eql(expectedContent);
});
(0, __1.Then)('the file {string} contains the text:', async function (filePath, text) {
    filePath = mustache_1.default.render(filePath, this);
    const absoluteFilePath = node_path_1.default.resolve(this.tmpDir, filePath);
    const content = await fs_1.default.readFile(absoluteFilePath, 'utf8');
    const actualContent = (0, helpers_1.normalizeText)(content);
    const expectedContent = (0, helpers_1.normalizeText)(text);
    (0, chai_1.expect)(actualContent).to.include(expectedContent);
});
(0, __1.Then)('the file {string} does not contain the text:', async function (filePath, text) {
    filePath = mustache_1.default.render(filePath, this);
    const absoluteFilePath = node_path_1.default.resolve(this.tmpDir, filePath);
    const content = await fs_1.default.readFile(absoluteFilePath, 'utf8');
    const actualContent = (0, helpers_1.normalizeText)(content);
    const expectedContent = (0, helpers_1.normalizeText)(text);
    (0, chai_1.expect)(actualContent).not.to.include(expectedContent);
});
(0, __1.Then)('the file {string} contains colors', async function (filePath) {
    filePath = mustache_1.default.render(filePath, this);
    const absoluteFilePath = node_path_1.default.resolve(this.tmpDir, filePath);
    const content = await fs_1.default.readFile(absoluteFilePath, 'utf8');
    (0, chai_1.expect)((0, has_ansi_1.default)(content)).to.be.true;
});
(0, __1.Then)("the file {string} doesn't contain colors", async function (filePath) {
    filePath = mustache_1.default.render(filePath, this);
    const absoluteFilePath = node_path_1.default.resolve(this.tmpDir, filePath);
    const content = await fs_1.default.readFile(absoluteFilePath, 'utf8');
    (0, chai_1.expect)((0, has_ansi_1.default)(content)).to.be.false;
});
//# sourceMappingURL=file_steps.js.map