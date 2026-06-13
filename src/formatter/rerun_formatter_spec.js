"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const runtime_helpers_1 = require("../../test/runtime_helpers");
const formatter_helpers_1 = require("../../test/formatter_helpers");
const onePickleSources = [
    {
        data: 'Feature: a\nScenario: b\nGiven a step',
        uri: 'a.feature',
    },
];
(0, mocha_1.describe)('RerunFormatter', () => {
    (0, mocha_1.describe)('with no scenarios', () => {
        (0, mocha_1.it)('outputs nothing', async () => {
            // Arrange
            // Act
            const output = await (0, formatter_helpers_1.testFormatter)({ type: 'rerun' });
            // Assert
            (0, chai_1.expect)(output).to.eql('');
        });
    });
    (0, mocha_1.describe)('with one scenario', () => {
        (0, mocha_1.describe)('passed', () => {
            (0, mocha_1.it)('outputs nothing', async () => {
                // Arrange
                const supportCodeLibrary = (0, runtime_helpers_1.buildSupportCodeLibrary)(({ Given }) => {
                    Given('a step', function () { });
                });
                // Act
                const output = await (0, formatter_helpers_1.testFormatter)({
                    sources: onePickleSources,
                    supportCodeLibrary,
                    type: 'rerun',
                });
                // Assert
                (0, chai_1.expect)(output).to.eql('');
            });
        });
        (0, mocha_1.describe)('ambiguous', () => {
            (0, mocha_1.it)('outputs the reference needed to run the scenario again', async () => {
                // Arrange
                const supportCodeLibrary = (0, runtime_helpers_1.buildSupportCodeLibrary)(({ Given }) => {
                    Given('a step', function () { });
                    Given('a step', function () { });
                });
                // Act
                const output = await (0, formatter_helpers_1.testFormatter)({
                    sources: onePickleSources,
                    supportCodeLibrary,
                    type: 'rerun',
                });
                // Assert
                (0, chai_1.expect)(output).to.eql('a.feature:2');
            });
        });
        (0, mocha_1.describe)('failed', () => {
            (0, mocha_1.it)('outputs the reference needed to run the scenario again', async () => {
                // Arrange
                const supportCodeLibrary = (0, runtime_helpers_1.buildSupportCodeLibrary)(({ Given }) => {
                    Given('a step', function () {
                        throw new Error('error');
                    });
                });
                // Act
                const output = await (0, formatter_helpers_1.testFormatter)({
                    sources: onePickleSources,
                    supportCodeLibrary,
                    type: 'rerun',
                });
                // Assert
                (0, chai_1.expect)(output).to.eql('a.feature:2');
            });
        });
        (0, mocha_1.describe)('pending', () => {
            (0, mocha_1.it)('outputs the reference needed to run the scenario again', async () => {
                // Arrange
                const supportCodeLibrary = (0, runtime_helpers_1.buildSupportCodeLibrary)(({ Given }) => {
                    Given('a step', function () {
                        return 'pending';
                    });
                });
                // Act
                const output = await (0, formatter_helpers_1.testFormatter)({
                    sources: onePickleSources,
                    supportCodeLibrary,
                    type: 'rerun',
                });
                // Assert
                (0, chai_1.expect)(output).to.eql('a.feature:2');
            });
        });
        (0, mocha_1.describe)('skipped', () => {
            (0, mocha_1.it)('outputs the reference needed to run the scenario again', async () => {
                // Arrange
                const supportCodeLibrary = (0, runtime_helpers_1.buildSupportCodeLibrary)(({ Given }) => {
                    Given('a step', function () {
                        return 'skipped';
                    });
                });
                // Act
                const output = await (0, formatter_helpers_1.testFormatter)({
                    sources: onePickleSources,
                    supportCodeLibrary,
                    type: 'rerun',
                });
                // Assert
                (0, chai_1.expect)(output).to.eql('a.feature:2');
            });
        });
        (0, mocha_1.describe)('undefined', () => {
            (0, mocha_1.it)('outputs the reference needed to run the scenario again', async () => {
                // Arrange
                // Act
                const output = await (0, formatter_helpers_1.testFormatter)({
                    sources: onePickleSources,
                    type: 'rerun',
                });
                // Assert
                (0, chai_1.expect)(output).to.eql('a.feature:2');
            });
        });
    });
    (0, mocha_1.describe)('with two failing scenarios in the same file', () => {
        (0, mocha_1.it)('outputs the reference needed to run the scenario again', async () => {
            // Arrange
            const sources = [
                {
                    data: 'Feature: a\nScenario: b\nGiven a step\nScenario: c\nGiven a step',
                    uri: 'a.feature',
                },
            ];
            // Act
            const output = await (0, formatter_helpers_1.testFormatter)({ sources, type: 'rerun' });
            // Assert
            (0, chai_1.expect)(output).to.eql('a.feature:2:4');
        });
    });
    (0, mocha_1.describe)('with two failing scenarios in different files', () => {
        const examples = [
            { separator: { opt: undefined, expected: '\n' }, label: 'default' },
            { separator: { opt: '\n', expected: '\n' }, label: 'newline' },
            { separator: { opt: ' ', expected: ' ' }, label: 'space' },
        ];
        examples.forEach(({ separator, label }) => {
            (0, mocha_1.describe)(`using ${label} separator`, () => {
                (0, mocha_1.it)('outputs the reference needed to run the scenario again', async () => {
                    // Arrange
                    const parsedArgvOptions = { rerun: { separator: separator.opt } };
                    const sources = [
                        {
                            data: 'Feature: a\nScenario: b\nGiven a step',
                            uri: 'a.feature',
                        },
                        {
                            data: 'Feature: a\n\nScenario: b\nGiven a step',
                            uri: 'b.feature',
                        },
                    ];
                    // Act
                    const output = await (0, formatter_helpers_1.testFormatter)({
                        parsedArgvOptions,
                        sources,
                        type: 'rerun',
                    });
                    // Assert
                    (0, chai_1.expect)(output).to.eql(`a.feature:2${separator.expected}b.feature:3`);
                });
                (0, mocha_1.it)('outputs the reference needed to run the rule example again', async () => {
                    // Arrange
                    const parsedArgvOptions = { rerun: { separator: separator.opt } };
                    const sources = [
                        {
                            data: 'Feature: a\nRule: b\nExample: c\nGiven a step',
                            uri: 'a.feature',
                        },
                        {
                            data: 'Feature: a\n\nRule: b\nExample: c\nGiven a step',
                            uri: 'b.feature',
                        },
                    ];
                    // Act
                    const output = await (0, formatter_helpers_1.testFormatter)({
                        parsedArgvOptions,
                        sources,
                        type: 'rerun',
                    });
                    // Assert
                    (0, chai_1.expect)(output).to.eql(`a.feature:3${separator.expected}b.feature:4`);
                });
            });
        });
    });
});
//# sourceMappingURL=rerun_formatter_spec.js.map