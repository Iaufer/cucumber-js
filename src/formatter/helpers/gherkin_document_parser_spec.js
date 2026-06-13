"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const reindent_template_literals_1 = require("reindent-template-literals");
const gherkin_helpers_1 = require("../../../test/gherkin_helpers");
const gherkin_document_parser_1 = require("./gherkin_document_parser");
(0, mocha_1.describe)('GherkinDocumentParser', () => {
    (0, mocha_1.describe)('getGherkinStepMap', () => {
        (0, mocha_1.it)('works for a Background and Scenario', async () => {
            // Arrange
            const gherkinDocument = await withBackgroundAndScenario();
            // Act
            const output = (0, gherkin_document_parser_1.getGherkinStepMap)(gherkinDocument);
            // Assert
            const backgroundStep = gherkinDocument.feature.children[0].background.steps[0];
            const scenarioStep = gherkinDocument.feature.children[1].scenario.steps[0];
            (0, chai_1.expect)(output).to.eql({
                [backgroundStep.id]: backgroundStep,
                [scenarioStep.id]: scenarioStep,
            });
        });
        (0, mocha_1.it)('works for a Background and Scenario Outline', async () => {
            // Arrange
            const gherkinDocument = await withBackgroundAndScenarioOutline();
            // Act
            const output = (0, gherkin_document_parser_1.getGherkinStepMap)(gherkinDocument);
            // Assert
            const backgroundStep = gherkinDocument.feature.children[0].background.steps[0];
            const outlineStep = gherkinDocument.feature.children[1].scenario.steps[0];
            (0, chai_1.expect)(output).to.eql({
                [backgroundStep.id]: backgroundStep,
                [outlineStep.id]: outlineStep,
            });
        });
        (0, mocha_1.it)('works for a Background and Rule with Examples', async () => {
            // Arrange
            const gherkinDocument = await withBackgroundAndRuleWithExamples();
            // Act
            const output = (0, gherkin_document_parser_1.getGherkinStepMap)(gherkinDocument);
            // Assert
            const backgroundStep = gherkinDocument.feature.children[0].background.steps[0];
            const example1When = gherkinDocument.feature.children[1].rule.children[0].scenario.steps[0];
            const example1Then = gherkinDocument.feature.children[1].rule.children[0].scenario.steps[1];
            const example2When = gherkinDocument.feature.children[1].rule.children[1].scenario.steps[0];
            const example2Then = gherkinDocument.feature.children[1].rule.children[1].scenario.steps[1];
            (0, chai_1.expect)(output).to.eql({
                [backgroundStep.id]: backgroundStep,
                [example1When.id]: example1When,
                [example1Then.id]: example1Then,
                [example2When.id]: example2When,
                [example2Then.id]: example2Then,
            });
        });
        (0, mocha_1.it)('works for a Background and Rule with its own Background and Examples', async () => {
            // Arrange
            const gherkinDocument = await withBackgroundAndRuleWithBackgroundAndExamples();
            // Act
            const output = (0, gherkin_document_parser_1.getGherkinStepMap)(gherkinDocument);
            // Assert
            const featureBackgroundStep = gherkinDocument.feature.children[0].background.steps[0];
            const ruleBackgroundStep = gherkinDocument.feature.children[1].rule.children[0].background.steps[0];
            const example1When = gherkinDocument.feature.children[1].rule.children[1].scenario.steps[0];
            const example1Then = gherkinDocument.feature.children[1].rule.children[1].scenario.steps[1];
            const example2When = gherkinDocument.feature.children[1].rule.children[2].scenario.steps[0];
            const example2Then = gherkinDocument.feature.children[1].rule.children[2].scenario.steps[1];
            (0, chai_1.expect)(output).to.eql({
                [featureBackgroundStep.id]: featureBackgroundStep,
                [ruleBackgroundStep.id]: ruleBackgroundStep,
                [example1When.id]: example1When,
                [example1Then.id]: example1Then,
                [example2When.id]: example2When,
                [example2Then.id]: example2Then,
            });
        });
    });
    (0, mocha_1.describe)('getGherkinScenarioMap', () => {
        (0, mocha_1.it)('works for a Background and Scenario', async () => {
            // Arrange
            const gherkinDocument = await withBackgroundAndScenario();
            // Act
            const output = (0, gherkin_document_parser_1.getGherkinScenarioMap)(gherkinDocument);
            // Assert
            const scenario = gherkinDocument.feature.children[1].scenario;
            (0, chai_1.expect)(output).to.eql({
                [scenario.id]: scenario,
            });
        });
        (0, mocha_1.it)('works for a Background and Scenario Outline', async () => {
            // Arrange
            const gherkinDocument = await withBackgroundAndScenarioOutline();
            // Act
            const output = (0, gherkin_document_parser_1.getGherkinScenarioMap)(gherkinDocument);
            // Assert
            const scenario = gherkinDocument.feature.children[1].scenario;
            (0, chai_1.expect)(output).to.eql({
                [scenario.id]: scenario,
            });
        });
        (0, mocha_1.it)('works for a Background and Rule with Examples', async () => {
            // Arrange
            const gherkinDocument = await withBackgroundAndRuleWithExamples();
            // Act
            const output = (0, gherkin_document_parser_1.getGherkinScenarioMap)(gherkinDocument);
            // Assert
            const example1 = gherkinDocument.feature.children[1].rule.children[0].scenario;
            const example2 = gherkinDocument.feature.children[1].rule.children[1].scenario;
            (0, chai_1.expect)(output).to.eql({
                [example1.id]: example1,
                [example2.id]: example2,
            });
        });
        (0, mocha_1.it)('works for a Background and Rule with its own Background and Examples', async () => {
            // Arrange
            const gherkinDocument = await withBackgroundAndRuleWithBackgroundAndExamples();
            // Act
            const output = (0, gherkin_document_parser_1.getGherkinScenarioMap)(gherkinDocument);
            // Assert
            const example1 = gherkinDocument.feature.children[1].rule.children[1].scenario;
            const example2 = gherkinDocument.feature.children[1].rule.children[2].scenario;
            (0, chai_1.expect)(output).to.eql({
                [example1.id]: example1,
                [example2.id]: example2,
            });
        });
    });
    (0, mocha_1.describe)('getGherkinExampleRuleMap', () => {
        (0, mocha_1.it)('works for a Background and Scenario', async () => {
            // Arrange
            const gherkinDocument = await withBackgroundAndScenario();
            // Act
            const output = await (0, gherkin_document_parser_1.getGherkinExampleRuleMap)(gherkinDocument);
            // Assert
            (0, chai_1.expect)(output).to.eql({});
        });
        (0, mocha_1.it)('works for a Background and Scenario Outline', async () => {
            // Arrange
            const gherkinDocument = await withBackgroundAndScenarioOutline();
            // Act
            const output = await (0, gherkin_document_parser_1.getGherkinExampleRuleMap)(gherkinDocument);
            // Assert
            (0, chai_1.expect)(output).to.eql({});
        });
        (0, mocha_1.it)('works for a Background and Rule with Examples', async () => {
            // Arrange
            const gherkinDocument = await withBackgroundAndRuleWithExamples();
            // Act
            const output = await (0, gherkin_document_parser_1.getGherkinExampleRuleMap)(gherkinDocument);
            // Assert
            const rule = gherkinDocument.feature.children[1].rule;
            const example1 = rule.children[0].scenario;
            const example2 = rule.children[1].scenario;
            (0, chai_1.expect)(output).to.eql({
                [example1.id]: rule,
                [example2.id]: rule,
            });
        });
        (0, mocha_1.it)('works for a Background and Rule with its own Background and Examples', async () => {
            // Arrange
            const gherkinDocument = await withBackgroundAndRuleWithBackgroundAndExamples();
            // Act
            const output = await (0, gherkin_document_parser_1.getGherkinExampleRuleMap)(gherkinDocument);
            // Assert
            const rule = gherkinDocument.feature.children[1].rule;
            const example1 = rule.children[1].scenario;
            const example2 = rule.children[2].scenario;
            (0, chai_1.expect)(output).to.eql({
                [example1.id]: rule,
                [example2.id]: rule,
            });
        });
    });
    (0, mocha_1.describe)('getGherkinScenarioLocationMap', () => {
        (0, mocha_1.it)('works for a Background and Scenario', async () => {
            // Arrange
            const gherkinDocument = await withBackgroundAndScenario();
            // Act
            const output = await (0, gherkin_document_parser_1.getGherkinScenarioLocationMap)(gherkinDocument);
            // Assert
            const scenario = gherkinDocument.feature.children[1].scenario;
            (0, chai_1.expect)(output).to.eql({
                [scenario.id]: scenario.location,
            });
        });
        (0, mocha_1.it)('works for a Background and Scenario Outline', async () => {
            // Arrange
            const gherkinDocument = await withBackgroundAndScenarioOutline();
            // Act
            const output = await (0, gherkin_document_parser_1.getGherkinScenarioLocationMap)(gherkinDocument);
            // Assert
            const scenario = gherkinDocument.feature.children[1].scenario;
            const row1 = scenario.examples[0].tableBody[0];
            const row2 = scenario.examples[0].tableBody[1];
            (0, chai_1.expect)(output).to.eql({
                [scenario.id]: scenario.location,
                [row1.id]: row1.location,
                [row2.id]: row2.location,
            });
        });
        (0, mocha_1.it)('works for a Background and Rule with Examples', async () => {
            // Arrange
            const gherkinDocument = await withBackgroundAndRuleWithExamples();
            // Act
            const output = await (0, gherkin_document_parser_1.getGherkinScenarioLocationMap)(gherkinDocument);
            // Assert
            const example1 = gherkinDocument.feature.children[1].rule.children[0].scenario;
            const example2 = gherkinDocument.feature.children[1].rule.children[1].scenario;
            (0, chai_1.expect)(output).to.eql({
                [example1.id]: example1.location,
                [example2.id]: example2.location,
            });
        });
        (0, mocha_1.it)('works for a Background and Rule with its own Background and Examples', async () => {
            // Arrange
            const gherkinDocument = await withBackgroundAndRuleWithBackgroundAndExamples();
            // Act
            const output = await (0, gherkin_document_parser_1.getGherkinScenarioLocationMap)(gherkinDocument);
            // Assert
            const example1 = gherkinDocument.feature.children[1].rule.children[1].scenario;
            const example2 = gherkinDocument.feature.children[1].rule.children[2].scenario;
            (0, chai_1.expect)(output).to.eql({
                [example1.id]: example1.location,
                [example2.id]: example2.location,
            });
        });
    });
});
async function parseGherkinDocument(data) {
    const parsed = await (0, gherkin_helpers_1.parse)({
        data,
        uri: 'features/a.feature',
    });
    return parsed.gherkinDocument;
}
async function withBackgroundAndScenario() {
    return await parseGherkinDocument((0, reindent_template_literals_1.reindent)(`
      Feature: a feature
        Background:
          Given a setup step

        Scenario:
          When a regular step
    `));
}
async function withBackgroundAndScenarioOutline() {
    return await parseGherkinDocument((0, reindent_template_literals_1.reindent)(`
      Feature: a feature
        Background:
          Given a setup step

        Scenario Outline:
          When a templated step with <word>
        Examples:
          | word |
          | foo  |
          | bar  |
    `));
}
async function withBackgroundAndRuleWithExamples() {
    return await parseGherkinDocument((0, reindent_template_literals_1.reindent)(`
      Feature: a feature
        Background:
          Given a setup step

        Rule: a rule
          Example: an example
            When a regular step
            Then an assertion

          Example: another example
            When a regular step
            Then an assertion
    `));
}
async function withBackgroundAndRuleWithBackgroundAndExamples() {
    return await parseGherkinDocument((0, reindent_template_literals_1.reindent)(`
      Feature: a feature
        Background:
          Given a feature-level setup step

        Rule: a rule
          Background:
            Given a rule-level setup step

          Example: an example
            When a regular step
            Then an assertion

          Example: another example
            When a regular step
            Then an assertion
    `));
}
//# sourceMappingURL=gherkin_document_parser_spec.js.map