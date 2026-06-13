"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_events_1 = require("node:events");
const messages_1 = require("@cucumber/messages");
const mocha_1 = require("mocha");
const fake_timers_1 = __importDefault(require("@sinonjs/fake-timers"));
const chai_1 = require("chai");
const time_1 = __importDefault(require("../time"));
const runtime_helpers_1 = require("../../test/runtime_helpers");
const gherkin_helpers_1 = require("../../test/gherkin_helpers");
const assemble_test_cases_1 = require("./assemble_test_cases");
async function testAssembleTestCases({ gherkinDocument, pickles, supportCodeLibrary, }) {
    const envelopes = [];
    const eventBroadcaster = new node_events_1.EventEmitter();
    eventBroadcaster.on('envelope', (e) => envelopes.push(e));
    const newId = messages_1.IdGenerator.incrementing();
    const result = await (0, assemble_test_cases_1.assembleTestCases)(newId(), eventBroadcaster, newId, pickles.map((pickle) => ({
        gherkinDocument,
        pickle,
    })), supportCodeLibrary);
    return { envelopes, result };
}
(0, mocha_1.describe)('assembleTestCases', () => {
    let clock;
    (0, mocha_1.beforeEach)(() => {
        clock = fake_timers_1.default.withGlobal(time_1.default).install();
    });
    (0, mocha_1.afterEach)(() => {
        clock.uninstall();
    });
    (0, mocha_1.describe)('assembleTestCases()', () => {
        (0, mocha_1.it)('emits testCase messages', async () => {
            // Arrange
            const supportCodeLibrary = (0, runtime_helpers_1.buildSupportCodeLibrary)(({ Given }) => {
                Given('a step', function () {
                    clock.tick(1);
                });
            });
            const { gherkinDocument, pickles } = await (0, gherkin_helpers_1.parse)({
                data: [
                    'Feature: a',
                    'Scenario: b',
                    'Given a step',
                    'Scenario: c',
                    'Given a step',
                ].join('\n'),
                uri: 'a.feature',
            });
            // Act
            const { envelopes, result } = await testAssembleTestCases({
                gherkinDocument,
                pickles,
                supportCodeLibrary,
            });
            const testCase0 = {
                testRunStartedId: '0',
                id: '1',
                pickleId: pickles[0].id,
                testSteps: [
                    {
                        id: '2',
                        pickleStepId: pickles[0].steps[0].id,
                        stepDefinitionIds: [supportCodeLibrary.stepDefinitions[0].id],
                        stepMatchArgumentsLists: [
                            {
                                stepMatchArguments: [],
                            },
                        ],
                    },
                ],
            };
            const testCase1 = {
                testRunStartedId: '0',
                id: '3',
                pickleId: pickles[1].id,
                testSteps: [
                    {
                        id: '4',
                        pickleStepId: pickles[1].steps[0].id,
                        stepDefinitionIds: [supportCodeLibrary.stepDefinitions[0].id],
                        stepMatchArgumentsLists: [
                            {
                                stepMatchArguments: [],
                            },
                        ],
                    },
                ],
            };
            // Assert
            (0, chai_1.expect)(envelopes).to.eql([
                {
                    testCase: testCase0,
                },
                {
                    testCase: testCase1,
                },
            ]);
            (0, chai_1.expect)(result).to.eql([
                {
                    gherkinDocument,
                    pickle: pickles[0],
                    testCase: testCase0,
                },
                {
                    gherkinDocument,
                    pickle: pickles[1],
                    testCase: testCase1,
                },
            ]);
        });
        (0, mocha_1.describe)('with a parameterised step', () => {
            (0, mocha_1.it)('emits stepMatchArgumentLists correctly within the testCase message', async () => {
                // Arrange
                const supportCodeLibrary = (0, runtime_helpers_1.buildSupportCodeLibrary)(({ Given }) => {
                    Given('a step with {int} and {string} parameters', function () {
                        clock.tick(1);
                    });
                });
                const { gherkinDocument, pickles } = await (0, gherkin_helpers_1.parse)({
                    data: [
                        'Feature: a',
                        'Scenario: b',
                        'Given a step with 1 and "foo" parameters',
                    ].join('\n'),
                    uri: 'a.feature',
                });
                // Act
                const { envelopes } = await testAssembleTestCases({
                    gherkinDocument,
                    pickles,
                    supportCodeLibrary,
                });
                (0, chai_1.expect)(envelopes[0].testCase.testSteps[0].stepMatchArgumentsLists).to.deep.eq([
                    {
                        stepMatchArguments: [
                            {
                                group: {
                                    children: undefined,
                                    start: 12,
                                    value: '1',
                                },
                                parameterTypeName: 'int',
                            },
                            {
                                group: {
                                    children: [
                                        {
                                            children: [
                                                {
                                                    start: undefined,
                                                    value: undefined,
                                                    children: undefined,
                                                },
                                            ],
                                            start: 19,
                                            value: 'foo',
                                        },
                                        {
                                            start: undefined,
                                            value: undefined,
                                            children: [
                                                {
                                                    start: undefined,
                                                    value: undefined,
                                                    children: undefined,
                                                },
                                            ],
                                        },
                                    ],
                                    start: 18,
                                    value: '"foo"',
                                },
                                parameterTypeName: 'string',
                            },
                        ],
                    },
                ]);
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
                const { gherkinDocument, pickles } = await (0, gherkin_helpers_1.parse)({
                    data: ['Feature: a', 'Scenario: b', 'Given a step'].join('\n'),
                    uri: 'a.feature',
                });
                // Act
                const { envelopes } = await testAssembleTestCases({
                    gherkinDocument,
                    pickles,
                    supportCodeLibrary,
                });
                // Assert
                (0, chai_1.expect)(envelopes[0]).to.eql({
                    testCase: {
                        testRunStartedId: '0',
                        id: '1',
                        pickleId: pickles[0].id,
                        testSteps: [
                            {
                                id: '2',
                                hookId: supportCodeLibrary.beforeTestCaseHookDefinitions[0].id,
                            },
                            {
                                id: '3',
                                pickleStepId: pickles[0].steps[0].id,
                                stepDefinitionIds: [supportCodeLibrary.stepDefinitions[0].id],
                                stepMatchArgumentsLists: [
                                    {
                                        stepMatchArguments: [],
                                    },
                                ],
                            },
                            {
                                id: '4',
                                hookId: supportCodeLibrary.afterTestCaseHookDefinitions[0].id,
                            },
                        ],
                    },
                });
            });
        });
        (0, mocha_1.describe)('with step hooks', () => {
            (0, mocha_1.it)('emits the expected envelopes and returns a skipped result', async () => {
                // Arrange
                const supportCodeLibrary = (0, runtime_helpers_1.buildSupportCodeLibrary)(({ Given, BeforeStep, AfterStep }) => {
                    Given('a step', function () {
                        clock.tick(1);
                    });
                    BeforeStep(function () { });
                    AfterStep(function () { });
                });
                const { gherkinDocument, pickles } = await (0, gherkin_helpers_1.parse)({
                    data: ['Feature: a', 'Scenario: b', 'Given a step'].join('\n'),
                    uri: 'a.feature',
                });
                // Act
                const { envelopes } = await testAssembleTestCases({
                    gherkinDocument,
                    pickles,
                    supportCodeLibrary,
                });
                // Assert
                (0, chai_1.expect)(envelopes[0]).to.eql({
                    testCase: {
                        testRunStartedId: '0',
                        id: '1',
                        pickleId: pickles[0].id,
                        testSteps: [
                            {
                                id: '2',
                                pickleStepId: pickles[0].steps[0].id,
                                stepDefinitionIds: [supportCodeLibrary.stepDefinitions[0].id],
                                stepMatchArgumentsLists: [
                                    {
                                        stepMatchArguments: [],
                                    },
                                ],
                            },
                        ],
                    },
                });
            });
        });
    });
});
//# sourceMappingURL=assemble_test_cases_spec.js.map