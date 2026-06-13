"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const messages = __importStar(require("@cucumber/messages"));
const semver_1 = __importDefault(require("semver"));
const __1 = require("../../");
const data_table_1 = __importDefault(require("../../src/models/data_table"));
const message_helpers_1 = require("../support/message_helpers");
const ENCODING_MAP = {
    IDENTITY: messages.AttachmentContentEncoding.IDENTITY,
    BASE64: messages.AttachmentContentEncoding.BASE64,
};
(0, __1.Then)('it runs {int} scenarios', function (expectedCount) {
    const testCaseStartedEvents = this.lastRun.envelopes.filter((e) => e.testCaseStarted);
    (0, chai_1.expect)(testCaseStartedEvents).to.have.lengthOf(expectedCount);
});
(0, __1.Then)('it runs the scenario {string}', function (name) {
    const actualNames = (0, message_helpers_1.getPickleNamesInOrderOfExecution)(this.lastRun.envelopes);
    (0, chai_1.expect)(actualNames).to.eql([name]);
});
(0, __1.Then)('it runs the scenarios {string} and {string}', function (name1, name2) {
    const actualNames = (0, message_helpers_1.getPickleNamesInOrderOfExecution)(this.lastRun.envelopes);
    (0, chai_1.expect)(actualNames).to.eql([name1, name2]);
});
(0, __1.Then)('it runs the scenarios:', function (table) {
    const expectedNames = table.rows().map((row) => row[0]);
    const actualNames = (0, message_helpers_1.getPickleNamesInOrderOfExecution)(this.lastRun.envelopes);
    (0, chai_1.expect)(expectedNames).to.eql(actualNames);
});
(0, __1.Then)('scenario {string} has status {string}', function (name, status) {
    const result = (0, message_helpers_1.getTestCaseResult)(this.lastRun.envelopes, name);
    (0, chai_1.expect)(result.status).to.eql(status.toUpperCase());
});
(0, __1.Then)('the scenario {string} has the steps:', function (name, table) {
    const actualTexts = (0, message_helpers_1.getTestStepResults)(this.lastRun.envelopes, name).map((s) => s.text);
    const expectedTexts = table.rows().map((row) => row[0]);
    (0, chai_1.expect)(actualTexts).to.eql(expectedTexts);
});
(0, __1.Then)('scenario {string} step {string} has status {string}', function (pickleName, stepText, status) {
    const testStepResults = (0, message_helpers_1.getTestStepResults)(this.lastRun.envelopes, pickleName);
    const testStepResult = testStepResults.find((x) => x.text === stepText);
    (0, chai_1.expect)(testStepResult.result.status).to.eql(status.toUpperCase());
});
(0, __1.Then)('scenario {string} attempt {int} step {string} has status {string}', function (pickleName, attempt, stepText, status) {
    const testStepResults = (0, message_helpers_1.getTestStepResults)(this.lastRun.envelopes, pickleName, attempt);
    const testStepResult = testStepResults.find((x) => x.text === stepText);
    (0, chai_1.expect)(testStepResult.result.status).to.eql(status.toUpperCase());
});
(0, __1.Then)('scenario {string} {string} hook has status {string}', function (pickleName, hookKeyword, status) {
    const testStepResults = (0, message_helpers_1.getTestStepResults)(this.lastRun.envelopes, pickleName);
    const testStepResult = testStepResults.find((x) => x.text === hookKeyword);
    (0, chai_1.expect)(testStepResult.result.status).to.eql(status.toUpperCase());
});
(0, __1.Then)('scenario {string} step {string} failed with:', function (pickleName, stepText, errorMessage) {
    const testStepResults = (0, message_helpers_1.getTestStepResults)(this.lastRun.envelopes, pickleName);
    const testStepResult = testStepResults.find((x) => x.text === stepText);
    if (semver_1.default.satisfies(process.version, '>=14.0.0')) {
        errorMessage = errorMessage.replace('{ member: [Circular] }', '<ref *1> { member: [Circular *1] }');
    }
    (0, chai_1.expect)(testStepResult.result.status).to.eql(messages.TestStepResultStatus.FAILED);
    (0, chai_1.expect)(testStepResult.result.message).to.include(errorMessage);
});
(0, __1.Then)('scenario {string} attempt {int} step {string} failed with:', function (pickleName, attempt, stepText, errorMessage) {
    const testStepResults = (0, message_helpers_1.getTestStepResults)(this.lastRun.envelopes, pickleName, attempt);
    const testStepResult = testStepResults.find((x) => x.text === stepText);
    (0, chai_1.expect)(testStepResult.result.status).to.eql(messages.TestStepResultStatus.FAILED);
    (0, chai_1.expect)(testStepResult.result.message).to.include(errorMessage);
});
(0, __1.Then)('scenario {string} step {string} has the doc string:', function (pickleName, stepText, docString) {
    const pickleStep = (0, message_helpers_1.getPickleStep)(this.lastRun.envelopes, pickleName, stepText);
    (0, chai_1.expect)(pickleStep.argument.docString.content).to.eql(docString);
});
(0, __1.Then)('scenario {string} step {string} has the data table:', function (pickleName, stepText, dataTable) {
    const pickleStep = (0, message_helpers_1.getPickleStep)(this.lastRun.envelopes, pickleName, stepText);
    (0, chai_1.expect)(new data_table_1.default(pickleStep.argument.dataTable)).to.eql(dataTable);
});
(0, __1.Then)('scenario {string} step {string} has the attachments:', function (pickleName, stepText, table) {
    const expectedAttachments = table.hashes().map((x) => {
        return {
            body: x.DATA,
            mediaType: x['MEDIA TYPE'],
            contentEncoding: ENCODING_MAP[x['MEDIA ENCODING']],
        };
    });
    const stepAttachments = (0, message_helpers_1.getTestStepAttachmentsForStep)(this.lastRun.envelopes, pickleName, stepText);
    const actualAttachments = stepAttachments.map((e) => {
        return {
            body: e.body,
            mediaType: e.mediaType,
            contentEncoding: e.contentEncoding,
        };
    });
    (0, chai_1.expect)(actualAttachments).to.eql(expectedAttachments);
});
(0, __1.Then)('scenario {string} {string} hook has the attachments:', function (pickleName, hookKeyword, table) {
    const expectedAttachments = table
        .hashes()
        .map((x) => {
        return {
            body: x.DATA,
            mediaType: x['MEDIA TYPE'],
            contentEncoding: ENCODING_MAP[x['MEDIA ENCODING']],
        };
    });
    const hookAttachments = (0, message_helpers_1.getTestStepAttachmentsForHook)(this.lastRun.envelopes, pickleName, hookKeyword === 'Before');
    const actualAttachments = hookAttachments.map((e) => {
        return {
            body: e.body,
            mediaType: e.mediaType,
            contentEncoding: e.contentEncoding,
        };
    });
    (0, chai_1.expect)(actualAttachments).to.eql(expectedAttachments);
});
//# sourceMappingURL=message_steps.js.map