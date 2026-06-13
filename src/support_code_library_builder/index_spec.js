"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = require("node:assert");
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const sinon_1 = __importDefault(require("sinon"));
const cucumber_expressions_1 = require("@cucumber/cucumber-expressions");
const messages_1 = require("@cucumber/messages");
const gherkin_helpers_1 = require("../../test/gherkin_helpers");
const _1 = __importDefault(require("./"));
const { uuid } = messages_1.IdGenerator;
(0, mocha_1.describe)('supportCodeLibraryBuilder', () => {
    (0, mocha_1.it)('should throw if not been reset yet', () => {
        try {
            // @ts-expect-error mutating private member
            _1.default.status = 'PENDING';
            _1.default.methods.Given('some context', () => { });
            (0, node_assert_1.fail)();
        }
        catch (e) {
            (0, chai_1.expect)(e.message).to.contain('calling functions (e.g. "Given")');
            (0, chai_1.expect)(e.message).to.contain('status: PENDING');
        }
    });
    (0, mocha_1.describe)('no support code fns', () => {
        (0, mocha_1.it)('returns the default options', function () {
            // Arrange
            const attachFn = sinon_1.default.stub();
            _1.default.reset('path/to/project', uuid());
            // Act
            const options = _1.default.finalize();
            // Assert
            (0, chai_1.expect)(options.afterTestRunHookDefinitions).to.eql([]);
            (0, chai_1.expect)(options.afterTestCaseHookDefinitions).to.eql([]);
            (0, chai_1.expect)(options.beforeTestRunHookDefinitions).to.eql([]);
            (0, chai_1.expect)(options.beforeTestCaseHookDefinitions).to.eql([]);
            (0, chai_1.expect)(options.defaultTimeout).to.eql(5000);
            (0, chai_1.expect)(options.stepDefinitions).to.eql([]);
            (0, chai_1.expect)(options.parameterTypeRegistry).to.be.instanceOf(cucumber_expressions_1.ParameterTypeRegistry);
            const worldInstance = new options.World({
                attach: attachFn,
                parameters: { some: 'data' },
            });
            (0, chai_1.expect)(worldInstance.attach).to.eql(attachFn);
            (0, chai_1.expect)(worldInstance.parameters).to.eql({ some: 'data' });
        });
    });
    (0, mocha_1.describe)('step', () => {
        (0, mocha_1.describe)('without definition function wrapper', () => {
            (0, mocha_1.it)('adds a step definition and makes original code available', function () {
                // Arrange
                const step = function () { };
                _1.default.reset('path/to/project', uuid());
                _1.default.methods.defineStep('I do a thing', step);
                // Act
                const options = _1.default.finalize();
                // Assert
                (0, chai_1.expect)(options.stepDefinitions).to.have.lengthOf(1);
                const stepDefinition = options.stepDefinitions[0];
                (0, chai_1.expect)(stepDefinition.code).to.eql(step);
                (0, chai_1.expect)(stepDefinition.unwrappedCode).to.eql(step);
            });
            (0, mocha_1.it)('uses the canonical ids provided in order', function () {
                // Arrange
                const step = function () { };
                _1.default.reset('path/to/project', uuid());
                _1.default.methods.defineStep('I do a thing', step);
                _1.default.methods.defineStep('I do another thing', step);
                // Act
                const options = _1.default.finalize({
                    stepDefinitionIds: ['one', 'two'],
                    beforeTestCaseHookDefinitionIds: [],
                    afterTestCaseHookDefinitionIds: [],
                    beforeTestRunHookDefinitionIds: [],
                    afterTestRunHookDefinitionIds: [],
                });
                // Assert
                (0, chai_1.expect)(options.stepDefinitions).to.have.lengthOf(2);
                (0, chai_1.expect)(options.stepDefinitions.map((stepDefinition) => stepDefinition.id)).to.deep.eq(['one', 'two']);
            });
        });
        (0, mocha_1.describe)('with definition function wrapper', () => {
            (0, mocha_1.it)('adds a step definition and makes original code available', function () {
                // Arrange
                const step = function () { };
                _1.default.reset('path/to/project', uuid());
                _1.default.methods.defineStep('I do a thing', step);
                _1.default.methods.setDefinitionFunctionWrapper(function (fn) {
                    return fn();
                });
                // Act
                const options = _1.default.finalize();
                // Assert
                (0, chai_1.expect)(options.stepDefinitions).to.have.lengthOf(1);
                const stepDefinition = options.stepDefinitions[0];
                (0, chai_1.expect)(stepDefinition.code).not.to.eql(step);
                (0, chai_1.expect)(stepDefinition.unwrappedCode).to.eql(step);
            });
        });
        (0, mocha_1.describe)('keyword retention', () => {
            const step = function () { };
            beforeEach(() => _1.default.reset('path/to/project', uuid()));
            (0, mocha_1.it)('should record correctly for Given', () => {
                _1.default.methods.Given('a thing', step);
                (0, chai_1.expect)(_1.default.finalize().stepDefinitions[0].keyword).to.eq('Given');
            });
            (0, mocha_1.it)('should record correctly for When', () => {
                _1.default.methods.When('a thing', step);
                (0, chai_1.expect)(_1.default.finalize().stepDefinitions[0].keyword).to.eq('When');
            });
            (0, mocha_1.it)('should record correctly for Then', () => {
                _1.default.methods.Then('a thing', step);
                (0, chai_1.expect)(_1.default.finalize().stepDefinitions[0].keyword).to.eq('Then');
            });
            (0, mocha_1.it)('should record correctly for defineStep', () => {
                _1.default.methods.defineStep('a thing', step);
                (0, chai_1.expect)(_1.default.finalize().stepDefinitions[0].keyword).to.eq('Unknown');
            });
        });
    });
    (0, mocha_1.describe)('After', () => {
        (0, mocha_1.describe)('function only', () => {
            (0, mocha_1.it)('adds a test case hook definition', function () {
                // Arrange
                const hook = function () { };
                _1.default.reset('path/to/project', uuid());
                _1.default.methods.After(hook);
                // Act
                const options = _1.default.finalize();
                // Assert
                (0, chai_1.expect)(options.afterTestCaseHookDefinitions).to.have.lengthOf(1);
                const testCaseHookDefinition = options.afterTestCaseHookDefinitions[0];
                (0, chai_1.expect)(testCaseHookDefinition.code).to.eql(hook);
            });
            (0, mocha_1.it)('uses the canonical ids provided in order', function () {
                // Arrange
                const hook = function () { };
                _1.default.reset('path/to/project', uuid());
                _1.default.methods.After(hook);
                _1.default.methods.After(hook);
                // Act
                const options = _1.default.finalize({
                    stepDefinitionIds: [],
                    beforeTestCaseHookDefinitionIds: [],
                    afterTestCaseHookDefinitionIds: ['one', 'two'],
                    beforeTestRunHookDefinitionIds: [],
                    afterTestRunHookDefinitionIds: [],
                });
                // Assert
                (0, chai_1.expect)(options.afterTestCaseHookDefinitions).to.have.lengthOf(2);
                (0, chai_1.expect)(options.afterTestCaseHookDefinitions.map((definition) => definition.id)).to.deep.eq(['one', 'two']);
            });
        });
        (0, mocha_1.describe)('tag and function', () => {
            (0, mocha_1.it)('adds a scenario hook definition', async function () {
                // Arrange
                const hook = function () { };
                _1.default.reset('path/to/project', uuid());
                _1.default.methods.After('@tagA', hook);
                const pickleWithTagA = await (0, gherkin_helpers_1.getPickleWithTags)(['@tagA']);
                const pickleWithTagB = await (0, gherkin_helpers_1.getPickleWithTags)(['@tagB']);
                // Act
                const options = _1.default.finalize();
                // Assert
                (0, chai_1.expect)(options.afterTestCaseHookDefinitions).to.have.lengthOf(1);
                const testCaseHookDefinition = options.afterTestCaseHookDefinitions[0];
                (0, chai_1.expect)(testCaseHookDefinition.code).to.eql(hook);
                (0, chai_1.expect)(testCaseHookDefinition.appliesToTestCase(pickleWithTagA)).to.eql(true);
                (0, chai_1.expect)(testCaseHookDefinition.appliesToTestCase(pickleWithTagB)).to.eql(false);
            });
        });
        (0, mocha_1.describe)('options and function', () => {
            (0, mocha_1.it)('adds a scenario hook definition', async function () {
                // Arrange
                const hook = function () { };
                _1.default.reset('path/to/project', uuid());
                _1.default.methods.After({ tags: '@tagA' }, hook);
                const pickleWithTagA = await (0, gherkin_helpers_1.getPickleWithTags)(['@tagA']);
                const pickleWithTagB = await (0, gherkin_helpers_1.getPickleWithTags)(['@tagB']);
                // Act
                const options = _1.default.finalize();
                // Assert
                (0, chai_1.expect)(options.afterTestCaseHookDefinitions).to.have.lengthOf(1);
                const testCaseHookDefinition = options.afterTestCaseHookDefinitions[0];
                (0, chai_1.expect)(testCaseHookDefinition.code).to.eql(hook);
                (0, chai_1.expect)(testCaseHookDefinition.appliesToTestCase(pickleWithTagA)).to.eql(true);
                (0, chai_1.expect)(testCaseHookDefinition.appliesToTestCase(pickleWithTagB)).to.eql(false);
            });
        });
        (0, mocha_1.describe)('multiple', () => {
            (0, mocha_1.it)('adds the scenario hook definitions in the order of definition', function () {
                // Arrange
                const hook1 = function hook1() { };
                const hook2 = function hook2() { };
                _1.default.reset('path/to/project', uuid());
                _1.default.methods.After(hook1);
                _1.default.methods.After(hook2);
                // Act
                const options = _1.default.finalize();
                // Assert
                (0, chai_1.expect)(options.afterTestCaseHookDefinitions).to.have.lengthOf(2);
                (0, chai_1.expect)(options.afterTestCaseHookDefinitions[0].code).to.eql(hook1);
                (0, chai_1.expect)(options.afterTestCaseHookDefinitions[1].code).to.eql(hook2);
            });
        });
    });
    (0, mocha_1.describe)('Before', () => {
        (0, mocha_1.describe)('function only', () => {
            (0, mocha_1.it)('adds a scenario hook definition', function () {
                // Arrange
                const hook = function () { };
                _1.default.reset('path/to/project', uuid());
                _1.default.methods.Before(hook);
                // Act
                const options = _1.default.finalize();
                // Assert
                (0, chai_1.expect)(options.beforeTestCaseHookDefinitions).to.have.lengthOf(1);
                const testCaseHookDefinition = options.beforeTestCaseHookDefinitions[0];
                (0, chai_1.expect)(testCaseHookDefinition.code).to.eql(hook);
            });
            (0, mocha_1.it)('uses the canonical ids provided in order', function () {
                // Arrange
                const hook = function () { };
                _1.default.reset('path/to/project', uuid());
                _1.default.methods.Before(hook);
                _1.default.methods.Before(hook);
                // Act
                const options = _1.default.finalize({
                    stepDefinitionIds: [],
                    beforeTestCaseHookDefinitionIds: ['one', 'two'],
                    afterTestCaseHookDefinitionIds: [],
                    beforeTestRunHookDefinitionIds: [],
                    afterTestRunHookDefinitionIds: [],
                });
                // Assert
                (0, chai_1.expect)(options.beforeTestCaseHookDefinitions).to.have.lengthOf(2);
                (0, chai_1.expect)(options.beforeTestCaseHookDefinitions.map((definition) => definition.id)).to.deep.eq(['one', 'two']);
            });
        });
        (0, mocha_1.describe)('tag and function', () => {
            (0, mocha_1.it)('adds a scenario hook definition', async function () {
                // Arrange
                const hook = function () { };
                _1.default.reset('path/to/project', uuid());
                _1.default.methods.Before('@tagA', hook);
                const pickleWithTagA = await (0, gherkin_helpers_1.getPickleWithTags)(['@tagA']);
                const pickleWithTagB = await (0, gherkin_helpers_1.getPickleWithTags)(['@tagB']);
                // Act
                const options = _1.default.finalize();
                // Assert
                (0, chai_1.expect)(options.beforeTestCaseHookDefinitions).to.have.lengthOf(1);
                const testCaseHookDefinition = options.beforeTestCaseHookDefinitions[0];
                (0, chai_1.expect)(testCaseHookDefinition.code).to.eql(hook);
                (0, chai_1.expect)(testCaseHookDefinition.appliesToTestCase(pickleWithTagA)).to.eql(true);
                (0, chai_1.expect)(testCaseHookDefinition.appliesToTestCase(pickleWithTagB)).to.eql(false);
            });
        });
        (0, mocha_1.describe)('options and function', () => {
            (0, mocha_1.it)('adds a scenario hook definition', async function () {
                // Arrange
                const hook = function () { };
                _1.default.reset('path/to/project', uuid());
                _1.default.methods.Before({ tags: '@tagA' }, hook);
                const pickleWithTagA = await (0, gherkin_helpers_1.getPickleWithTags)(['@tagA']);
                const pickleWithTagB = await (0, gherkin_helpers_1.getPickleWithTags)(['@tagB']);
                // Act
                const options = _1.default.finalize();
                // Assert
                (0, chai_1.expect)(options.beforeTestCaseHookDefinitions).to.have.lengthOf(1);
                const testCaseHookDefinition = options.beforeTestCaseHookDefinitions[0];
                (0, chai_1.expect)(testCaseHookDefinition.code).to.eql(hook);
                (0, chai_1.expect)(testCaseHookDefinition.appliesToTestCase(pickleWithTagA)).to.eql(true);
                (0, chai_1.expect)(testCaseHookDefinition.appliesToTestCase(pickleWithTagB)).to.eql(false);
            });
        });
        (0, mocha_1.describe)('multiple', () => {
            (0, mocha_1.it)('adds the scenario hook definitions in the order of definition', function () {
                // Arrange
                const hook1 = function hook1() { };
                const hook2 = function hook2() { };
                _1.default.reset('path/to/project', uuid());
                _1.default.methods.Before(hook1);
                _1.default.methods.Before(hook2);
                // Act
                const options = _1.default.finalize();
                // Assert
                (0, chai_1.expect)(options.beforeTestCaseHookDefinitions).to.have.lengthOf(2);
                (0, chai_1.expect)(options.beforeTestCaseHookDefinitions[0].code).to.eql(hook1);
                (0, chai_1.expect)(options.beforeTestCaseHookDefinitions[1].code).to.eql(hook2);
            });
        });
    });
    (0, mocha_1.describe)('AfterStep', () => {
        (0, mocha_1.describe)('function only', () => {
            (0, mocha_1.it)('adds a test step hook definition', function () {
                // Arrange
                const hook = function () { };
                _1.default.reset('path/to/project', uuid());
                _1.default.methods.AfterStep(hook);
                // Act
                const options = _1.default.finalize();
                // Assert
                (0, chai_1.expect)(options.afterTestStepHookDefinitions).to.have.lengthOf(1);
                const testStepHookDefinition = options.afterTestStepHookDefinitions[0];
                (0, chai_1.expect)(testStepHookDefinition.code).to.eql(hook);
            });
        });
        (0, mocha_1.describe)('tag and function', () => {
            (0, mocha_1.it)('adds a step hook definition', async function () {
                // Arrange
                const hook = function () { };
                _1.default.reset('path/to/project', uuid());
                _1.default.methods.AfterStep('@tagA', hook);
                const pickleWithTagA = await (0, gherkin_helpers_1.getPickleWithTags)(['@tagA']);
                const pickleWithTagB = await (0, gherkin_helpers_1.getPickleWithTags)(['@tagB']);
                // Act
                const options = _1.default.finalize();
                // Assert
                (0, chai_1.expect)(options.afterTestStepHookDefinitions).to.have.lengthOf(1);
                const testStepHookDefinition = options.afterTestStepHookDefinitions[0];
                (0, chai_1.expect)(testStepHookDefinition.code).to.eql(hook);
                (0, chai_1.expect)(testStepHookDefinition.appliesToTestCase(pickleWithTagA)).to.eql(true);
                (0, chai_1.expect)(testStepHookDefinition.appliesToTestCase(pickleWithTagB)).to.eql(false);
            });
        });
        (0, mocha_1.describe)('options and function', () => {
            (0, mocha_1.it)('adds a step hook definition', async function () {
                // Arrange
                const hook = function () { };
                _1.default.reset('path/to/project', uuid());
                _1.default.methods.AfterStep({ tags: '@tagA' }, hook);
                const pickleWithTagA = await (0, gherkin_helpers_1.getPickleWithTags)(['@tagA']);
                const pickleWithTagB = await (0, gherkin_helpers_1.getPickleWithTags)(['@tagB']);
                // Act
                const options = _1.default.finalize();
                // Assert
                (0, chai_1.expect)(options.afterTestStepHookDefinitions).to.have.lengthOf(1);
                const testStepHookDefinition = options.afterTestStepHookDefinitions[0];
                (0, chai_1.expect)(testStepHookDefinition.code).to.eql(hook);
                (0, chai_1.expect)(testStepHookDefinition.appliesToTestCase(pickleWithTagA)).to.eql(true);
                (0, chai_1.expect)(testStepHookDefinition.appliesToTestCase(pickleWithTagB)).to.eql(false);
            });
        });
        (0, mocha_1.describe)('multiple', () => {
            (0, mocha_1.it)('adds the step hook definitions in the order of definition', function () {
                // Arrange
                const hook1 = function hook1() { };
                const hook2 = function hook2() { };
                _1.default.reset('path/to/project', uuid());
                _1.default.methods.AfterStep(hook1);
                _1.default.methods.AfterStep(hook2);
                // Act
                const options = _1.default.finalize();
                // Assert
                (0, chai_1.expect)(options.afterTestStepHookDefinitions).to.have.lengthOf(2);
                (0, chai_1.expect)(options.afterTestStepHookDefinitions[0].code).to.eql(hook1);
                (0, chai_1.expect)(options.afterTestStepHookDefinitions[1].code).to.eql(hook2);
            });
        });
    });
    (0, mocha_1.describe)('BeforeStep', () => {
        (0, mocha_1.describe)('function only', () => {
            (0, mocha_1.it)('adds a step hook definition', function () {
                // Arrange
                const hook = function () { };
                _1.default.reset('path/to/project', uuid());
                _1.default.methods.BeforeStep(hook);
                // Act
                const options = _1.default.finalize();
                // Assert
                (0, chai_1.expect)(options.beforeTestStepHookDefinitions).to.have.lengthOf(1);
                const testStepHookDefinition = options.beforeTestStepHookDefinitions[0];
                (0, chai_1.expect)(testStepHookDefinition.code).to.eql(hook);
            });
        });
        (0, mocha_1.describe)('tag and function', () => {
            (0, mocha_1.it)('adds a step hook definition', async function () {
                // Arrange
                const hook = function () { };
                _1.default.reset('path/to/project', uuid());
                _1.default.methods.BeforeStep('@tagA', hook);
                const pickleWithTagA = await (0, gherkin_helpers_1.getPickleWithTags)(['@tagA']);
                const pickleWithTagB = await (0, gherkin_helpers_1.getPickleWithTags)(['@tagB']);
                // Act
                const options = _1.default.finalize();
                // Assert
                (0, chai_1.expect)(options.beforeTestStepHookDefinitions).to.have.lengthOf(1);
                const testStepHookDefinition = options.beforeTestStepHookDefinitions[0];
                (0, chai_1.expect)(testStepHookDefinition.code).to.eql(hook);
                (0, chai_1.expect)(testStepHookDefinition.appliesToTestCase(pickleWithTagA)).to.eql(true);
                (0, chai_1.expect)(testStepHookDefinition.appliesToTestCase(pickleWithTagB)).to.eql(false);
            });
        });
        (0, mocha_1.describe)('options and function', () => {
            (0, mocha_1.it)('adds a step hook definition', async function () {
                // Arrange
                const hook = function () { };
                _1.default.reset('path/to/project', uuid());
                _1.default.methods.BeforeStep({ tags: '@tagA' }, hook);
                const pickleWithTagA = await (0, gherkin_helpers_1.getPickleWithTags)(['@tagA']);
                const pickleWithTagB = await (0, gherkin_helpers_1.getPickleWithTags)(['@tagB']);
                // Act
                const options = _1.default.finalize();
                // Assert
                (0, chai_1.expect)(options.beforeTestStepHookDefinitions).to.have.lengthOf(1);
                const testStepHookDefinition = options.beforeTestStepHookDefinitions[0];
                (0, chai_1.expect)(testStepHookDefinition.code).to.eql(hook);
                (0, chai_1.expect)(testStepHookDefinition.appliesToTestCase(pickleWithTagA)).to.eql(true);
                (0, chai_1.expect)(testStepHookDefinition.appliesToTestCase(pickleWithTagB)).to.eql(false);
            });
        });
        (0, mocha_1.describe)('multiple', () => {
            (0, mocha_1.it)('adds the step hook definitions in the order of definition', function () {
                // Arrange
                const hook1 = function hook1() { };
                const hook2 = function hook2() { };
                _1.default.reset('path/to/project', uuid());
                _1.default.methods.BeforeStep(hook1);
                _1.default.methods.BeforeStep(hook2);
                // Act
                const options = _1.default.finalize();
                // Assert
                (0, chai_1.expect)(options.beforeTestStepHookDefinitions).to.have.lengthOf(2);
                (0, chai_1.expect)(options.beforeTestStepHookDefinitions[0].code).to.eql(hook1);
                (0, chai_1.expect)(options.beforeTestStepHookDefinitions[1].code).to.eql(hook2);
            });
        });
    });
    (0, mocha_1.describe)('AfterAll', () => {
        (0, mocha_1.describe)('function only', () => {
            (0, mocha_1.it)('adds a test run hook definition', function () {
                // Arrange
                const hook = function () { };
                _1.default.reset('path/to/project', uuid());
                _1.default.methods.AfterAll(hook);
                // Act
                const options = _1.default.finalize();
                // Assert
                (0, chai_1.expect)(options.afterTestRunHookDefinitions).to.have.lengthOf(1);
                const testRunHookDefinition = options.afterTestRunHookDefinitions[0];
                (0, chai_1.expect)(testRunHookDefinition.code).to.eql(hook);
            });
            (0, mocha_1.it)('uses the canonical ids provided in order', function () {
                // Arrange
                const hook = function () { };
                _1.default.reset('path/to/project', uuid());
                _1.default.methods.AfterAll(hook);
                _1.default.methods.AfterAll(hook);
                // Act
                const options = _1.default.finalize({
                    stepDefinitionIds: [],
                    beforeTestCaseHookDefinitionIds: [],
                    afterTestCaseHookDefinitionIds: [],
                    beforeTestRunHookDefinitionIds: [],
                    afterTestRunHookDefinitionIds: ['one', 'two'],
                });
                // Assert
                (0, chai_1.expect)(options.afterTestRunHookDefinitions).to.have.lengthOf(2);
                (0, chai_1.expect)(options.afterTestRunHookDefinitions.map((definition) => definition.id)).to.deep.eq(['one', 'two']);
            });
        });
        (0, mocha_1.describe)('options and function', () => {
            (0, mocha_1.it)('adds a test run hook definition', function () {
                // Arrange
                const hook = function () { };
                _1.default.reset('path/to/project', uuid());
                _1.default.methods.AfterAll({ timeout: 1000 }, hook);
                // Act
                const options = _1.default.finalize();
                // Assert
                (0, chai_1.expect)(options.afterTestRunHookDefinitions).to.have.lengthOf(1);
                const testRunHookDefinition = options.afterTestRunHookDefinitions[0];
                (0, chai_1.expect)(testRunHookDefinition.code).to.eql(hook);
                (0, chai_1.expect)(testRunHookDefinition.options.timeout).to.eql(1000);
            });
        });
        (0, mocha_1.describe)('multiple', () => {
            (0, mocha_1.it)('adds the test run hook definitions in the order of definition', function () {
                // Arrange
                const hook1 = function hook1() { };
                const hook2 = function hook2() { };
                _1.default.reset('path/to/project', uuid());
                _1.default.methods.AfterAll(hook1);
                _1.default.methods.AfterAll(hook2);
                // Act
                const options = _1.default.finalize();
                // Assert
                (0, chai_1.expect)(options.afterTestRunHookDefinitions).to.have.lengthOf(2);
                (0, chai_1.expect)(options.afterTestRunHookDefinitions[0].code).to.eql(hook1);
                (0, chai_1.expect)(options.afterTestRunHookDefinitions[1].code).to.eql(hook2);
            });
        });
    });
    (0, mocha_1.describe)('BeforeAll', () => {
        (0, mocha_1.describe)('function only', () => {
            (0, mocha_1.it)('adds a test run hook definition', function () {
                // Arrange
                const hook = function () { };
                _1.default.reset('path/to/project', uuid());
                _1.default.methods.BeforeAll(hook);
                // Act
                const options = _1.default.finalize();
                // Assert
                (0, chai_1.expect)(options.beforeTestRunHookDefinitions).to.have.lengthOf(1);
                const testRunHookDefinition = options.beforeTestRunHookDefinitions[0];
                (0, chai_1.expect)(testRunHookDefinition.code).to.eql(hook);
            });
            (0, mocha_1.it)('uses the canonical ids provided in order', function () {
                // Arrange
                const hook = function () { };
                _1.default.reset('path/to/project', uuid());
                _1.default.methods.BeforeAll(hook);
                _1.default.methods.BeforeAll(hook);
                // Act
                const options = _1.default.finalize({
                    stepDefinitionIds: [],
                    beforeTestCaseHookDefinitionIds: [],
                    afterTestCaseHookDefinitionIds: [],
                    beforeTestRunHookDefinitionIds: ['one', 'two'],
                    afterTestRunHookDefinitionIds: [],
                });
                // Assert
                (0, chai_1.expect)(options.beforeTestRunHookDefinitions).to.have.lengthOf(2);
                (0, chai_1.expect)(options.beforeTestRunHookDefinitions.map((definition) => definition.id)).to.deep.eq(['one', 'two']);
            });
        });
        (0, mocha_1.describe)('options and function', () => {
            (0, mocha_1.it)('adds a test run hook definition', function () {
                // Arrange
                const hook = function () { };
                _1.default.reset('path/to/project', uuid());
                _1.default.methods.BeforeAll({ timeout: 1000 }, hook);
                // Act
                const options = _1.default.finalize();
                // Assert
                (0, chai_1.expect)(options.beforeTestRunHookDefinitions).to.have.lengthOf(1);
                const testRunHookDefinition = options.beforeTestRunHookDefinitions[0];
                (0, chai_1.expect)(testRunHookDefinition.code).to.eql(hook);
                (0, chai_1.expect)(testRunHookDefinition.options.timeout).to.eql(1000);
            });
        });
        (0, mocha_1.describe)('multiple', () => {
            (0, mocha_1.it)('adds the test run hook definitions in the order of definition', function () {
                // Arrange
                const hook1 = function hook1() { };
                const hook2 = function hook2() { };
                _1.default.reset('path/to/project', uuid());
                _1.default.methods.BeforeAll(hook1);
                _1.default.methods.BeforeAll(hook2);
                // Act
                const options = _1.default.finalize();
                // Assert
                (0, chai_1.expect)(options.beforeTestRunHookDefinitions).to.have.lengthOf(2);
                (0, chai_1.expect)(options.beforeTestRunHookDefinitions[0].code).to.eql(hook1);
                (0, chai_1.expect)(options.beforeTestRunHookDefinitions[1].code).to.eql(hook2);
            });
        });
    });
});
//# sourceMappingURL=index_spec.js.map