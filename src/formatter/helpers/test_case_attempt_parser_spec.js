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
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const messages = __importStar(require("@cucumber/messages"));
const cucumber_expressions_1 = require("@cucumber/cucumber-expressions");
const reindent_template_literals_1 = require("reindent-template-literals");
const steps_1 = require("../../../test/fixtures/steps");
const step_definition_snippet_builder_1 = __importDefault(require("../step_definition_snippet_builder"));
const formatter_helpers_1 = require("../../../test/formatter_helpers");
const _1 = require(".");
(0, mocha_1.describe)('TestCaseAttemptParser', () => {
    (0, mocha_1.describe)('parseTestCaseAttempt', () => {
        const supportCodeLibrary = (0, steps_1.getBaseSupportCodeLibrary)();
        const snippetSyntax = {
            build: () => 'snippet',
        };
        const snippetBuilder = new step_definition_snippet_builder_1.default({
            snippetSyntax,
            parameterTypeRegistry: new cucumber_expressions_1.ParameterTypeRegistry(),
        });
        const source = {
            data: (0, reindent_template_literals_1.reindent)(`
        Feature: my feature
          Scenario: my scenario
            Given a passing step
      `),
            uri: 'a.feature',
        };
        (0, mocha_1.describe)('with no test step result', () => {
            (0, mocha_1.it)('initialize step result with status UNKNOWN', async () => {
                // Arrange
                const [testCaseAttempt] = await (0, formatter_helpers_1.getTestCaseAttempts)({
                    sources: [source],
                    supportCodeLibrary,
                });
                testCaseAttempt.stepResults = {};
                // Act
                const output = (0, _1.parseTestCaseAttempt)({
                    testCaseAttempt,
                    snippetBuilder,
                    supportCodeLibrary,
                });
                // Assert
                (0, chai_1.expect)(output.testSteps[0].result.status).to.eq(messages.TestStepResultStatus.UNKNOWN);
            });
        });
        (0, mocha_1.describe)('with test step result', () => {
            (0, mocha_1.it)('uses the parsed step result', async () => {
                // Arrange
                const [testCaseAttempt] = await (0, formatter_helpers_1.getTestCaseAttempts)({
                    sources: [source],
                    supportCodeLibrary,
                });
                // Act
                const output = (0, _1.parseTestCaseAttempt)({
                    testCaseAttempt,
                    snippetBuilder,
                    supportCodeLibrary,
                });
                // Assert
                (0, chai_1.expect)(output.testSteps[0].result.status).to.eq(messages.TestStepResultStatus.PASSED);
            });
        });
    });
});
//# sourceMappingURL=test_case_attempt_parser_spec.js.map