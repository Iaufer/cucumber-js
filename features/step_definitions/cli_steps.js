"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const string_argv_1 = __importDefault(require("string-argv"));
const mustache_1 = __importDefault(require("mustache"));
const helpers_1 = require("../support/helpers");
const __1 = require("../../");
const value_checker_1 = require("../../src/value_checker");
const version_1 = require("../../src/version");
(0, __1.When)('my env includes {string}', function (envString) {
    this.sharedEnv = this.parseEnvString(envString);
});
(0, __1.When)('I run cucumber-js', { timeout: 10000 }, async function () {
    return await this.run(this.localExecutablePath, []);
});
(0, __1.When)('I run cucumber-js with `{}`', { timeout: 10000 }, async function (args) {
    const renderedArgs = mustache_1.default.render((0, value_checker_1.valueOrDefault)(args, ''), this);
    const stringArgs = (0, string_argv_1.default)(renderedArgs);
    return await this.run(this.localExecutablePath, stringArgs);
});
(0, __1.When)('I run cucumber-js with arguments `{}` and env `{}`', { timeout: 10000 }, async function (args, envString) {
    const renderedArgs = mustache_1.default.render((0, value_checker_1.valueOrDefault)(args, ''), this);
    const stringArgs = (0, string_argv_1.default)(renderedArgs);
    const env = this.parseEnvString(envString);
    return await this.run(this.localExecutablePath, stringArgs, env);
});
(0, __1.When)('I run cucumber-js with env `{}`', { timeout: 10000 }, async function (envString) {
    const env = this.parseEnvString(envString);
    return await this.run(this.localExecutablePath, [], env);
});
(0, __1.When)('I run cucumber-js with all formatters', { timeout: 10000 }, async function () {
    const args = '--format html:html.out --format json:json.out';
    const renderedArgs = mustache_1.default.render(args, this);
    const stringArgs = (0, string_argv_1.default)(renderedArgs);
    return await this.run(this.localExecutablePath, stringArgs);
});
(0, __1.When)('I run cucumber-js with all formatters and `{}`', { timeout: 10000 }, async function (args) {
    if ((0, value_checker_1.doesNotHaveValue)(args)) {
        args = '';
    }
    // message is always outputted as part of run
    const formats = ['html:html.out', 'json:json.out'];
    args += ' ' + formats.map((f) => `--format ${f}`).join(' ');
    const renderedArgs = mustache_1.default.render(args, this);
    const stringArgs = (0, string_argv_1.default)(renderedArgs);
    return await this.run(this.localExecutablePath, stringArgs);
});
(0, __1.Then)('it passes', () => { });
(0, __1.Then)('it fails', function () {
    const actualCode = (0, value_checker_1.doesHaveValue)(this.lastRun.error)
        ? this.lastRun.error.code
        : 0;
    (0, chai_1.expect)(actualCode).not.to.eql(0, `Expected non-zero exit status, but got ${actualCode}`);
    this.verifiedLastRunError = true;
});
(0, __1.Then)('it outputs the text:', function (text) {
    const actualOutput = (0, helpers_1.normalizeText)(this.lastRun.output);
    const expectedOutput = (0, helpers_1.normalizeText)(text);
    (0, chai_1.expect)(actualOutput).to.eql(expectedOutput);
});
(0, __1.Then)('the output contains the text:', function (text) {
    const actualOutput = (0, helpers_1.normalizeText)(this.lastRun.output);
    const expectedOutput = (0, helpers_1.normalizeText)(text);
    (0, chai_1.expect)(actualOutput).to.include(expectedOutput);
});
(0, __1.Then)('the output contains these types and quantities of message:', function (expectedMessages) {
    const envelopes = this.lastRun.output
        .split('\n')
        .filter((line) => !!line)
        .map((line) => JSON.parse(line));
    expectedMessages.rows().forEach(([type, count]) => {
        (0, chai_1.expect)(envelopes.filter((envelope) => !!envelope[type])).to.have.length(Number(count), `Didn't find expected number of ${type} messages`);
    });
});
(0, __1.Then)('the output does not contain the text:', function (text) {
    const actualOutput = (0, helpers_1.normalizeText)(this.lastRun.output);
    const expectedOutput = (0, helpers_1.normalizeText)(text);
    (0, chai_1.expect)(actualOutput).not.to.include(expectedOutput);
});
(0, __1.Then)('the error output contains the text snippets:', function (table) {
    const actualOutput = (0, helpers_1.normalizeText)(this.lastRun.errorOutput);
    table.rows().forEach((row) => {
        const expectedOutput = (0, helpers_1.normalizeText)(row[0]);
        (0, chai_1.expect)(actualOutput).to.include(expectedOutput);
    });
});
(0, __1.Then)('the error output contains the text:', function (text) {
    const actualOutput = (0, helpers_1.normalizeText)(this.lastRun.errorOutput);
    const expectedOutput = (0, helpers_1.normalizeText)(text);
    (0, chai_1.expect)(actualOutput).to.include(expectedOutput);
});
(0, __1.Then)('the error output does not contain the text:', function (text) {
    const actualOutput = (0, helpers_1.normalizeText)(this.lastRun.errorOutput);
    const expectedOutput = (0, helpers_1.normalizeText)(text);
    (0, chai_1.expect)(actualOutput).not.to.include(expectedOutput);
});
(0, __1.Then)('I see the version of Cucumber', function () {
    const actualOutput = this.lastRun.output;
    const expectedOutput = `${version_1.version}\n`;
    (0, chai_1.expect)(actualOutput).to.eql(expectedOutput);
});
(0, __1.Then)('I see the help text for Cucumber', function () {
    const actualOutput = this.lastRun.output;
    const expectedOutput = 'Usage: cucumber-js';
    (0, chai_1.expect)(actualOutput).to.include(expectedOutput);
});
//# sourceMappingURL=cli_steps.js.map