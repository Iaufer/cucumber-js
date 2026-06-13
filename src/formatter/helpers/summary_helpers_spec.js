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
const node_stream_1 = require("node:stream");
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const fake_timers_1 = __importDefault(require("@sinonjs/fake-timers"));
const messages = __importStar(require("@cucumber/messages"));
const get_color_fns_1 = __importDefault(require("../get_color_fns"));
const formatter_helpers_1 = require("../../../test/formatter_helpers");
const steps_1 = require("../../../test/fixtures/steps");
const time_1 = __importStar(require("../../time"));
const runtime_helpers_1 = require("../../../test/runtime_helpers");
const value_checker_1 = require("../../value_checker");
const summary_helpers_1 = require("./summary_helpers");
async function testFormatSummary({ runtimeOptions, sourceData, supportCodeLibrary, testRunStarted, testRunFinished, }) {
    const sources = [
        {
            data: sourceData,
            uri: 'project/a.feature',
        },
    ];
    if ((0, value_checker_1.doesNotHaveValue)(supportCodeLibrary)) {
        supportCodeLibrary = (0, steps_1.getBaseSupportCodeLibrary)();
    }
    if ((0, value_checker_1.doesNotHaveValue)(testRunStarted)) {
        testRunStarted = {
            timestamp: messages.TimeConversion.millisecondsSinceEpochToTimestamp(0),
        };
    }
    if ((0, value_checker_1.doesNotHaveValue)(testRunFinished)) {
        testRunFinished = {
            timestamp: messages.TimeConversion.millisecondsSinceEpochToTimestamp(0),
            success: true,
        };
    }
    const testCaseAttempts = await (0, formatter_helpers_1.getTestCaseAttempts)({
        runtimeOptions,
        sources,
        supportCodeLibrary,
    });
    return (0, summary_helpers_1.formatSummary)({
        colorFns: (0, get_color_fns_1.default)(new node_stream_1.PassThrough(), {}, false),
        testCaseAttempts,
        testRunDuration: (0, time_1.durationBetweenTimestamps)(testRunStarted.timestamp, testRunFinished.timestamp),
    });
}
(0, mocha_1.describe)('SummaryHelpers', () => {
    let clock;
    (0, mocha_1.beforeEach)(() => {
        clock = fake_timers_1.default.withGlobal(time_1.default).install();
    });
    (0, mocha_1.afterEach)(() => {
        clock.uninstall();
    });
    (0, mocha_1.describe)('formatSummary', () => {
        (0, mocha_1.describe)('with no test cases', () => {
            (0, mocha_1.it)('outputs step totals, scenario totals, and duration', async () => {
                // Arrange
                const sourceData = '';
                // Act
                const output = await testFormatSummary({ sourceData });
                // Assert
                (0, chai_1.expect)(output).to.contain('0 scenarios\n' +
                    '0 steps\n' +
                    '0m00.000s (executing steps: 0m00.000s)\n');
            });
        });
        (0, mocha_1.describe)('with one passing scenario with one passing step', () => {
            (0, mocha_1.it)('outputs the totals and number of each status', async () => {
                // Arrange
                const sourceData = [
                    'Feature: a',
                    'Scenario: b',
                    'Given a passing step',
                ].join('\n');
                // Act
                const output = await testFormatSummary({ sourceData });
                // Assert
                (0, chai_1.expect)(output).to.contain('1 scenario (1 passed)\n' +
                    '1 step (1 passed)\n' +
                    '0m00.000s (executing steps: 0m00.000s)\n');
            });
        });
        (0, mocha_1.describe)('with one passing scenario with one step and hook', () => {
            (0, mocha_1.it)('filter out the hooks', async () => {
                // Arrange
                const sourceData = [
                    'Feature: a',
                    'Scenario: b',
                    'Given a passing step',
                ].join('\n');
                const supportCodeLibrary = (0, runtime_helpers_1.buildSupportCodeLibrary)(({ Given, Before }) => {
                    Given('a passing step', () => { });
                    Before(() => { });
                });
                // Act
                const output = await testFormatSummary({
                    sourceData,
                    supportCodeLibrary,
                });
                // Assert
                (0, chai_1.expect)(output).to.contain('1 scenario (1 passed)\n' +
                    '1 step (1 passed)\n' +
                    '0m00.000s (executing steps: 0m00.000s)\n');
            });
        });
        (0, mocha_1.describe)('with one scenario that failed and was retried then passed', () => {
            (0, mocha_1.it)('filters out the retried attempts', async () => {
                // Arrange
                const sourceData = [
                    'Feature: a',
                    'Scenario: b',
                    'Given a flaky step',
                ].join('\n');
                const supportCodeLibrary = (0, runtime_helpers_1.buildSupportCodeLibrary)(({ Given }) => {
                    let willPass = false;
                    Given('a flaky step', function () {
                        if (willPass) {
                            return;
                        }
                        willPass = true;
                        throw 'error';
                    });
                });
                // Act
                const output = await testFormatSummary({
                    runtimeOptions: { retry: 1 },
                    sourceData,
                    supportCodeLibrary,
                });
                // Assert
                (0, chai_1.expect)(output).to.contain('1 scenario (1 passed)\n' +
                    '1 step (1 passed)\n' +
                    '0m00.000s (executing steps: 0m00.000s)\n');
            });
        });
        (0, mocha_1.describe)('with one passing scenario with multiple passing steps', () => {
            (0, mocha_1.it)('outputs the totals and number of each status', async () => {
                // Arrange
                const sourceData = [
                    'Feature: a',
                    'Scenario: b',
                    'Given a passing step',
                    'Then a passing step',
                ].join('\n');
                // Act
                const output = await testFormatSummary({ sourceData });
                // Assert
                (0, chai_1.expect)(output).to.contain('1 scenario (1 passed)\n' +
                    '2 steps (2 passed)\n' +
                    '0m00.000s (executing steps: 0m00.000s)\n');
            });
        });
        (0, mocha_1.describe)('with one of every kind of scenario', () => {
            (0, mocha_1.it)('outputs the totals and number of each status', async () => {
                // Arrange
                const sourceData = [
                    'Feature: a',
                    '  Scenario: a1',
                    '    Given an ambiguous step',
                    '  Scenario: a2',
                    '    Given a failing step',
                    '  Scenario: a3',
                    '    Given a pending step',
                    '  Scenario: a4',
                    '    Given a passing step',
                    '  Scenario: a5',
                    '    Given a skipped step',
                    '  Scenario: a6',
                    '    Given an undefined step',
                    // an unknown scenario
                    '  Scenario:',
                ].join('\n');
                // Act
                const output = await testFormatSummary({ sourceData });
                // Assert
                (0, chai_1.expect)(output).to.contain('7 scenarios (1 failed, 1 ambiguous, 1 undefined, 1 pending, 1 skipped, 1 passed, 1 unknown)\n' +
                    '6 steps (1 failed, 1 ambiguous, 1 undefined, 1 pending, 1 skipped, 1 passed)\n' +
                    '0m00.000s (executing steps: 0m00.000s)\n');
            });
        });
        (0, mocha_1.describe)('with a test run finished timestamp of 124 milliseconds and total step duration of 123 milliseconds', () => {
            (0, mocha_1.it)('outputs the duration as `0m00.124s (executing steps: 0m00.123s)`', async () => {
                // Arrange
                const sourceData = [
                    'Feature: a',
                    'Scenario: b',
                    'Given a passing step',
                ].join('\n');
                const supportCodeLibrary = (0, runtime_helpers_1.buildSupportCodeLibrary)(({ Given }) => {
                    Given('a passing step', () => {
                        clock.tick(123);
                    });
                });
                // Act
                const output = await testFormatSummary({
                    sourceData,
                    supportCodeLibrary,
                    testRunStarted: {
                        timestamp: {
                            nanos: 0,
                            seconds: 3,
                        },
                    },
                    testRunFinished: {
                        timestamp: {
                            nanos: 124000000,
                            seconds: 3,
                        },
                        success: true,
                    },
                });
                // Assert
                (0, chai_1.expect)(output).to.contain('1 scenario (1 passed)\n' +
                    '1 step (1 passed)\n' +
                    '0m00.124s (executing steps: 0m00.123s)\n');
            });
        });
        (0, mocha_1.describe)('with a test run finished timestamp of 12.4 seconds and total step duration of 12.3 seconds', () => {
            (0, mocha_1.it)('outputs the duration as `0m12.400s (executing steps: 0m12.300s)`', async () => {
                // Arrange
                const sourceData = [
                    'Feature: a',
                    'Scenario: b',
                    'Given a passing step',
                ].join('\n');
                const supportCodeLibrary = (0, runtime_helpers_1.buildSupportCodeLibrary)(({ Given }) => {
                    Given('a passing step', () => {
                        clock.tick(12.3 * 1000);
                    });
                });
                // Act
                const output = await testFormatSummary({
                    sourceData,
                    supportCodeLibrary,
                    testRunFinished: {
                        timestamp: {
                            nanos: 400000000,
                            seconds: 12,
                        },
                        success: true,
                    },
                });
                // Assert
                (0, chai_1.expect)(output).to.contain('1 scenario (1 passed)\n' +
                    '1 step (1 passed)\n' +
                    '0m12.400s (executing steps: 0m12.300s)\n');
            });
        });
        (0, mocha_1.describe)('with a test run finished timestamp of 124 seconds and total step duration of 123 seconds', () => {
            (0, mocha_1.it)('outputs the duration as `2m04.000s (executing steps: 2m03.000s)`', async () => {
                // Arrange
                const sourceData = [
                    'Feature: a',
                    'Scenario: b',
                    'Given a passing step',
                ].join('\n');
                const supportCodeLibrary = (0, runtime_helpers_1.buildSupportCodeLibrary)(({ Given }) => {
                    Given('a passing step', () => {
                        clock.tick(123 * 1000);
                    });
                });
                // Act
                const output = await testFormatSummary({
                    sourceData,
                    supportCodeLibrary,
                    testRunFinished: {
                        timestamp: {
                            nanos: 0,
                            seconds: 124,
                        },
                        success: true,
                    },
                });
                // Assert
                (0, chai_1.expect)(output).to.contain('1 scenario (1 passed)\n' +
                    '1 step (1 passed)\n' +
                    '2m04.000s (executing steps: 2m03.000s)\n');
            });
        });
        (0, mocha_1.describe)('with one passing scenario with one step and a beforeStep and afterStep hook', () => {
            (0, mocha_1.it)('outputs the duration as `0m24.000s (executing steps: 0m24.000s)`', async () => {
                // Arrange
                const sourceData = [
                    'Feature: a',
                    'Scenario: b',
                    'Given a passing step',
                ].join('\n');
                const supportCodeLibrary = (0, runtime_helpers_1.buildSupportCodeLibrary)(({ Given, BeforeStep, AfterStep }) => {
                    Given('a passing step', () => {
                        clock.tick(12.3 * 1000);
                    });
                    BeforeStep(() => {
                        clock.tick(5 * 1000);
                    });
                    AfterStep(() => {
                        clock.tick(6.7 * 1000);
                    });
                });
                // Act
                const output = await testFormatSummary({
                    sourceData,
                    supportCodeLibrary,
                    testRunFinished: {
                        timestamp: {
                            nanos: 0,
                            seconds: 24,
                        },
                        success: true,
                    },
                });
                // Assert
                (0, chai_1.expect)(output).to.contain('1 scenario (1 passed)\n' +
                    '1 step (1 passed)\n' +
                    '0m24.000s (executing steps: 0m24.000s)\n');
            });
        });
    });
});
//# sourceMappingURL=summary_helpers_spec.js.map