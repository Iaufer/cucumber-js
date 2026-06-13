"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const fake_timers_1 = __importDefault(require("@sinonjs/fake-timers"));
const time_1 = __importDefault(require("../time"));
const usage_steps_1 = require("../../test/fixtures/usage_steps");
const formatter_helpers_1 = require("../../test/formatter_helpers");
(0, mocha_1.describe)('UsageJsonFormatter', () => {
    let clock;
    (0, mocha_1.beforeEach)(() => {
        clock = fake_timers_1.default.withGlobal(time_1.default).install();
    });
    (0, mocha_1.afterEach)(() => {
        clock.uninstall();
    });
    (0, mocha_1.it)('outputs the usage in json format', async () => {
        // Arrange
        const sources = [
            {
                data: 'Feature: a\nScenario: b\nGiven abc\nWhen def',
                uri: 'a.feature',
            },
        ];
        const supportCodeLibrary = (0, usage_steps_1.getUsageSupportCodeLibrary)(clock);
        // Act
        const output = await (0, formatter_helpers_1.testFormatter)({
            sources,
            supportCodeLibrary,
            type: 'usage-json',
        });
        const parsedOutput = JSON.parse(output);
        // Assert
        (0, chai_1.expect)(parsedOutput).to.eql([
            {
                code: parsedOutput[0].code,
                line: 16,
                matches: [
                    {
                        duration: {
                            seconds: 0,
                            nanos: 2000000,
                        },
                        line: 4,
                        text: 'def',
                        uri: 'a.feature',
                    },
                ],
                meanDuration: {
                    seconds: 0,
                    nanos: 2000000,
                },
                pattern: 'def?',
                patternType: 'RegularExpression',
                uri: 'usage_steps.ts',
            },
            {
                code: parsedOutput[1].code,
                line: 11,
                matches: [
                    {
                        duration: {
                            seconds: 0,
                            nanos: 1000000,
                        },
                        line: 3,
                        text: 'abc',
                        uri: 'a.feature',
                    },
                ],
                meanDuration: {
                    seconds: 0,
                    nanos: 1000000,
                },
                pattern: 'abc',
                patternType: 'CucumberExpression',
                uri: 'usage_steps.ts',
            },
            {
                code: parsedOutput[2].code,
                line: 25,
                matches: [],
                pattern: 'ghi',
                patternType: 'CucumberExpression',
                uri: 'usage_steps.ts',
            },
        ]);
    });
});
//# sourceMappingURL=usage_json_formatter_spec.js.map