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
const messages = __importStar(require("@cucumber/messages"));
const messages_1 = require("@cucumber/messages");
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const cucumber_expressions_1 = require("@cucumber/cucumber-expressions");
const step_definition_1 = __importDefault(require("../models/step_definition"));
const test_case_hook_definition_1 = __importDefault(require("../models/test_case_hook_definition"));
const test_run_hook_definition_1 = __importDefault(require("../models/test_run_hook_definition"));
const sourced_parameter_type_registry_1 = require("../support_code_library_builder/sourced_parameter_type_registry");
const emit_support_code_messages_1 = require("./emit_support_code_messages");
const noopFunction = () => {
    // no code
};
function testEmitSupportCodeMessages(supportCode) {
    const envelopes = [];
    const eventBroadcaster = new node_events_1.EventEmitter();
    eventBroadcaster.on('envelope', (e) => envelopes.push(e));
    (0, emit_support_code_messages_1.emitSupportCodeMessages)({
        eventBroadcaster,
        supportCodeLibrary: Object.assign({
            originalCoordinates: {
                requireModules: [],
                requirePaths: [],
                importPaths: [],
            },
            stepDefinitions: [],
            beforeTestRunHookDefinitions: [],
            beforeTestCaseHookDefinitions: [],
            beforeTestStepHookDefinitions: [],
            afterTestRunHookDefinitions: [],
            afterTestCaseHookDefinitions: [],
            afterTestStepHookDefinitions: [],
            defaultTimeout: 0,
            parameterTypeRegistry: new sourced_parameter_type_registry_1.SourcedParameterTypeRegistry(),
            undefinedParameterTypes: [],
            World: null,
            parallelCanAssign: () => true,
        }, supportCode),
        newId: messages_1.IdGenerator.incrementing(),
    });
    return envelopes;
}
(0, mocha_1.describe)('emit_support_code_messages', () => {
    (0, mocha_1.describe)('emitMetaMessage', () => {
        (0, mocha_1.it)('emits a meta message', async () => {
            const envelopes = [];
            const eventBroadcaster = new node_events_1.EventEmitter();
            eventBroadcaster.on('envelope', (e) => envelopes.push(e));
            await (0, emit_support_code_messages_1.emitMetaMessage)(eventBroadcaster, {});
            (0, chai_1.expect)(envelopes).to.have.length(1);
            (0, chai_1.expect)(envelopes[0].meta.implementation.name).to.eq('cucumber-js');
        });
    });
    (0, mocha_1.describe)('emitSupportCodeMessages', () => {
        (0, mocha_1.it)('emits messages for parameter types', () => {
            const parameterTypeRegistry = new sourced_parameter_type_registry_1.SourcedParameterTypeRegistry();
            parameterTypeRegistry.defineSourcedParameterType(new cucumber_expressions_1.ParameterType('flight', ['([A-Z]{3})-([A-Z]{3})'], null, () => 'argh', true, false), {
                line: 4,
                uri: 'features/support/parameter-types.js',
            }, 0);
            const envelopes = testEmitSupportCodeMessages({
                parameterTypeRegistry,
            });
            const expectedEnvelopes = [
                {
                    parameterType: {
                        id: '0',
                        name: 'flight',
                        preferForRegularExpressionMatch: false,
                        regularExpressions: ['([A-Z]{3})-([A-Z]{3})'],
                        useForSnippets: true,
                        sourceReference: {
                            uri: 'features/support/parameter-types.js',
                            location: {
                                line: 4,
                            },
                        },
                    },
                },
            ];
            (0, chai_1.expect)(envelopes).to.deep.eq(expectedEnvelopes);
        });
        (0, mocha_1.it)('emits messages for step definitions using cucumber expressions', () => {
            const envelopes = testEmitSupportCodeMessages({
                stepDefinitions: [
                    new step_definition_1.default({
                        code: noopFunction,
                        unwrappedCode: noopFunction,
                        id: '0',
                        line: 9,
                        options: {},
                        order: 0,
                        uri: 'features/support/cukes.js',
                        keyword: 'Given',
                        pattern: 'I have {int} cukes in my belly',
                        expression: new cucumber_expressions_1.CucumberExpression('I have {int} cukes in my belly', new sourced_parameter_type_registry_1.SourcedParameterTypeRegistry()),
                    }),
                ],
            });
            const expectedEnvelopes = [
                {
                    stepDefinition: {
                        id: '0',
                        pattern: {
                            source: 'I have {int} cukes in my belly',
                            type: messages.StepDefinitionPatternType.CUCUMBER_EXPRESSION,
                        },
                        sourceReference: {
                            uri: 'features/support/cukes.js',
                            location: {
                                line: 9,
                            },
                        },
                    },
                },
            ];
            (0, chai_1.expect)(envelopes).to.deep.eq(expectedEnvelopes);
        });
        (0, mocha_1.it)('emits messages for step definitions using regular expressions', () => {
            const envelopes = testEmitSupportCodeMessages({
                stepDefinitions: [
                    new step_definition_1.default({
                        code: noopFunction,
                        unwrappedCode: noopFunction,
                        id: '0',
                        line: 9,
                        options: {},
                        order: 0,
                        uri: 'features/support/cukes.js',
                        keyword: 'Given',
                        pattern: /I have (\d+) cukes in my belly/,
                        expression: new cucumber_expressions_1.RegularExpression(/I have (\d+) cukes in my belly/, new sourced_parameter_type_registry_1.SourcedParameterTypeRegistry()),
                    }),
                ],
            });
            const expectedEnvelopes = [
                {
                    stepDefinition: {
                        id: '0',
                        pattern: {
                            source: 'I have (\\d+) cukes in my belly',
                            type: messages.StepDefinitionPatternType.REGULAR_EXPRESSION,
                        },
                        sourceReference: {
                            uri: 'features/support/cukes.js',
                            location: {
                                line: 9,
                            },
                        },
                    },
                },
            ];
            (0, chai_1.expect)(envelopes).to.deep.eq(expectedEnvelopes);
        });
        (0, mocha_1.it)('emits messages for test case level hooks', () => {
            const envelopes = testEmitSupportCodeMessages({
                beforeTestCaseHookDefinitions: [
                    new test_case_hook_definition_1.default({
                        code: noopFunction,
                        unwrappedCode: noopFunction,
                        id: '0',
                        line: 3,
                        options: {
                            name: 'before hook',
                            tags: '@hooks-tho',
                        },
                        order: 0,
                        uri: 'features/support/hooks.js',
                    }),
                ],
                afterTestCaseHookDefinitions: [
                    new test_case_hook_definition_1.default({
                        code: noopFunction,
                        unwrappedCode: noopFunction,
                        id: '1',
                        line: 7,
                        options: {
                            name: 'after hook',
                        },
                        order: 1,
                        uri: 'features/support/hooks.js',
                    }),
                    new test_case_hook_definition_1.default({
                        code: noopFunction,
                        unwrappedCode: noopFunction,
                        id: '2',
                        line: 11,
                        options: {},
                        order: 2,
                        uri: 'features/support/hooks.js',
                    }),
                ],
            });
            const expectedEnvelopes = [
                {
                    hook: {
                        id: '0',
                        type: messages_1.HookType.BEFORE_TEST_CASE,
                        name: 'before hook',
                        tagExpression: '@hooks-tho',
                        sourceReference: {
                            uri: 'features/support/hooks.js',
                            location: {
                                line: 3,
                            },
                        },
                    },
                },
                {
                    hook: {
                        id: '1',
                        type: messages_1.HookType.AFTER_TEST_CASE,
                        name: 'after hook',
                        tagExpression: undefined,
                        sourceReference: {
                            uri: 'features/support/hooks.js',
                            location: {
                                line: 7,
                            },
                        },
                    },
                },
                {
                    hook: {
                        id: '2',
                        type: messages_1.HookType.AFTER_TEST_CASE,
                        name: undefined,
                        tagExpression: undefined,
                        sourceReference: {
                            uri: 'features/support/hooks.js',
                            location: {
                                line: 11,
                            },
                        },
                    },
                },
            ];
            (0, chai_1.expect)(envelopes).to.deep.eq(expectedEnvelopes);
        });
        (0, mocha_1.it)('emits messages for test run level hooks', () => {
            const envelopes = testEmitSupportCodeMessages({
                beforeTestRunHookDefinitions: [
                    new test_run_hook_definition_1.default({
                        code: noopFunction,
                        unwrappedCode: noopFunction,
                        id: '0',
                        line: 3,
                        options: {},
                        order: 0,
                        uri: 'features/support/run-hooks.js',
                    }),
                ],
                afterTestRunHookDefinitions: [
                    new test_run_hook_definition_1.default({
                        code: noopFunction,
                        unwrappedCode: noopFunction,
                        id: '1',
                        line: 7,
                        options: {
                            name: 'special cleanup thing',
                        },
                        order: 1,
                        uri: 'features/support/run-hooks.js',
                    }),
                    new test_run_hook_definition_1.default({
                        code: noopFunction,
                        unwrappedCode: noopFunction,
                        id: '2',
                        line: 11,
                        options: {},
                        order: 2,
                        uri: 'features/support/run-hooks.js',
                    }),
                ],
            });
            const expectedEnvelopes = [
                {
                    hook: {
                        id: '0',
                        type: messages_1.HookType.BEFORE_TEST_RUN,
                        name: undefined,
                        sourceReference: {
                            uri: 'features/support/run-hooks.js',
                            location: {
                                line: 3,
                            },
                        },
                    },
                },
                {
                    hook: {
                        id: '1',
                        type: messages_1.HookType.AFTER_TEST_RUN,
                        name: 'special cleanup thing',
                        sourceReference: {
                            uri: 'features/support/run-hooks.js',
                            location: {
                                line: 7,
                            },
                        },
                    },
                },
                {
                    hook: {
                        id: '2',
                        type: messages_1.HookType.AFTER_TEST_RUN,
                        name: undefined,
                        sourceReference: {
                            uri: 'features/support/run-hooks.js',
                            location: {
                                line: 11,
                            },
                        },
                    },
                },
            ];
            (0, chai_1.expect)(envelopes).to.deep.eq(expectedEnvelopes);
        });
    });
});
//# sourceMappingURL=emit_support_code_messages_spec.js.map