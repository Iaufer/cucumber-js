"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const sinon_1 = __importDefault(require("sinon"));
const cucumber_expressions_1 = require("@cucumber/cucumber-expressions");
const helpers_1 = require("../helpers");
const gherkin_helpers_1 = require("../../../test/gherkin_helpers");
const _1 = __importDefault(require("./"));
function testStepDefinitionBuilder(request) {
    const snippetSyntax = {
        build: sinon_1.default.stub().returns('snippet'),
    };
    const snippetBuilder = new _1.default({
        snippetSyntax,
        parameterTypeRegistry: new cucumber_expressions_1.ParameterTypeRegistry(),
    });
    const result = snippetBuilder.build(request);
    (0, chai_1.expect)(result).to.eql('snippet');
    (0, chai_1.expect)(snippetSyntax.build).to.have.been.calledOnce();
    return snippetSyntax.build.firstCall.args[0];
}
(0, mocha_1.describe)('StepDefinitionSnippetBuilder', () => {
    (0, mocha_1.describe)('build()', () => {
        (0, mocha_1.describe)('step is an precondition step', () => {
            (0, mocha_1.it)('uses Given as the function name', async function () {
                // Arrange
                const pickleStep = await (0, gherkin_helpers_1.getPickleStepWithText)('Given abc');
                // Act
                const arg = testStepDefinitionBuilder({
                    keywordType: helpers_1.KeywordType.Precondition,
                    pickleStep,
                });
                // Assert
                (0, chai_1.expect)(arg.functionName).to.eql('Given');
            });
        });
        (0, mocha_1.describe)('step is an event step', () => {
            (0, mocha_1.it)('uses When as the function name', async function () {
                // Arrange
                const pickleStep = await (0, gherkin_helpers_1.getPickleStepWithText)('When abc');
                // Act
                const arg = testStepDefinitionBuilder({
                    keywordType: helpers_1.KeywordType.Event,
                    pickleStep,
                });
                // Assert
                (0, chai_1.expect)(arg.functionName).to.eql('When');
            });
        });
        (0, mocha_1.describe)('step is an outcome step', () => {
            (0, mocha_1.it)('uses Then as the function name', async function () {
                // Arrange
                const pickleStep = await (0, gherkin_helpers_1.getPickleStepWithText)('Then abc');
                // Act
                const arg = testStepDefinitionBuilder({
                    keywordType: helpers_1.KeywordType.Outcome,
                    pickleStep,
                });
                // Assert
                (0, chai_1.expect)(arg.functionName).to.eql('Then');
            });
        });
        (0, mocha_1.describe)('step has simple name', () => {
            (0, mocha_1.it)('adds the proper generated expression', async function () {
                // Arrange
                const pickleStep = await (0, gherkin_helpers_1.getPickleStepWithText)('Given abc');
                // Act
                const arg = testStepDefinitionBuilder({
                    keywordType: helpers_1.KeywordType.Precondition,
                    pickleStep,
                });
                // Assert
                (0, chai_1.expect)(arg.generatedExpressions).to.have.lengthOf(1);
                const generatedExpression = arg.generatedExpressions[0];
                (0, chai_1.expect)(generatedExpression.source).to.eql('abc');
                (0, chai_1.expect)(generatedExpression.parameterNames).to.eql([]);
            });
        });
        (0, mocha_1.describe)('step name has a quoted string', () => {
            (0, mocha_1.it)('adds the proper generated expression', async function () {
                // Arrange
                const pickleStep = await (0, gherkin_helpers_1.getPickleStepWithText)('Given abc "def" ghi');
                // Act
                const arg = testStepDefinitionBuilder({
                    keywordType: helpers_1.KeywordType.Precondition,
                    pickleStep,
                });
                // Assert
                const generatedExpression = arg.generatedExpressions[0];
                (0, chai_1.expect)(generatedExpression.source).to.eql('abc {string} ghi');
                (0, chai_1.expect)(generatedExpression.parameterNames).to.eql(['string']);
            });
        });
        (0, mocha_1.describe)('step name has multiple quoted strings', () => {
            (0, mocha_1.it)('adds the proper generated expression', async function () {
                // Arrange
                const pickleStep = await (0, gherkin_helpers_1.getPickleStepWithText)('Given abc "def" ghi "jkl" mno');
                // Act
                const arg = testStepDefinitionBuilder({
                    keywordType: helpers_1.KeywordType.Precondition,
                    pickleStep,
                });
                // Assert
                const generatedExpression = arg.generatedExpressions[0];
                (0, chai_1.expect)(generatedExpression.source).to.eql('abc {string} ghi {string} mno');
                (0, chai_1.expect)(generatedExpression.parameterNames).to.eql(['string', 'string2']);
            });
        });
        (0, mocha_1.describe)('step name has a standalone number', () => {
            (0, mocha_1.it)('adds the proper generated expression', async function () {
                // Arrange
                const pickleStep = await (0, gherkin_helpers_1.getPickleStepWithText)('Given abc 123 def');
                // Act
                const arg = testStepDefinitionBuilder({
                    keywordType: helpers_1.KeywordType.Precondition,
                    pickleStep,
                });
                // Assert
                const generatedExpression = arg.generatedExpressions[0];
                (0, chai_1.expect)(generatedExpression.source).to.eql('abc {int} def');
                (0, chai_1.expect)(generatedExpression.parameterNames).to.eql(['int']);
            });
        });
        (0, mocha_1.describe)('step has no argument', () => {
            (0, mocha_1.it)('passes no step parameter names', async function () {
                // Arrange
                const pickleStep = await (0, gherkin_helpers_1.getPickleStepWithText)('Given abc');
                // Act
                const arg = testStepDefinitionBuilder({
                    keywordType: helpers_1.KeywordType.Precondition,
                    pickleStep,
                });
                // Assert
                (0, chai_1.expect)(arg.stepParameterNames).to.eql([]);
            });
        });
        (0, mocha_1.describe)('step has a data table argument', () => {
            (0, mocha_1.it)('passes dataTable as a step parameter name', async function () {
                // Arrange
                const pickleStep = await (0, gherkin_helpers_1.getPickleStepWithText)(`\
          Given abc  
            | a |`);
                // Act
                const arg = testStepDefinitionBuilder({
                    keywordType: helpers_1.KeywordType.Precondition,
                    pickleStep,
                });
                // Assert
                (0, chai_1.expect)(arg.stepParameterNames).to.eql(['dataTable']);
            });
        });
        (0, mocha_1.describe)('step has a doc string argument', () => {
            (0, mocha_1.it)('passes docString as a step parameter name', async function () {
                // Arrange
                const pickleStep = await (0, gherkin_helpers_1.getPickleStepWithText)(`
          Given abc
            """
            a
            """`);
                // Act
                const arg = testStepDefinitionBuilder({
                    keywordType: helpers_1.KeywordType.Precondition,
                    pickleStep,
                });
                // Assert
                (0, chai_1.expect)(arg.stepParameterNames).to.eql(['docString']);
            });
        });
    });
});
//# sourceMappingURL=index_spec.js.map