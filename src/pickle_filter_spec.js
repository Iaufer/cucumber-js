"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const gherkin_helpers_1 = require("../test/gherkin_helpers");
const pickle_filter_1 = __importDefault(require("./pickle_filter"));
(0, mocha_1.describe)('PickleFilter', () => {
    const cwd = '/project';
    let pickleFilter;
    (0, mocha_1.describe)('matches', () => {
        (0, mocha_1.describe)('no filters', () => {
            (0, mocha_1.beforeEach)(function () {
                pickleFilter = new pickle_filter_1.default({
                    cwd,
                    featurePaths: ['features'],
                    names: [],
                    tagExpression: '',
                });
            });
            (0, mocha_1.it)('returns true', async function () {
                // Arrange
                const { pickles: [pickle], gherkinDocument, } = await (0, gherkin_helpers_1.parse)({
                    data: ['Feature: a', 'Scenario: b', 'Given a step'].join('\n'),
                    uri: 'features/a.feature',
                });
                // Act
                const result = pickleFilter.matches({ pickle, gherkinDocument });
                // Assert
                (0, chai_1.expect)(result).to.eql(true);
            });
        });
        (0, mocha_1.describe)('line filters', () => {
            const variants = [
                {
                    name: 'with relative paths',
                    featurePaths: ['features/a.feature', 'features/b.feature:2:4'],
                },
                {
                    name: 'with absolute paths',
                    featurePaths: [
                        node_path_1.default.join(cwd, 'features/a.feature'),
                        node_path_1.default.join(cwd, 'features/b.feature:2:4'),
                    ],
                },
            ];
            variants.forEach(({ name, featurePaths }) => {
                (0, mocha_1.describe)(name, () => {
                    (0, mocha_1.beforeEach)(function () {
                        pickleFilter = new pickle_filter_1.default({
                            cwd,
                            featurePaths,
                            names: [],
                            tagExpression: '',
                        });
                    });
                    (0, mocha_1.describe)('pickle in feature without line specified', () => {
                        (0, mocha_1.it)('returns true', async function () {
                            // Arrange
                            const { pickles: [pickle], gherkinDocument, } = await (0, gherkin_helpers_1.parse)({
                                data: ['Feature: a', 'Scenario: b', 'Given a step'].join('\n'),
                                uri: 'features/a.feature',
                            });
                            // Act
                            const result = pickleFilter.matches({ pickle, gherkinDocument });
                            // Assert
                            (0, chai_1.expect)(result).to.eql(true);
                        });
                    });
                    (0, mocha_1.describe)('pickle in feature with line specified', () => {
                        (0, mocha_1.it)('returns true if pickle line matches', async function () {
                            // Arrange
                            const { pickles: [pickle], gherkinDocument, } = await (0, gherkin_helpers_1.parse)({
                                data: ['Feature: a', 'Scenario: b', 'Given a step'].join('\n'),
                                uri: 'features/b.feature',
                            });
                            // Act
                            const result = pickleFilter.matches({ pickle, gherkinDocument });
                            // Assert
                            (0, chai_1.expect)(result).to.eql(true);
                        });
                        (0, mocha_1.it)('returns false if pickle line does not match', async function () {
                            // Arrange
                            const { pickles: [pickle], gherkinDocument, } = await (0, gherkin_helpers_1.parse)({
                                data: ['Feature: a', '', 'Scenario: b', 'Given a step'].join('\n'),
                                uri: 'features/b.feature',
                            });
                            // Act
                            const result = pickleFilter.matches({ pickle, gherkinDocument });
                            // Assert
                            (0, chai_1.expect)(result).to.eql(false);
                        });
                    });
                });
            });
        });
        (0, mocha_1.describe)('name filters', () => {
            (0, mocha_1.describe)('should match name A', () => {
                (0, mocha_1.beforeEach)(function () {
                    pickleFilter = new pickle_filter_1.default({
                        cwd,
                        featurePaths: ['features'],
                        names: ['nameA'],
                        tagExpression: '',
                    });
                });
                (0, mocha_1.it)('returns true if pickle name matches from scenario', async function () {
                    // Arrange
                    const { pickles: [pickle], gherkinDocument, } = await (0, gherkin_helpers_1.parse)({
                        data: [
                            'Feature: a',
                            'Scenario: nameA descriptionA',
                            'Given a step',
                        ].join('\n'),
                        uri: 'features/a.feature',
                    });
                    // Act
                    const result = pickleFilter.matches({ pickle, gherkinDocument });
                    // Assert
                    (0, chai_1.expect)(result).to.eql(true);
                });
                (0, mocha_1.it)('returns true if pickle name matches from rule -> example', async function () {
                    // Arrange
                    const { pickles: [pickle], gherkinDocument, } = await (0, gherkin_helpers_1.parse)({
                        data: [
                            'Feature: a',
                            'Rule: nameR descriptionR',
                            'Example: nameA descriptionA',
                            'Given a step',
                        ].join('\n'),
                        uri: 'features/a.feature',
                    });
                    // Act
                    const result = pickleFilter.matches({ pickle, gherkinDocument });
                    // Assert
                    (0, chai_1.expect)(result).to.eql(true);
                });
                (0, mocha_1.it)('returns false if pickle name does not match', async function () {
                    // Arrange
                    const { pickles: [pickle], gherkinDocument, } = await (0, gherkin_helpers_1.parse)({
                        data: [
                            'Feature: a',
                            'Scenario: nameB descriptionB',
                            'Given a step',
                        ].join('\n'),
                        uri: 'features/a.feature',
                    });
                    // Act
                    const result = pickleFilter.matches({ pickle, gherkinDocument });
                    // Assert
                    (0, chai_1.expect)(result).to.eql(false);
                });
            });
            (0, mocha_1.describe)('should match name with regex', () => {
                (0, mocha_1.beforeEach)(function () {
                    pickleFilter = new pickle_filter_1.default({
                        cwd,
                        featurePaths: ['features'],
                        names: ['^startA.+endA$'],
                        tagExpression: '',
                    });
                });
                (0, mocha_1.it)('returns true if regex matches', async function () {
                    // Arrange
                    const { pickles: [pickle], gherkinDocument, } = await (0, gherkin_helpers_1.parse)({
                        data: [
                            'Feature: a',
                            'Scenario: startA descriptionA endA',
                            'Given a step',
                        ].join('\n'),
                        uri: 'features/a.feature',
                    });
                    // Act
                    const result = pickleFilter.matches({ pickle, gherkinDocument });
                    // Assert
                    (0, chai_1.expect)(result).to.eql(true);
                });
            });
            (0, mocha_1.describe)('should match name A or B', () => {
                (0, mocha_1.beforeEach)(function () {
                    pickleFilter = new pickle_filter_1.default({
                        cwd,
                        featurePaths: ['features'],
                        names: ['nameA', 'nameB'],
                        tagExpression: '',
                    });
                });
                (0, mocha_1.it)('returns true if pickle name matches A', async function () {
                    // Arrange
                    const { pickles: [pickle], gherkinDocument, } = await (0, gherkin_helpers_1.parse)({
                        data: [
                            'Feature: a',
                            'Scenario: nameA descriptionA',
                            'Given a step',
                        ].join('\n'),
                        uri: 'features/a.feature',
                    });
                    // Act
                    const result = pickleFilter.matches({ pickle, gherkinDocument });
                    // Assert
                    (0, chai_1.expect)(result).to.eql(true);
                });
                (0, mocha_1.it)('returns true if pickle name matches B', async function () {
                    // Arrange
                    const { pickles: [pickle], gherkinDocument, } = await (0, gherkin_helpers_1.parse)({
                        data: [
                            'Feature: a',
                            'Scenario: nameB descriptionB',
                            'Given a step',
                        ].join('\n'),
                        uri: 'features/a.feature',
                    });
                    // Act
                    const result = pickleFilter.matches({ pickle, gherkinDocument });
                    // Assert
                    (0, chai_1.expect)(result).to.eql(true);
                });
                (0, mocha_1.it)('returns false if pickle name does not match A nor B', async function () {
                    // Arrange
                    const { pickles: [pickle], gherkinDocument, } = await (0, gherkin_helpers_1.parse)({
                        data: [
                            'Feature: a',
                            'Scenario: nameC descriptionC',
                            'Given a step',
                        ].join('\n'),
                        uri: 'features/a.feature',
                    });
                    // Act
                    const result = pickleFilter.matches({ pickle, gherkinDocument });
                    // Assert
                    (0, chai_1.expect)(result).to.eql(false);
                });
            });
        });
        (0, mocha_1.describe)('tag filters', () => {
            (0, mocha_1.describe)('should have tag A', () => {
                (0, mocha_1.beforeEach)(function () {
                    pickleFilter = new pickle_filter_1.default({
                        cwd: cwd,
                        featurePaths: ['features'],
                        names: [],
                        tagExpression: '@tagA',
                    });
                });
                (0, mocha_1.it)('returns true if pickle has tag A', async function () {
                    // Arrange
                    const { pickles: [pickle], gherkinDocument, } = await (0, gherkin_helpers_1.parse)({
                        data: ['Feature: a', '@tagA', 'Scenario: a', 'Given a step'].join('\n'),
                        uri: 'features/a.feature',
                    });
                    // Act
                    const result = pickleFilter.matches({ pickle, gherkinDocument });
                    // Assert
                    (0, chai_1.expect)(result).to.eql(true);
                });
                (0, mocha_1.it)('returns false if pickle does not have tag A', async function () {
                    // Arrange
                    const { pickles: [pickle], gherkinDocument, } = await (0, gherkin_helpers_1.parse)({
                        data: ['Feature: a', 'Scenario: a', 'Given a step'].join('\n'),
                        uri: 'features/a.feature',
                    });
                    // Act
                    const result = pickleFilter.matches({ pickle, gherkinDocument });
                    // Assert
                    (0, chai_1.expect)(result).to.eql(false);
                });
            });
            (0, mocha_1.describe)('should not have tag A', () => {
                (0, mocha_1.beforeEach)(function () {
                    pickleFilter = new pickle_filter_1.default({
                        cwd,
                        featurePaths: ['features'],
                        names: [],
                        tagExpression: 'not @tagA',
                    });
                });
                (0, mocha_1.it)('returns false if pickle has tag A', async function () {
                    // Arrange
                    const { pickles: [pickle], gherkinDocument, } = await (0, gherkin_helpers_1.parse)({
                        data: ['Feature: a', '@tagA', 'Scenario: a', 'Given a step'].join('\n'),
                        uri: 'features/a.feature',
                    });
                    // Act
                    const result = pickleFilter.matches({ pickle, gherkinDocument });
                    // Assert
                    (0, chai_1.expect)(result).to.eql(false);
                });
                (0, mocha_1.it)('returns true if pickle does not have tag A', async function () {
                    // Arrange
                    const { pickles: [pickle], gherkinDocument, } = await (0, gherkin_helpers_1.parse)({
                        data: ['Feature: a', 'Scenario: a', 'Given a step'].join('\n'),
                        uri: 'features/a.feature',
                    });
                    // Act
                    const result = pickleFilter.matches({ pickle, gherkinDocument });
                    // Assert
                    (0, chai_1.expect)(result).to.eql(true);
                });
            });
            (0, mocha_1.describe)('should have tag A and B', () => {
                (0, mocha_1.beforeEach)(function () {
                    pickleFilter = new pickle_filter_1.default({
                        cwd,
                        featurePaths: ['features'],
                        names: [],
                        tagExpression: '@tagA and @tagB',
                    });
                });
                (0, mocha_1.it)('returns true if pickle has tag A and B', async function () {
                    // Arrange
                    const { pickles: [pickle], gherkinDocument, } = await (0, gherkin_helpers_1.parse)({
                        data: [
                            'Feature: a',
                            '@tagA @tagB',
                            'Scenario: a',
                            'Given a step',
                        ].join('\n'),
                        uri: 'features/a.feature',
                    });
                    // Act
                    const result = pickleFilter.matches({ pickle, gherkinDocument });
                    // Assert
                    (0, chai_1.expect)(result).to.eql(true);
                });
                (0, mocha_1.it)('returns false if pickle has tag A but not B', async function () {
                    // Arrange
                    const { pickles: [pickle], gherkinDocument, } = await (0, gherkin_helpers_1.parse)({
                        data: ['Feature: a', '@tagA', 'Scenario: a', 'Given a step'].join('\n'),
                        uri: 'features/a.feature',
                    });
                    // Act
                    const result = pickleFilter.matches({ pickle, gherkinDocument });
                    // Assert
                    (0, chai_1.expect)(result).to.eql(false);
                });
                (0, mocha_1.it)('returns false if pickle has tag B but not A', async function () {
                    // Arrange
                    const { pickles: [pickle], gherkinDocument, } = await (0, gherkin_helpers_1.parse)({
                        data: ['Feature: a', '@tagB', 'Scenario: a', 'Given a step'].join('\n'),
                        uri: 'features/a.feature',
                    });
                    // Act
                    const result = pickleFilter.matches({ pickle, gherkinDocument });
                    // Assert
                    (0, chai_1.expect)(result).to.eql(false);
                });
                (0, mocha_1.it)('returns false if pickle has neither tag A nor B', async function () {
                    // Arrange
                    const { pickles: [pickle], gherkinDocument, } = await (0, gherkin_helpers_1.parse)({
                        data: ['Feature: a', 'Scenario: a', 'Given a step'].join('\n'),
                        uri: 'features/a.feature',
                    });
                    // Act
                    const result = pickleFilter.matches({ pickle, gherkinDocument });
                    // Assert
                    (0, chai_1.expect)(result).to.eql(false);
                });
            });
            (0, mocha_1.describe)('should have tag A or B', () => {
                (0, mocha_1.beforeEach)(function () {
                    pickleFilter = new pickle_filter_1.default({
                        cwd: cwd,
                        featurePaths: ['features'],
                        names: [],
                        tagExpression: '@tagA or @tagB',
                    });
                });
                (0, mocha_1.it)('returns true if pickle has tag A and B', async function () {
                    // Arrange
                    const { pickles: [pickle], gherkinDocument, } = await (0, gherkin_helpers_1.parse)({
                        data: [
                            'Feature: a',
                            '@tagA @tagB',
                            'Scenario: a',
                            'Given a step',
                        ].join('\n'),
                        uri: 'features/a.feature',
                    });
                    // Act
                    const result = pickleFilter.matches({ pickle, gherkinDocument });
                    // Assert
                    (0, chai_1.expect)(result).to.eql(true);
                });
                (0, mocha_1.it)('returns true if pickle has tag A but not B', async function () {
                    // Arrange
                    const { pickles: [pickle], gherkinDocument, } = await (0, gherkin_helpers_1.parse)({
                        data: ['Feature: a', '@tagA', 'Scenario: a', 'Given a step'].join('\n'),
                        uri: 'features/a.feature',
                    });
                    // Act
                    const result = pickleFilter.matches({ pickle, gherkinDocument });
                    // Assert
                    (0, chai_1.expect)(result).to.eql(true);
                });
                (0, mocha_1.it)('returns true if pickle has tag B but not A', async function () {
                    // Arrange
                    const { pickles: [pickle], gherkinDocument, } = await (0, gherkin_helpers_1.parse)({
                        data: ['Feature: a', '@tagB', 'Scenario: a', 'Given a step'].join('\n'),
                        uri: 'features/a.feature',
                    });
                    // Act
                    const result = pickleFilter.matches({ pickle, gherkinDocument });
                    // Assert
                    (0, chai_1.expect)(result).to.eql(true);
                });
                (0, mocha_1.it)('returns false if pickle has neither tag A nor B', async function () {
                    // Arrange
                    const { pickles: [pickle], gherkinDocument, } = await (0, gherkin_helpers_1.parse)({
                        data: ['Feature: a', 'Scenario: a', 'Given a step'].join('\n'),
                        uri: 'features/a.feature',
                    });
                    // Act
                    const result = pickleFilter.matches({ pickle, gherkinDocument });
                    // Assert
                    (0, chai_1.expect)(result).to.eql(false);
                });
            });
        });
        (0, mocha_1.describe)('line, name, and tag filters', () => {
            (0, mocha_1.beforeEach)(function () {
                pickleFilter = new pickle_filter_1.default({
                    cwd: cwd,
                    featurePaths: ['features/b.feature:3'],
                    names: ['nameA'],
                    tagExpression: '@tagA',
                });
            });
            (0, mocha_1.it)('returns true if pickle matches all filters', async function () {
                // Arrange
                const { pickles: [pickle], gherkinDocument, } = await (0, gherkin_helpers_1.parse)({
                    data: [
                        'Feature: a',
                        '@tagA',
                        'Scenario: nameA descriptionA',
                        'Given a step',
                    ].join('\n'),
                    uri: 'features/b.feature',
                });
                // Act
                const result = pickleFilter.matches({ pickle, gherkinDocument });
                // Assert
                (0, chai_1.expect)(result).to.eql(true);
            });
            (0, mocha_1.it)('returns false if pickle matches some filters but not others', async function () {
                // Arrange
                const { pickles: [pickle], gherkinDocument, } = await (0, gherkin_helpers_1.parse)({
                    data: [
                        'Feature: a',
                        '',
                        'Scenario: nameA descriptionA',
                        'Given a step',
                    ].join('\n'),
                    uri: 'features/b.feature',
                });
                // Act
                const result = pickleFilter.matches({ pickle, gherkinDocument });
                // Assert
                (0, chai_1.expect)(result).to.eql(false);
            });
            (0, mocha_1.it)('returns false if pickle matches no filters', async function () {
                // Arrange
                const { pickles: [pickle], gherkinDocument, } = await (0, gherkin_helpers_1.parse)({
                    data: ['Feature: a', 'Scenario: a', 'Given a step'].join('\n'),
                    uri: 'features/a.feature',
                });
                // Act
                const result = pickleFilter.matches({ pickle, gherkinDocument });
                // Assert
                (0, chai_1.expect)(result).to.eql(false);
            });
        });
    });
});
//# sourceMappingURL=pickle_filter_spec.js.map