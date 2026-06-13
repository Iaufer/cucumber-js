"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const figures_1 = __importDefault(require("figures"));
const fake_timers_1 = __importDefault(require("@sinonjs/fake-timers"));
const time_1 = __importDefault(require("../time"));
const formatter_helpers_1 = require("../../test/formatter_helpers");
const steps_1 = require("../../test/fixtures/steps");
const runtime_helpers_1 = require("../../test/runtime_helpers");
(0, mocha_1.describe)('SummaryFormatter', () => {
    let clock;
    (0, mocha_1.beforeEach)(() => {
        clock = fake_timers_1.default.withGlobal(time_1.default).install();
    });
    (0, mocha_1.afterEach)(() => {
        clock.uninstall();
    });
    (0, mocha_1.describe)('issues', () => {
        (0, mocha_1.describe)('with a failing scenario', () => {
            (0, mocha_1.it)('logs the issue', async () => {
                // Arrange
                const sources = [
                    {
                        data: 'Feature: a\nScenario: b\nGiven a failing step',
                        uri: 'a.feature',
                    },
                ];
                const supportCodeLibrary = (0, steps_1.getBaseSupportCodeLibrary)();
                // Act
                const output = await (0, formatter_helpers_1.testFormatter)({
                    sources,
                    supportCodeLibrary,
                    type: 'summary',
                });
                // Assert
                (0, chai_1.expect)(output).to.eql('Failures:\n' +
                    '\n' +
                    '1) Scenario: b # a.feature:2\n' +
                    `   ${figures_1.default.cross} Given a failing step # steps.ts:9\n` +
                    '       Error: error\n' +
                    '\n' +
                    '1 scenario (1 failed)\n' +
                    '1 step (1 failed)\n' +
                    '<duration-stat>\n');
            });
        });
        (0, mocha_1.describe)('with a failing rule -> example', () => {
            (0, mocha_1.it)('logs the issue', async () => {
                // Arrange
                const sources = [
                    {
                        data: 'Feature: a\nRule: b\nExample: c\nGiven a failing step',
                        uri: 'a.feature',
                    },
                ];
                const supportCodeLibrary = (0, steps_1.getBaseSupportCodeLibrary)();
                // Act
                const output = await (0, formatter_helpers_1.testFormatter)({
                    sources,
                    supportCodeLibrary,
                    type: 'summary',
                });
                // Assert
                (0, chai_1.expect)(output).to.eql('Failures:\n' +
                    '\n' +
                    '1) Scenario: c # a.feature:3\n' +
                    `   ${figures_1.default.cross} Given a failing step # steps.ts:9\n` +
                    '       Error: error\n' +
                    '\n' +
                    '1 scenario (1 failed)\n' +
                    '1 step (1 failed)\n' +
                    '<duration-stat>\n');
            });
        });
        (0, mocha_1.describe)('with an ambiguous step', () => {
            (0, mocha_1.it)('logs the issue', async () => {
                // Arrange
                const sources = [
                    {
                        data: 'Feature: a\nScenario: b\nGiven an ambiguous step',
                        uri: 'a.feature',
                    },
                ];
                const supportCodeLibrary = (0, steps_1.getBaseSupportCodeLibrary)();
                // Act
                const output = await (0, formatter_helpers_1.testFormatter)({
                    sources,
                    supportCodeLibrary,
                    type: 'summary',
                });
                // Assert
                (0, chai_1.expect)(output).to.eql('Failures:\n' +
                    '\n' +
                    '1) Scenario: b # a.feature:2\n' +
                    `   ${figures_1.default.cross} Given an ambiguous step\n` +
                    '\n' +
                    '1 scenario (1 ambiguous)\n' +
                    '1 step (1 ambiguous)\n' +
                    '<duration-stat>\n');
            });
        });
        (0, mocha_1.describe)('with an undefined step', () => {
            (0, mocha_1.it)('logs the issue', async () => {
                // Arrange
                const sources = [
                    {
                        data: 'Feature: a\nScenario: b\nGiven an undefined step',
                        uri: 'a.feature',
                    },
                ];
                // Act
                const output = await (0, formatter_helpers_1.testFormatter)({
                    sources,
                    type: 'summary',
                });
                // Assert
                (0, chai_1.expect)(output).to.eql('Failures:\n' +
                    '\n' +
                    '1) Scenario: b # a.feature:2\n' +
                    '   ? Given an undefined step\n' +
                    '       Undefined. Implement with the following snippet:\n' +
                    '\n' +
                    "         Given('an undefined step', function () {\n" +
                    '           // Write code here that turns the phrase above into concrete actions\n' +
                    "           return 'pending';\n" +
                    '         });\n' +
                    '\n' +
                    '\n' +
                    '1 scenario (1 undefined)\n' +
                    '1 step (1 undefined)\n' +
                    '<duration-stat>\n');
            });
        });
        (0, mocha_1.describe)('with a pending step', () => {
            (0, mocha_1.it)('logs the issue', async () => {
                // Arrange
                const sources = [
                    {
                        data: 'Feature: a\nScenario: b\nGiven a pending step',
                        uri: 'a.feature',
                    },
                ];
                const supportCodeLibrary = (0, steps_1.getBaseSupportCodeLibrary)();
                // Act
                const output = await (0, formatter_helpers_1.testFormatter)({
                    sources,
                    supportCodeLibrary,
                    type: 'summary',
                });
                // Assert
                (0, chai_1.expect)(output).to.eql('Warnings:\n' +
                    '\n' +
                    '1) Scenario: b # a.feature:2\n' +
                    '   ? Given a pending step # steps.ts:16\n' +
                    '       Pending\n' +
                    '\n' +
                    '1 scenario (1 pending)\n' +
                    '1 step (1 pending)\n' +
                    '<duration-stat>\n');
            });
        });
        (0, mocha_1.describe)('retrying a flaky step', () => {
            (0, mocha_1.it)('logs the issue', async () => {
                const runtimeOptions = { retry: 1 };
                const sources = [
                    {
                        data: 'Feature: a\nScenario: b\nGiven a flaky step',
                        uri: 'a.feature',
                    },
                ];
                const supportCodeLibrary = (0, steps_1.getBaseSupportCodeLibrary)();
                // Act
                const output = await (0, formatter_helpers_1.testFormatter)({
                    runtimeOptions,
                    sources,
                    supportCodeLibrary,
                    type: 'summary',
                });
                // Assert
                (0, chai_1.expect)(output).to.eql('Warnings:\n' +
                    '\n' +
                    '1) Scenario: b (attempt 1, retried) # a.feature:2\n' +
                    `   ${figures_1.default.cross} Given a flaky step # steps.ts:21\n` +
                    '       Error: error\n' +
                    '\n' +
                    '1 scenario (1 passed)\n' +
                    '1 step (1 passed)\n' +
                    '<duration-stat>\n');
            });
        });
        (0, mocha_1.describe)('retrying with a failing step', () => {
            (0, mocha_1.it)('logs the issue', async () => {
                const runtimeOptions = { retry: 1 };
                const sources = [
                    {
                        data: 'Feature: a\nScenario: b\nGiven a failing step',
                        uri: 'a.feature',
                    },
                ];
                const supportCodeLibrary = (0, steps_1.getBaseSupportCodeLibrary)();
                // Act
                const output = await (0, formatter_helpers_1.testFormatter)({
                    runtimeOptions,
                    sources,
                    supportCodeLibrary,
                    type: 'summary',
                });
                // Assert
                (0, chai_1.expect)(output).to.eql('Failures:\n' +
                    '\n' +
                    '1) Scenario: b (attempt 2) # a.feature:2\n' +
                    `   ${figures_1.default.cross} Given a failing step # steps.ts:9\n` +
                    '       Error: error\n' +
                    '\n' +
                    'Warnings:\n' +
                    '\n' +
                    '1) Scenario: b (attempt 1, retried) # a.feature:2\n' +
                    `   ${figures_1.default.cross} Given a failing step # steps.ts:9\n` +
                    '       Error: error\n' +
                    '\n' +
                    '1 scenario (1 failed)\n' +
                    '1 step (1 failed)\n' +
                    '<duration-stat>\n');
            });
        });
        (0, mocha_1.describe)('with an undefined parameter type', () => {
            (0, mocha_1.it)('logs the issue', async () => {
                // Arrange
                const sources = [
                    {
                        data: 'Feature: a\nScenario: b\nGiven a step',
                        uri: 'a.feature',
                    },
                ];
                const supportCodeLibrary = (0, runtime_helpers_1.buildSupportCodeLibrary)(({ Given }) => {
                    Given('a step', function () { });
                    Given('a {param} step', function () { });
                    Given('another {param} step', function () { });
                    Given('a different {foo} step', function () { });
                });
                // Act
                const output = await (0, formatter_helpers_1.testFormatter)({
                    sources,
                    supportCodeLibrary,
                    type: 'summary',
                });
                // Assert
                (0, chai_1.expect)(output).to.eql(`Undefined parameter types:

- "param" e.g. \`another {param} step\`
- "foo" e.g. \`a different {foo} step\`

1 scenario (1 passed)
1 step (1 passed)
<duration-stat>
`);
            });
        });
    });
});
//# sourceMappingURL=summary_formatter_spec.js.map