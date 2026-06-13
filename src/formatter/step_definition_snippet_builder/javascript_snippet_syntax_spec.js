"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const cucumber_expressions_1 = require("@cucumber/cucumber-expressions");
const reindent_template_literals_1 = require("reindent-template-literals");
const javascript_snippet_syntax_1 = __importDefault(require("./javascript_snippet_syntax"));
const snippet_syntax_1 = require("./snippet_syntax");
function generateExpressions(text) {
    const parameterTypeRegistry = new cucumber_expressions_1.ParameterTypeRegistry();
    const cucumberExpressionGenerator = new cucumber_expressions_1.CucumberExpressionGenerator(() => parameterTypeRegistry.parameterTypes);
    return cucumberExpressionGenerator.generateExpressions(text);
}
(0, mocha_1.describe)('JavascriptSnippetSyntax', () => {
    (0, mocha_1.describe)('build()', () => {
        (0, mocha_1.describe)('callback interface', () => {
            (0, mocha_1.it)('returns the proper snippet', function () {
                // Arrange
                const syntax = new javascript_snippet_syntax_1.default(snippet_syntax_1.SnippetInterface.Callback);
                const buildOptions = {
                    comment: 'comment',
                    functionName: 'functionName',
                    generatedExpressions: generateExpressions('"abc" def "ghi"'),
                    stepParameterNames: [],
                };
                // Act
                const result = syntax.build(buildOptions);
                // Assert
                (0, chai_1.expect)(result).to.eql((0, reindent_template_literals_1.reindent)(`
            functionName('{string} def {string}', function (string, string2, callback) {
              // comment
              callback(null, 'pending');
            });`));
            });
        });
        (0, mocha_1.describe)('promise interface', () => {
            (0, mocha_1.it)('returns the proper snippet', function () {
                // Arrange
                const syntax = new javascript_snippet_syntax_1.default(snippet_syntax_1.SnippetInterface.Promise);
                const buildOptions = {
                    comment: 'comment',
                    functionName: 'functionName',
                    generatedExpressions: generateExpressions('"abc" def "ghi"'),
                    stepParameterNames: [],
                };
                // Act
                const result = syntax.build(buildOptions);
                // Assert
                (0, chai_1.expect)(result).to.eql((0, reindent_template_literals_1.reindent)(`
            functionName('{string} def {string}', function (string, string2) {
              // comment
              return Promise.resolve('pending');
            });`));
            });
        });
        (0, mocha_1.describe)('synchronous interface', () => {
            (0, mocha_1.it)('returns the proper snippet', function () {
                // Arrange
                const syntax = new javascript_snippet_syntax_1.default(snippet_syntax_1.SnippetInterface.Synchronous);
                const buildOptions = {
                    comment: 'comment',
                    functionName: 'functionName',
                    generatedExpressions: generateExpressions('"abc" def "ghi"'),
                    stepParameterNames: [],
                };
                // Act
                const result = syntax.build(buildOptions);
                // Assert
                (0, chai_1.expect)(result).to.eql((0, reindent_template_literals_1.reindent)(`
            functionName('{string} def {string}', function (string, string2) {
              // comment
              return 'pending';
            });`));
            });
        });
        (0, mocha_1.describe)('pattern contains single quote', () => {
            (0, mocha_1.it)('returns the proper snippet', function () {
                // Arrange
                const syntax = new javascript_snippet_syntax_1.default(snippet_syntax_1.SnippetInterface.Synchronous);
                const buildOptions = {
                    comment: 'comment',
                    functionName: 'functionName',
                    generatedExpressions: generateExpressions("pattern'"),
                    stepParameterNames: [],
                };
                // Act
                const result = syntax.build(buildOptions);
                // Assert
                (0, chai_1.expect)(result).to.eql((0, reindent_template_literals_1.reindent)(`
            functionName('pattern\\'', function () {
              // comment
              return 'pending';
            });`));
            });
        });
        (0, mocha_1.describe)('pattern contains escapes', () => {
            (0, mocha_1.it)('returns the proper snippet', () => {
                // Arrange
                const syntax = new javascript_snippet_syntax_1.default(snippet_syntax_1.SnippetInterface.Synchronous);
                const buildOptions = {
                    comment: 'comment',
                    functionName: 'functionName',
                    generatedExpressions: generateExpressions('the user (with permissions) executes the action'),
                    stepParameterNames: [],
                };
                // Act
                const result = syntax.build(buildOptions);
                // Assert
                (0, chai_1.expect)(result).to.eql((0, reindent_template_literals_1.reindent)(`
            functionName('the user \\\\(with permissions) executes the action', function () {
              // comment
              return 'pending';
            });`));
            });
        });
        (0, mocha_1.describe)('multiple patterns', () => {
            (0, mocha_1.it)('returns the snippet with the other choices commented out', function () {
                // Arrange
                const syntax = new javascript_snippet_syntax_1.default(snippet_syntax_1.SnippetInterface.Synchronous);
                const buildOptions = {
                    comment: 'comment',
                    functionName: 'functionName',
                    generatedExpressions: generateExpressions('123 456'),
                    stepParameterNames: [],
                };
                // Act
                const result = syntax.build(buildOptions);
                // Assert
                (0, chai_1.expect)(result).to.eql((0, reindent_template_literals_1.reindent)(`
            functionName('{int} {int}', function (int, int2) {
            // functionName('{int} {float}', function (int, float) {
            // functionName('{float} {int}', function (float, int) {
            // functionName('{float} {float}', function (float, float2) {
              // comment
              return 'pending';
            });`));
            });
        });
    });
});
//# sourceMappingURL=javascript_snippet_syntax_spec.js.map