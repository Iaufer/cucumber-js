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
const node_events_1 = require("node:events");
const sinon_1 = __importDefault(require("sinon"));
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const messages = __importStar(require("@cucumber/messages"));
const messages_1 = require("@cucumber/messages");
const fake_timers_1 = __importDefault(require("@sinonjs/fake-timers"));
const runtime_helpers_1 = require("../../test/runtime_helpers");
const gherkin_helpers_1 = require("../../test/gherkin_helpers");
const time_1 = __importDefault(require("../time"));
const steps_1 = require("../../test/fixtures/steps");
const value_checker_1 = require("../value_checker");
const builder_1 = __importDefault(require("../formatter/builder"));
const assemble_1 = require("../assemble");
const test_case_runner_1 = __importDefault(require("./test_case_runner"));
async function testRunner(options) {
    const envelopes = [];
    const eventBroadcaster = new node_events_1.EventEmitter();
    const newId = messages_1.IdGenerator.incrementing();
    const testCase = (await (0, assemble_1.assembleTestCases)(newId(), eventBroadcaster, newId, [
        {
            gherkinDocument: options.gherkinDocument,
            pickle: options.pickle,
        },
    ], options.supportCodeLibrary))[0].testCase;
    // listen for envelopers _after_ we've assembled test cases
    eventBroadcaster.on('envelope', (e) => envelopes.push(e));
    const snippetBuilder = await builder_1.default.getStepDefinitionSnippetBuilder({
        cwd: process.cwd(),
        supportCodeLibrary: options.supportCodeLibrary,
    });
    const runner = new test_case_runner_1.default({
        workerId: options.workerId,
        eventBroadcaster,
        gherkinDocument: options.gherkinDocument,
        newId,
        pickle: options.pickle,
        testCase,
        retries: (0, value_checker_1.valueOrDefault)(options.retries, 0),
        filterStackTraces: false,
        skip: (0, value_checker_1.valueOrDefault)(options.skip, false),
        supportCodeLibrary: options.supportCodeLibrary,
        worldParameters: {},
        snippetBuilder,
    });
    const result = await runner.run();
    return { envelopes, result };
}
function predictableTimestamp(counter) {
    return {
        nanos: 1000000 * counter,
        seconds: 0,
    };
}
(0, mocha_1.describe)('TestCaseRunner', () => {
    let clock;
    (0, mocha_1.beforeEach)(() => {
        clock = fake_timers_1.default.withGlobal(time_1.default).install();
    });
    (0, mocha_1.afterEach)(() => {
        clock.uninstall();
    });
    (0, mocha_1.describe)('run()', () => {
        (0, mocha_1.describe)('with a passing step', () => {
            (0, mocha_1.it)('emits testCase / testCaseStarted / testStepStarted / testStepFinished / testCaseFinished envelopes and returns the result', async () => {
                // Arrange
                const supportCodeLibrary = (0, runtime_helpers_1.buildSupportCodeLibrary)(({ Given }) => {
                    Given('a step', function () {
                        clock.tick(1);
                    });
                });
                const { gherkinDocument, pickles: [pickle], } = await (0, gherkin_helpers_1.parse)({
                    data: ['Feature: a', 'Scenario: b', 'Given a step'].join('\n'),
                    uri: 'a.feature',
                });
                const passedTestResult = {
                    duration: messages.TimeConversion.millisecondsToDuration(1),
                    status: messages.TestStepResultStatus.PASSED,
                };
                // Act
                const { envelopes, result } = await testRunner({
                    gherkinDocument,
                    pickle,
                    supportCodeLibrary,
                });
                // Assert
                const expectedEnvelopes = [
                    {
                        testCaseStarted: {
                            attempt: 0,
                            id: '3',
                            testCaseId: '1',
                            timestamp: predictableTimestamp(0),
                        },
                    },
                    {
                        testStepStarted: {
                            testCaseStartedId: '3',
                            testStepId: '2',
                            timestamp: predictableTimestamp(0),
                        },
                    },
                    {
                        testStepFinished: {
                            testCaseStartedId: '3',
                            testStepResult: passedTestResult,
                            testStepId: '2',
                            timestamp: predictableTimestamp(1),
                        },
                    },
                    {
                        testCaseFinished: {
                            testCaseStartedId: '3',
                            timestamp: predictableTimestamp(1),
                            willBeRetried: false,
                        },
                    },
                ];
                (0, chai_1.expect)(envelopes).to.eql(expectedEnvelopes);
                (0, chai_1.expect)(result).to.eql(messages.TestStepResultStatus.PASSED);
            });
        });
        (0, mocha_1.describe)('with a failing step', () => {
            (0, mocha_1.it)('emits and returns failing results', async () => {
                // Arrange
                const supportCodeLibrary = (0, runtime_helpers_1.buildSupportCodeLibrary)(({ Given }) => {
                    Given('a step', function () {
                        throw 'fail';
                    });
                });
                const { gherkinDocument, pickles: [pickle], } = await (0, gherkin_helpers_1.parse)({
                    data: ['Feature: a', 'Scenario: b', 'Given a step'].join('\n'),
                    uri: 'a.feature',
                });
                const failingTestResult = {
                    duration: messages.TimeConversion.millisecondsToDuration(0),
                    status: messages.TestStepResultStatus.FAILED,
                    message: 'Error: fail',
                    exception: {
                        type: 'Error',
                        message: 'fail',
                        stackTrace: 'Error: fail',
                    },
                };
                // Act
                const { envelopes, result } = await testRunner({
                    gherkinDocument,
                    pickle,
                    supportCodeLibrary,
                });
                // Assert
                (0, chai_1.expect)(envelopes).to.have.lengthOf(4);
                (0, chai_1.expect)(envelopes[2].testStepFinished.testStepResult).to.eql(failingTestResult);
                (0, chai_1.expect)(result).to.eql(messages.TestStepResultStatus.FAILED);
            });
            (0, mocha_1.it)('should provide the error to AfterStep and After hooks', async () => {
                // Arrange
                const error = new Error('fail');
                const afterStepStub = sinon_1.default.stub();
                const afterStub = sinon_1.default.stub();
                const supportCodeLibrary = (0, runtime_helpers_1.buildSupportCodeLibrary)(({ Given, AfterStep, After }) => {
                    Given('a step', function () {
                        throw error;
                    });
                    AfterStep(afterStepStub);
                    After(afterStub);
                });
                const { gherkinDocument, pickles: [pickle], } = await (0, gherkin_helpers_1.parse)({
                    data: ['Feature: a', 'Scenario: b', 'Given a step'].join('\n'),
                    uri: 'a.feature',
                });
                // Act
                await testRunner({
                    gherkinDocument,
                    pickle,
                    supportCodeLibrary,
                });
                // Assert
                (0, chai_1.expect)(afterStepStub).to.have.been.calledOnce();
                (0, chai_1.expect)(afterStepStub.lastCall.firstArg.error).to.eq(error);
                (0, chai_1.expect)(afterStub).to.have.been.calledOnce();
                (0, chai_1.expect)(afterStub.lastCall.firstArg.error).to.eq(error);
            });
        });
        (0, mocha_1.describe)('with an ambiguous step', () => {
            (0, mocha_1.it)('emits the expected envelopes and returns an ambiguous result', async () => {
                // Arrange
                const supportCodeLibrary = (0, steps_1.getBaseSupportCodeLibrary)();
                const { gherkinDocument, pickles: [pickle], } = await (0, gherkin_helpers_1.parse)({
                    data: ['Feature: a', 'Scenario: b', 'Given an ambiguous step'].join('\n'),
                    uri: 'a.feature',
                });
                // Act
                const { envelopes, result } = await testRunner({
                    gherkinDocument,
                    pickle,
                    supportCodeLibrary,
                });
                // Assert
                (0, chai_1.expect)(envelopes).to.have.lengthOf(4);
                const expected = {
                    status: messages.TestStepResultStatus.AMBIGUOUS,
                    duration: messages.TimeConversion.millisecondsToDuration(0),
                };
                (0, chai_1.expect)(envelopes[2].testStepFinished.testStepResult).to.eql(expected);
                (0, chai_1.expect)(result).to.eql(envelopes[2].testStepFinished.testStepResult.status);
            });
        });
        (0, mocha_1.describe)('with a undefined step', () => {
            (0, mocha_1.it)('emits the expected envelopes and returns a undefined result', async () => {
                // Arrange
                const supportCodeLibrary = (0, runtime_helpers_1.buildSupportCodeLibrary)();
                const { gherkinDocument, pickles: [pickle], } = await (0, gherkin_helpers_1.parse)({
                    data: ['Feature: a', 'Scenario: b', 'Given a step'].join('\n'),
                    uri: 'a.feature',
                });
                // Act
                const { envelopes, result } = await testRunner({
                    gherkinDocument,
                    pickle,
                    supportCodeLibrary,
                });
                // Assert
                (0, chai_1.expect)(envelopes).to.have.lengthOf(5);
                (0, chai_1.expect)(envelopes[2].suggestion.snippets).to.have.lengthOf(1);
                (0, chai_1.expect)(envelopes[3].testStepFinished.testStepResult).to.eql({
                    status: messages.TestStepResultStatus.UNDEFINED,
                    duration: messages.TimeConversion.millisecondsToDuration(0),
                });
                (0, chai_1.expect)(result).to.eql(envelopes[3].testStepFinished.testStepResult.status);
            });
        });
        (0, mocha_1.describe)('with a flaky step and a positive retries value', () => {
            (0, mocha_1.it)('emits the expected envelopes and returns a passing result', async () => {
                // Arrange
                const supportCodeLibrary = (0, runtime_helpers_1.buildSupportCodeLibrary)(({ Given }) => {
                    let willPass = false;
                    Given('a step', function () {
                        clock.tick(1);
                        if (willPass) {
                            return;
                        }
                        willPass = true;
                        throw 'Oh no!';
                    });
                });
                const { gherkinDocument, pickles: [pickle], } = await (0, gherkin_helpers_1.parse)({
                    data: ['Feature: a', 'Scenario: b', 'Given a step'].join('\n'),
                    uri: 'a.feature',
                });
                // Act
                const { envelopes, result } = await testRunner({
                    gherkinDocument,
                    pickle,
                    retries: 1,
                    supportCodeLibrary,
                });
                // Assert
                const expected = [
                    {
                        testCaseStarted: {
                            attempt: 0,
                            id: '3',
                            testCaseId: '1',
                            timestamp: predictableTimestamp(0),
                        },
                    },
                    {
                        testStepStarted: {
                            testCaseStartedId: '3',
                            testStepId: '2',
                            timestamp: predictableTimestamp(0),
                        },
                    },
                    {
                        testStepFinished: {
                            testCaseStartedId: '3',
                            testStepResult: {
                                duration: messages.TimeConversion.millisecondsToDuration(1),
                                message: 'Error: Oh no!',
                                exception: {
                                    type: 'Error',
                                    message: 'Oh no!',
                                    stackTrace: 'Error: Oh no!',
                                },
                                status: messages.TestStepResultStatus.FAILED,
                            },
                            testStepId: '2',
                            timestamp: predictableTimestamp(1),
                        },
                    },
                    {
                        testCaseFinished: {
                            testCaseStartedId: '3',
                            timestamp: predictableTimestamp(1),
                            willBeRetried: true,
                        },
                    },
                    {
                        testCaseStarted: {
                            attempt: 1,
                            id: '4',
                            testCaseId: '1',
                            timestamp: predictableTimestamp(1),
                        },
                    },
                    {
                        testStepStarted: {
                            testCaseStartedId: '4',
                            testStepId: '2',
                            timestamp: predictableTimestamp(1),
                        },
                    },
                    {
                        testStepFinished: {
                            testCaseStartedId: '4',
                            testStepResult: {
                                duration: messages.TimeConversion.millisecondsToDuration(1),
                                status: messages.TestStepResultStatus.PASSED,
                            },
                            testStepId: '2',
                            timestamp: predictableTimestamp(2),
                        },
                    },
                    {
                        testCaseFinished: {
                            testCaseStartedId: '4',
                            timestamp: predictableTimestamp(2),
                            willBeRetried: false,
                        },
                    },
                ];
                (0, chai_1.expect)(envelopes).to.eql(expected);
                (0, chai_1.expect)(result).to.eql(messages.TestStepResultStatus.PASSED);
            });
            (0, mocha_1.it)('should provide the correctly willBeRetried value to the hook', async () => {
                // Arrange
                const hookStub = sinon_1.default.stub();
                const supportCodeLibrary = (0, runtime_helpers_1.buildSupportCodeLibrary)(({ Given, After }) => {
                    let willPass = false;
                    Given('a step', function () {
                        if (willPass) {
                            return;
                        }
                        willPass = true;
                        throw 'error';
                    });
                    After(hookStub);
                });
                const { gherkinDocument, pickles: [pickle], } = await (0, gherkin_helpers_1.parse)({
                    data: ['Feature: a', 'Scenario: b', 'Given a step'].join('\n'),
                    uri: 'a.feature',
                });
                // Act
                await testRunner({
                    gherkinDocument,
                    pickle,
                    retries: 1,
                    supportCodeLibrary,
                });
                // Assert
                (0, chai_1.expect)(hookStub).to.have.been.calledTwice();
                (0, chai_1.expect)(hookStub.args[0][0].willBeRetried).to.eq(true);
                (0, chai_1.expect)(hookStub.args[1][0].willBeRetried).to.eq(false);
            });
        });
        (0, mocha_1.describe)('with a step when skipping', () => {
            (0, mocha_1.it)('emits the expected envelopes and returns a skipped result', async () => {
                // Arrange
                const supportCodeLibrary = (0, runtime_helpers_1.buildSupportCodeLibrary)(({ Given }) => {
                    Given('a step', function () {
                        clock.tick(1);
                    });
                });
                const { gherkinDocument, pickles: [pickle], } = await (0, gherkin_helpers_1.parse)({
                    data: ['Feature: a', 'Scenario: b', 'Given a step'].join('\n'),
                    uri: 'a.feature',
                });
                // Act
                const { envelopes, result } = await testRunner({
                    gherkinDocument,
                    pickle,
                    skip: true,
                    supportCodeLibrary,
                });
                // Assert
                (0, chai_1.expect)(envelopes).to.have.lengthOf(4);
                const expected = {
                    status: messages.TestStepResultStatus.SKIPPED,
                    duration: messages.TimeConversion.millisecondsToDuration(0),
                };
                (0, chai_1.expect)(envelopes[2].testStepFinished.testStepResult).to.eql(expected);
                (0, chai_1.expect)(result).to.eql(envelopes[2].testStepFinished.testStepResult.status);
            });
        });
        (0, mocha_1.describe)('with test case hooks', () => {
            (0, mocha_1.it)('emits the expected envelopes and returns a skipped result', async () => {
                // Arrange
                const supportCodeLibrary = (0, runtime_helpers_1.buildSupportCodeLibrary)(({ Given, Before, After }) => {
                    Given('a step', function () {
                        clock.tick(1);
                    });
                    Before(function () { });
                    After(function () { });
                });
                const { gherkinDocument, pickles: [pickle], } = await (0, gherkin_helpers_1.parse)({
                    data: ['Feature: a', 'Scenario: b', 'Given a step'].join('\n'),
                    uri: 'a.feature',
                });
                // Act
                const { envelopes, result } = await testRunner({
                    gherkinDocument,
                    pickle,
                    supportCodeLibrary,
                });
                // Assert
                (0, chai_1.expect)(envelopes).to.have.lengthOf(8);
                (0, chai_1.expect)(result).to.eql(envelopes[6].testStepFinished.testStepResult.status);
            });
        });
        (0, mocha_1.describe)('with step hooks', () => {
            (0, mocha_1.it)('emits the expected envelopes and returns a skipped result', async () => {
                const beforeStep = sinon_1.default.stub();
                const afterStep = sinon_1.default.stub();
                // Arrange
                const supportCodeLibrary = (0, runtime_helpers_1.buildSupportCodeLibrary)(({ Given, BeforeStep, AfterStep }) => {
                    Given('a step', function () {
                        clock.tick(1);
                    });
                    BeforeStep(beforeStep);
                    AfterStep(afterStep);
                });
                const { gherkinDocument, pickles: [pickle], } = await (0, gherkin_helpers_1.parse)({
                    data: ['Feature: a', 'Scenario: b', 'Given a step'].join('\n'),
                    uri: 'a.feature',
                });
                // Act
                const { envelopes, result } = await testRunner({
                    gherkinDocument,
                    pickle,
                    supportCodeLibrary,
                });
                // Assert
                (0, chai_1.expect)(envelopes).to.have.lengthOf(4);
                (0, chai_1.expect)(result).to.eql(envelopes[2].testStepFinished.testStepResult.status);
                (0, chai_1.expect)(beforeStep).to.have.been.calledOnceWith({
                    gherkinDocument,
                    pickle,
                    pickleStep: pickle.steps[0],
                    testCaseStartedId: envelopes[1].testStepStarted.testCaseStartedId,
                    testStepId: envelopes[1].testStepStarted.testStepId,
                    result: undefined,
                    error: undefined,
                });
                (0, chai_1.expect)(afterStep).to.have.been.calledOnceWith({
                    gherkinDocument,
                    pickle,
                    pickleStep: pickle.steps[0],
                    testCaseStartedId: envelopes[2].testStepFinished.testCaseStartedId,
                    testStepId: envelopes[2].testStepFinished.testStepId,
                    result: envelopes[2].testStepFinished.testStepResult,
                    error: undefined,
                });
            });
        });
        (0, mocha_1.it)('emits workerId on testCaseStarted when provided', async () => {
            // Arrange
            const supportCodeLibrary = (0, runtime_helpers_1.buildSupportCodeLibrary)(({ Given }) => {
                Given('a step', function () {
                    clock.tick(1);
                });
            });
            const { gherkinDocument, pickles: [pickle], } = await (0, gherkin_helpers_1.parse)({
                data: ['Feature: a', 'Scenario: b', 'Given a step'].join('\n'),
                uri: 'a.feature',
            });
            // Act
            const { envelopes } = await testRunner({
                workerId: 'foo',
                gherkinDocument,
                pickle,
                supportCodeLibrary,
            });
            // Assert
            (0, chai_1.expect)(envelopes).to.deep.include({
                testCaseStarted: {
                    workerId: 'foo',
                    attempt: 0,
                    id: '3',
                    testCaseId: '1',
                    timestamp: predictableTimestamp(0),
                },
            });
        });
    });
});
//# sourceMappingURL=test_case_runner_spec.js.map