"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const formatter_helpers_1 = require("../../../../test/formatter_helpers");
const runtime_helpers_1 = require("../../../../test/runtime_helpers");
const _1 = require("./");
(0, mocha_1.describe)('Usage Helpers', () => {
    (0, mocha_1.describe)('getUsage', () => {
        (0, mocha_1.describe)('with step definitions', () => {
            (0, mocha_1.describe)('without function definition wrapper', () => {
                (0, mocha_1.it)('includes stringified code', async () => {
                    // Arrange
                    const code = function () {
                        return 'original code';
                    };
                    const supportCodeLibrary = (0, runtime_helpers_1.buildSupportCodeLibrary)(({ Given }) => {
                        Given('a step', code);
                    });
                    const { eventDataCollector } = await (0, formatter_helpers_1.getEnvelopesAndEventDataCollector)({ supportCodeLibrary });
                    // Act
                    const output = (0, _1.getUsage)({
                        eventDataCollector,
                        stepDefinitions: supportCodeLibrary.stepDefinitions,
                    });
                    // Assert
                    (0, chai_1.expect)(output).to.have.lengthOf(1);
                    (0, chai_1.expect)(output[0].code).to.eql(code.toString());
                });
            });
            (0, mocha_1.describe)('with function definition wrapper', () => {
                (0, mocha_1.it)('includes unwrapped version of stringified code', async () => {
                    // Arrange
                    const code = function () {
                        return 'original code';
                    };
                    const supportCodeLibrary = (0, runtime_helpers_1.buildSupportCodeLibrary)(({ Given, setDefinitionFunctionWrapper }) => {
                        Given('a step', code);
                        setDefinitionFunctionWrapper((fn) => {
                            if (fn.length === 1) {
                                return fn;
                            }
                            return fn;
                        });
                    });
                    const { eventDataCollector } = await (0, formatter_helpers_1.getEnvelopesAndEventDataCollector)({ supportCodeLibrary });
                    // Act
                    const output = (0, _1.getUsage)({
                        eventDataCollector,
                        stepDefinitions: supportCodeLibrary.stepDefinitions,
                    });
                    // Assert
                    (0, chai_1.expect)(output).to.have.lengthOf(1);
                    (0, chai_1.expect)(output[0].code).to.eql(code.toString());
                });
            });
        });
    });
});
//# sourceMappingURL=index_spec.js.map