"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const fake_timers_1 = __importDefault(require("@sinonjs/fake-timers"));
const formatter_helpers_1 = require("../../test/formatter_helpers");
const json_formatter_steps_1 = require("../../test/fixtures/json_formatter_steps");
const time_1 = __importDefault(require("../time"));
(0, mocha_1.describe)('JsonFormatter', () => {
    let clock;
    (0, mocha_1.beforeEach)(() => {
        clock = fake_timers_1.default.withGlobal(time_1.default).install();
    });
    (0, mocha_1.afterEach)(() => {
        clock.uninstall();
    });
    (0, mocha_1.describe)('no features', () => {
        (0, mocha_1.it)('outputs an empty array', async () => {
            // Arrange
            // Act
            const output = await (0, formatter_helpers_1.testFormatter)({ type: 'json' });
            // Assert
            (0, chai_1.expect)(JSON.parse(output)).to.eql([]);
        });
    });
    (0, mocha_1.describe)('one scenario with one step', () => {
        (0, mocha_1.describe)('passed', () => {
            (0, mocha_1.it)('outputs the feature', async () => {
                // Arrange
                const sources = [
                    {
                        data: [
                            '@tag1 @tag2',
                            'Feature: my feature',
                            '  my feature description',
                            '',
                            '  Scenario: my scenario',
                            '    my scenario description',
                            '',
                            '    Given a passing step',
                        ].join('\n'),
                        uri: 'a.feature',
                    },
                ];
                const supportCodeLibrary = (0, json_formatter_steps_1.getJsonFormatterSupportCodeLibrary)(clock);
                // Act
                const output = await (0, formatter_helpers_1.testFormatter)({
                    sources,
                    supportCodeLibrary,
                    type: 'json',
                });
                // Assert
                (0, chai_1.expect)(JSON.parse(output)).to.eql([
                    {
                        description: '  my feature description',
                        elements: [
                            {
                                description: '    my scenario description',
                                id: 'my-feature;my-scenario',
                                keyword: 'Scenario',
                                line: 5,
                                name: 'my scenario',
                                type: 'scenario',
                                steps: [
                                    {
                                        arguments: [],
                                        line: 8,
                                        match: {
                                            location: 'json_formatter_steps.ts:12',
                                        },
                                        keyword: 'Given ',
                                        name: 'a passing step',
                                        result: {
                                            status: 'passed',
                                            duration: 1000000,
                                        },
                                    },
                                ],
                                tags: [
                                    { name: '@tag1', line: 1 },
                                    { name: '@tag2', line: 1 },
                                ],
                            },
                        ],
                        id: 'my-feature',
                        keyword: 'Feature',
                        line: 2,
                        name: 'my feature',
                        tags: [
                            { name: '@tag1', line: 1 },
                            { name: '@tag2', line: 1 },
                        ],
                        uri: 'a.feature',
                    },
                ]);
            });
        });
        (0, mocha_1.describe)('retried', () => {
            (0, mocha_1.it)('only outputs the last attempt', async () => {
                // Arrange
                const sources = [
                    {
                        data: [
                            'Feature: my feature',
                            '  Scenario: my scenario',
                            '    Given a flaky step',
                        ].join('\n'),
                        uri: 'a.feature',
                    },
                ];
                const supportCodeLibrary = (0, json_formatter_steps_1.getJsonFormatterSupportCodeLibrary)(clock);
                // Act
                const output = await (0, formatter_helpers_1.testFormatter)({
                    runtimeOptions: { retry: 1 },
                    sources,
                    supportCodeLibrary,
                    type: 'json',
                });
                // Assert
                const result = JSON.parse(output);
                (0, chai_1.expect)(result).to.have.lengthOf(1);
                (0, chai_1.expect)(result[0].elements).to.have.lengthOf(1);
                (0, chai_1.expect)(result[0].elements[0].steps).to.have.lengthOf(1);
                (0, chai_1.expect)(result[0].elements[0].steps[0].result).to.eql({
                    duration: 0,
                    status: 'passed',
                });
            });
        });
        (0, mocha_1.describe)('failed', () => {
            (0, mocha_1.it)('includes the error message', async () => {
                // Arrange
                const sources = [
                    {
                        data: [
                            'Feature: my feature',
                            '  Scenario: my scenario',
                            '    Given a failing step',
                        ].join('\n'),
                        uri: 'a.feature',
                    },
                ];
                const supportCodeLibrary = (0, json_formatter_steps_1.getJsonFormatterSupportCodeLibrary)(clock);
                // Act
                const output = await (0, formatter_helpers_1.testFormatter)({
                    sources,
                    supportCodeLibrary,
                    type: 'json',
                });
                // Assert
                const step = JSON.parse(output)[0].elements[0].steps[0];
                (0, chai_1.expect)(step.result).to.eql({
                    duration: 0,
                    error_message: 'Error: error',
                    status: 'failed',
                });
            });
        });
        (0, mocha_1.describe)('without a step definition', () => {
            (0, mocha_1.it)('does not output a match attribute for the step', async () => {
                // Arrange
                const sources = [
                    {
                        data: [
                            'Feature: my feature',
                            '  Scenario: my scenario',
                            '    Given a passing step',
                        ].join('\n'),
                        uri: 'a.feature',
                    },
                ];
                // Act
                const output = await (0, formatter_helpers_1.testFormatter)({
                    sources,
                    type: 'json',
                });
                // Assert
                const step = JSON.parse(output)[0].elements[0].steps[0];
                (0, chai_1.expect)(step).to.not.have.key('match');
            });
        });
        (0, mocha_1.describe)('with hooks', () => {
            (0, mocha_1.it)('outputs the hooks with special properties', async () => {
                // Arrange
                const sources = [
                    {
                        data: [
                            'Feature: my feature',
                            '  Scenario: my scenario',
                            '    Given a passing step',
                        ].join('\n'),
                        uri: 'a.feature',
                    },
                ];
                const supportCodeLibrary = (0, json_formatter_steps_1.getJsonFormatterSupportCodeLibraryWithHooks)();
                // Act
                const output = await (0, formatter_helpers_1.testFormatter)({
                    sources,
                    supportCodeLibrary,
                    type: 'json',
                });
                // Assert
                const steps = JSON.parse(output)[0].elements[0].steps;
                const expectedBefore = {
                    hidden: true,
                    keyword: 'Before',
                    result: {
                        duration: 0,
                        status: 'passed',
                    },
                };
                const expectedAfter = {
                    hidden: true,
                    keyword: 'After',
                    result: {
                        duration: 0,
                        status: 'passed',
                    },
                };
                const expectedStep = {
                    arguments: [],
                    keyword: 'Given ',
                    line: 3,
                    match: {
                        location: 'json_formatter_steps.ts:56',
                    },
                    name: 'a passing step',
                    result: {
                        duration: 0,
                        status: 'passed',
                    },
                };
                (0, chai_1.expect)(steps).to.eql([expectedBefore, expectedStep, expectedAfter]);
            });
        });
        (0, mocha_1.describe)('with attachments (buffer)', () => {
            (0, mocha_1.it)('outputs the step with embeddings (preserving base64 encoding)', async function () {
                // Arrange
                const sources = [
                    {
                        data: [
                            'Feature: my feature',
                            '  Scenario: my scenario',
                            '    Given a step that attaches buffer (image/png)',
                        ].join('\n'),
                        uri: 'a.feature',
                    },
                ];
                const supportCodeLibrary = (0, json_formatter_steps_1.getJsonFormatterSupportCodeLibrary)(clock);
                // Act
                const output = await (0, formatter_helpers_1.testFormatter)({
                    sources,
                    supportCodeLibrary,
                    type: 'json',
                });
                const steps = JSON.parse(output)[0].elements[0].steps;
                (0, chai_1.expect)(steps[0].embeddings).to.deep.eq([
                    {
                        data: 'iVBORw==',
                        mime_type: 'image/png',
                    },
                ]);
            });
        });
        (0, mocha_1.describe)('with attachments (bas64-encoded string)', () => {
            (0, mocha_1.it)('outputs the step with embeddings (preserving base64 encoding)i', async function () {
                // Arrange
                const sources = [
                    {
                        data: [
                            'Feature: my feature',
                            '  Scenario: my scenario',
                            '    Given a step that attaches base64-encoded string',
                        ].join('\n'),
                        uri: 'a.feature',
                    },
                ];
                const supportCodeLibrary = (0, json_formatter_steps_1.getJsonFormatterSupportCodeLibrary)(clock);
                // Act
                const output = await (0, formatter_helpers_1.testFormatter)({
                    sources,
                    supportCodeLibrary,
                    type: 'json',
                });
                const steps = JSON.parse(output)[0].elements[0].steps;
                (0, chai_1.expect)(steps[0].embeddings).to.deep.eq([
                    {
                        data: 'Zm9v',
                        mime_type: 'text/plain',
                    },
                ]);
            });
        });
        (0, mocha_1.describe)('with attachments (string literal)', () => {
            (0, mocha_1.it)('outputs the step with embeddings (base64-encoded)', async function () {
                // Arrange
                const sources = [
                    {
                        data: [
                            'Feature: my feature',
                            '  Scenario: my scenario',
                            '    Given a step that attaches string literal',
                        ].join('\n'),
                        uri: 'a.feature',
                    },
                ];
                const supportCodeLibrary = (0, json_formatter_steps_1.getJsonFormatterSupportCodeLibrary)(clock);
                // Act
                const output = await (0, formatter_helpers_1.testFormatter)({
                    sources,
                    supportCodeLibrary,
                    type: 'json',
                });
                const steps = JSON.parse(output)[0].elements[0].steps;
                (0, chai_1.expect)(steps[0].embeddings).to.deep.eq([
                    {
                        data: 'Zm9v',
                        mime_type: 'text/plain',
                    },
                ]);
            });
        });
        (0, mocha_1.describe)('with a doc string', () => {
            (0, mocha_1.it)('outputs the doc string as a step argument', async () => {
                // Arrange
                const sources = [
                    {
                        data: [
                            'Feature: my feature',
                            '  Scenario: my scenario',
                            '    Given a step',
                            '      """',
                            '      This is a DocString',
                            '      """',
                        ].join('\n'),
                        uri: 'a.feature',
                    },
                ];
                const supportCodeLibrary = (0, json_formatter_steps_1.getJsonFormatterSupportCodeLibrary)(clock);
                // Act
                const output = await (0, formatter_helpers_1.testFormatter)({
                    sources,
                    supportCodeLibrary,
                    type: 'json',
                });
                // Assert
                const stepArguments = JSON.parse(output)[0].elements[0].steps[0].arguments;
                (0, chai_1.expect)(stepArguments).to.eql([
                    {
                        content: 'This is a DocString',
                        line: 4,
                    },
                ]);
            });
        });
        (0, mocha_1.describe)(' with a data table string', () => {
            (0, mocha_1.it)('outputs the data table as a step argument', async () => {
                // Arrange
                const sources = [
                    {
                        data: [
                            'Feature: my feature',
                            '  Scenario: my scenario',
                            '    Given a step',
                            '      |aaa|b|c|',
                            '      |d|e|ff|',
                            '      |gg|h|iii|',
                        ].join('\n'),
                        uri: 'a.feature',
                    },
                ];
                const supportCodeLibrary = (0, json_formatter_steps_1.getJsonFormatterSupportCodeLibrary)(clock);
                // Act
                const output = await (0, formatter_helpers_1.testFormatter)({
                    sources,
                    supportCodeLibrary,
                    type: 'json',
                });
                // Assert
                const stepArguments = JSON.parse(output)[0].elements[0].steps[0].arguments;
                (0, chai_1.expect)(stepArguments).to.eql([
                    {
                        rows: [
                            { cells: ['aaa', 'b', 'c'] },
                            { cells: ['d', 'e', 'ff'] },
                            { cells: ['gg', 'h', 'iii'] },
                        ],
                    },
                ]);
            });
        });
        (0, mocha_1.describe)(' with tagged examples', () => {
            (0, mocha_1.it)('outputs the examples', async () => {
                // Arrange
                const sources = [
                    {
                        data: [
                            'Feature: my feature',
                            '  Scenario: my scenario',
                            '    Given a step <id>',
                            '',
                            '    @tag-1-2',
                            '    Examples:',
                            '      |id|',
                            '      | 1|',
                            '      | 2|',
                            '',
                            '    @tag @tag-3-4',
                            '    Examples:',
                            '      |id|',
                            '      | 3|',
                            '      | 4|',
                        ].join('\n'),
                        uri: 'a.feature',
                    },
                ];
                const supportCodeLibrary = (0, json_formatter_steps_1.getJsonFormatterSupportCodeLibrary)(clock);
                // Act
                const output = await (0, formatter_helpers_1.testFormatter)({
                    sources,
                    supportCodeLibrary,
                    type: 'json',
                });
                // Assert
                const jsonFeature = JSON.parse(output)[0];
                const jsonScenarios = jsonFeature.elements;
                const jsonScenarioTags = jsonScenarios.map((s) => s.tags);
                const expectedTags = [
                    [{ line: 5, name: '@tag-1-2' }],
                    [{ line: 5, name: '@tag-1-2' }],
                    [
                        { line: 11, name: '@tag' },
                        { line: 11, name: '@tag-3-4' },
                    ],
                    [
                        { line: 11, name: '@tag' },
                        { line: 11, name: '@tag-3-4' },
                    ],
                ];
                (0, chai_1.expect)(jsonScenarioTags).to.eql(expectedTags);
            });
        });
    });
    (0, mocha_1.describe)('one rule with several examples (scenarios)', () => {
        (0, mocha_1.describe)('passed', () => {
            (0, mocha_1.it)('outputs the feature', async () => {
                // Arrange
                const sources = [
                    {
                        data: [
                            '@tag1 @tag2',
                            'Feature: my feature',
                            '  my feature description',
                            '',
                            '  Rule: my rule',
                            '    my rule description',
                            '',
                            '    Example: first example',
                            '      first example description',
                            '',
                            '      Given a passing step',
                            '',
                            '    Example: second example',
                            '      second example description',
                            '',
                            '      Given a passing step',
                        ].join('\n'),
                        uri: 'a.feature',
                    },
                ];
                const supportCodeLibrary = (0, json_formatter_steps_1.getJsonFormatterSupportCodeLibrary)(clock);
                // Act
                const output = await (0, formatter_helpers_1.testFormatter)({
                    sources,
                    supportCodeLibrary,
                    type: 'json',
                });
                // Assert
                (0, chai_1.expect)(JSON.parse(output)).to.eql([
                    {
                        description: '  my feature description',
                        elements: [
                            {
                                description: '      first example description',
                                id: 'my-feature;my-rule;first-example',
                                keyword: 'Example',
                                line: 8,
                                name: 'first example',
                                type: 'scenario',
                                steps: [
                                    {
                                        arguments: [],
                                        line: 11,
                                        match: {
                                            location: 'json_formatter_steps.ts:12',
                                        },
                                        keyword: 'Given ',
                                        name: 'a passing step',
                                        result: {
                                            status: 'passed',
                                            duration: 1000000,
                                        },
                                    },
                                ],
                                tags: [
                                    { name: '@tag1', line: 1 },
                                    { name: '@tag2', line: 1 },
                                ],
                            },
                            {
                                description: '      second example description',
                                id: 'my-feature;my-rule;second-example',
                                keyword: 'Example',
                                line: 13,
                                name: 'second example',
                                type: 'scenario',
                                steps: [
                                    {
                                        arguments: [],
                                        line: 16,
                                        match: {
                                            location: 'json_formatter_steps.ts:12',
                                        },
                                        keyword: 'Given ',
                                        name: 'a passing step',
                                        result: {
                                            status: 'passed',
                                            duration: 1000000,
                                        },
                                    },
                                ],
                                tags: [
                                    { name: '@tag1', line: 1 },
                                    { name: '@tag2', line: 1 },
                                ],
                            },
                        ],
                        id: 'my-feature',
                        keyword: 'Feature',
                        line: 2,
                        name: 'my feature',
                        tags: [
                            { name: '@tag1', line: 1 },
                            { name: '@tag2', line: 1 },
                        ],
                        uri: 'a.feature',
                    },
                ]);
            });
        });
    });
});
//# sourceMappingURL=json_formatter_spec.js.map