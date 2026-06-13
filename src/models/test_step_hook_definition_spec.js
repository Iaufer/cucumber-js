"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const gherkin_helpers_1 = require("../../test/gherkin_helpers");
const test_step_hook_definition_1 = __importDefault(require("./test_step_hook_definition"));
(0, mocha_1.describe)('TestStepHookDefinition', () => {
    (0, mocha_1.describe)('appliesToTestCase', () => {
        (0, mocha_1.describe)('no tags', () => {
            (0, mocha_1.it)('returns true', async () => {
                // Arrange
                const pickle = await (0, gherkin_helpers_1.getPickleWithTags)([]);
                const testStepHookDefinition = new test_step_hook_definition_1.default({
                    code: undefined,
                    id: '',
                    line: 0,
                    order: 0,
                    uri: '',
                    options: {},
                });
                // Act
                const result = testStepHookDefinition.appliesToTestCase(pickle);
                // Assert
                (0, chai_1.expect)(result).to.eql(true);
            });
        });
        (0, mocha_1.describe)('tags match', () => {
            (0, mocha_1.it)('returns true', async () => {
                // Arrange
                const pickle = await (0, gherkin_helpers_1.getPickleWithTags)(['@tagA']);
                const testStepHookDefinition = new test_step_hook_definition_1.default({
                    code: undefined,
                    id: '',
                    line: 0,
                    order: 0,
                    uri: '',
                    options: { tags: '@tagA' },
                });
                // Act
                const result = testStepHookDefinition.appliesToTestCase(pickle);
                // Assert
                (0, chai_1.expect)(result).to.eql(true);
            });
        });
        (0, mocha_1.describe)('tags do not match', () => {
            (0, mocha_1.it)('returns false', async () => {
                // Arrange
                const pickle = await (0, gherkin_helpers_1.getPickleWithTags)([]);
                const testStepHookDefinition = new test_step_hook_definition_1.default({
                    code: undefined,
                    id: '',
                    line: 0,
                    order: 0,
                    uri: '',
                    options: { tags: '@tagA' },
                });
                // Act
                const result = testStepHookDefinition.appliesToTestCase(pickle);
                // Assert
                (0, chai_1.expect)(result).to.eql(false);
            });
        });
    });
});
//# sourceMappingURL=test_step_hook_definition_spec.js.map