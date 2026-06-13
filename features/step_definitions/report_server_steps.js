"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_url_1 = require("node:url");
const node_assert_1 = __importDefault(require("node:assert"));
const node_zlib_1 = require("node:zlib");
const chai_1 = require("chai");
const __1 = require("../..");
const fake_report_server_1 = __importDefault(require("../../test/fake_report_server"));
(0, __1.Given)('a report server is running on {string}', async function (url) {
    const port = parseInt(new node_url_1.URL(url).port);
    this.reportServer = new fake_report_server_1.default(port);
    await this.reportServer.start();
});
(0, __1.Given)('report publishing is not working', async function () {
    this.reportServer.failOnTouch = true;
});
(0, __1.Given)('report uploads are not working', async function () {
    this.reportServer.failOnUpload = true;
});
(0, __1.Then)('the server should receive the following message types:', async function (expectedMessageTypesTable) {
    const expectedMessageTypes = expectedMessageTypesTable
        .raw()
        .map((row) => row[0]);
    const receivedBodies = await this.reportServer.stop();
    const ndjson = (0, node_zlib_1.gunzipSync)(receivedBodies).toString('utf-8').trim();
    if (ndjson === '')
        node_assert_1.default.fail('Server received nothing');
    const receivedMessageTypes = ndjson
        .split(/\n/)
        .map((line) => JSON.parse(line))
        .map((envelope) => Object.keys(envelope)[0]);
    (0, chai_1.expect)(receivedMessageTypes).to.deep.eq(expectedMessageTypes);
});
(0, __1.Then)('the server should receive a(n) {string} header with value {string}', function (name, value) {
    (0, chai_1.expect)(this.reportServer.receivedHeaders[name.toLowerCase()]).to.eq(value);
});
//# sourceMappingURL=report_server_steps.js.map