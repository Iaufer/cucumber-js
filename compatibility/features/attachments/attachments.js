"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const src_1 = require("../../../src");
(0, src_1.When)('the string {string} is attached as {string}', function (text, mediaType) {
    this.attach(text, mediaType);
});
(0, src_1.When)('the string {string} is logged', function (text) {
    this.log(text);
});
(0, src_1.When)('text with ANSI escapes is logged', function () {
    this.log('This displays a \x1b[31mr\x1b[0m\x1b[91ma\x1b[0m\x1b[33mi\x1b[0m\x1b[32mn\x1b[0m\x1b[34mb\x1b[0m\x1b[95mo\x1b[0m\x1b[35mw\x1b[0m');
});
(0, src_1.When)('the following string is attached as {string}:', function (mediaType, text) {
    this.attach(text, mediaType);
});
(0, src_1.When)('an array with {int} bytes is attached as {string}', function (size, mediaType) {
    const data = [...Array(size).keys()];
    const buffer = Buffer.from(data);
    this.attach(buffer, mediaType);
});
(0, src_1.When)('a PDF document is attached and renamed', async function () {
    await this.attach(node_fs_1.default.createReadStream(node_path_1.default.join(process.cwd(), 'node_modules', '@cucumber', 'compatibility-kit', 'features', 'attachments', 'document.pdf')), {
        mediaType: 'application/pdf',
        fileName: 'renamed.pdf',
    });
});
(0, src_1.When)('a link to {string} is attached', async function (uri) {
    this.link(uri);
});
(0, src_1.When)('the string {string} is attached as {string} before a failure', async function (text, mediaType) {
    this.attach(text, mediaType);
    throw new Error('whoops');
});
//# sourceMappingURL=attachments.js.map