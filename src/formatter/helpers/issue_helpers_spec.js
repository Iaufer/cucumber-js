"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_stream_1 = require("node:stream");
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const figures_1 = __importDefault(require("figures"));
const reindent_template_literals_1 = require("reindent-template-literals");
const formatter_helpers_1 = require("../../../test/formatter_helpers");
const get_color_fns_1 = __importDefault(require("../get_color_fns"));
const steps_1 = require("../../../test/fixtures/steps");
const builder_1 = __importDefault(require("../builder"));
const issue_helpers_1 = require("./issue_helpers");
async function testFormatIssue(sourceData, printAttachments = true) {
    const sources = [
        {
            data: sourceData,
            uri: 'a.feature',
        },
    ];
    const supportCodeLibrary = (0, steps_1.getBaseSupportCodeLibrary)();
    const [testCaseAttempt] = await (0, formatter_helpers_1.getTestCaseAttempts)({
        sources,
        supportCodeLibrary,
    });
    return (0, issue_helpers_1.formatIssue)({
        colorFns: (0, get_color_fns_1.default)(new node_stream_1.PassThrough(), {}, false),
        number: 1,
        snippetBuilder: await builder_1.default.getStepDefinitionSnippetBuilder({
            cwd: 'project/',
            supportCodeLibrary,
        }),
        supportCodeLibrary,
        testCaseAttempt,
        printAttachments,
    });
}
(0, mocha_1.describe)('IssueHelpers', () => {
    (0, mocha_1.describe)('formatIssue', () => {
        (0, mocha_1.describe)('with a failed step', () => {
            (0, mocha_1.it)('prints the scenario', async () => {
                // Arrange
                const sourceData = (0, reindent_template_literals_1.reindent)(`
          Feature: my feature
            Scenario: my scenario
              Given a passing step
              When a failing step
              Then a passing step
          `);
                // Act
                const output = await testFormatIssue(sourceData);
                // Assert
                (0, chai_1.expect)(output).to.eql((0, reindent_template_literals_1.reindent)(`
            1) Scenario: my scenario # a.feature:2
               ${figures_1.default.tick} Given a passing step # steps.ts:29
               ${figures_1.default.cross} When a failing step # steps.ts:9
                   Error: error
               - Then a passing step # steps.ts:29


          `));
            });
        });
        (0, mocha_1.describe)('with an ambiguous step', () => {
            (0, mocha_1.it)('returns the formatted scenario', async () => {
                // Arrange
                const sourceData = (0, reindent_template_literals_1.reindent)(`
          Feature: my feature
            Scenario: my scenario
              Given a passing step
              When an ambiguous step
              Then a passing step
          `);
                // Act
                const output = await testFormatIssue(sourceData);
                // Assert
                (0, chai_1.expect)(output).to.eql((0, reindent_template_literals_1.reindent)(`
            1) Scenario: my scenario # a.feature:2
               ${figures_1.default.tick} Given a passing step # steps.ts:29
               ${figures_1.default.cross} When an ambiguous step
               - Then a passing step # steps.ts:29


          `));
            });
        });
        (0, mocha_1.describe)('with an undefined step', () => {
            (0, mocha_1.it)('returns the formatted scenario', async () => {
                // Arrange
                const sourceData = (0, reindent_template_literals_1.reindent)(`
          Feature: my feature
            Scenario: my scenario
              Given a passing step
              When an undefined step
              Then a passing step
          `);
                // Act
                const output = await testFormatIssue(sourceData);
                // Assert
                (0, chai_1.expect)(output).to.eql((0, reindent_template_literals_1.reindent)(`
            1) Scenario: my scenario # a.feature:2
               ${figures_1.default.tick} Given a passing step # steps.ts:29
               ? When an undefined step
                   Undefined. Implement with the following snippet:

                     When('an undefined step', function () {
                       // Write code here that turns the phrase above into concrete actions
                       return 'pending';
                     });

               - Then a passing step # steps.ts:29


          `));
            });
        });
        (0, mocha_1.describe)('with a pending step', () => {
            (0, mocha_1.it)('returns the formatted scenario', async () => {
                // Arrange
                const sourceData = (0, reindent_template_literals_1.reindent)(`
          Feature: my feature
            Scenario: my scenario
              Given a passing step
              When a pending step
              Then a passing step
          `);
                // Act
                const output = await testFormatIssue(sourceData);
                // Assert
                (0, chai_1.expect)(output).to.eql((0, reindent_template_literals_1.reindent)(`
            1) Scenario: my scenario # a.feature:2
               ${figures_1.default.tick} Given a passing step # steps.ts:29
               ? When a pending step # steps.ts:16
                   Pending
               - Then a passing step # steps.ts:29


          `));
            });
        });
        (0, mocha_1.describe)('step with data table', () => {
            (0, mocha_1.it)('returns the formatted scenario', async () => {
                // Arrange
                const sourceData = (0, reindent_template_literals_1.reindent)(`
          Feature: my feature
            Scenario: my scenario
              Given a passing step
              When a pending step
              Then a passing step
                |aaa|b|c|
                |d|e|ff|
                |gg|h|iii|
          `);
                // Act
                const output = await testFormatIssue(sourceData);
                // Assert
                (0, chai_1.expect)(output).to.eql((0, reindent_template_literals_1.reindent)(`
            1) Scenario: my scenario # a.feature:2
               ${figures_1.default.tick} Given a passing step # steps.ts:29
               ? When a pending step # steps.ts:16
                   Pending
               - Then a passing step # steps.ts:29
                   | aaa | b | c   |
                   | d   | e | ff  |
                   | gg  | h | iii |


          `));
            });
        });
        (0, mocha_1.describe)('step with doc string', () => {
            (0, mocha_1.it)('returns the formatted scenario', async () => {
                // Arrange
                const sourceData = (0, reindent_template_literals_1.reindent)(`
          Feature: my feature
            Scenario: my scenario
              Given a passing step
              When a pending step
              Then a passing step
                """
                this is a multiline
                doc string

                :-)
                """
          `);
                // Act
                const output = await testFormatIssue(sourceData);
                // Assert
                (0, chai_1.expect)(output).to.eql((0, reindent_template_literals_1.reindent)(`
            1) Scenario: my scenario # a.feature:2
               ${figures_1.default.tick} Given a passing step # steps.ts:29
               ? When a pending step # steps.ts:16
                   Pending
               - Then a passing step # steps.ts:29
                   """
                   this is a multiline
                   doc string

                   :-)
                   """


            `));
            });
        });
        (0, mocha_1.describe)('step with attachment text', () => {
            (0, mocha_1.it)('prints the scenario', async () => {
                // Arrange
                const sourceData = (0, reindent_template_literals_1.reindent)(`
          Feature: my feature
            Scenario: my scenario
              Given attachment step1
              When attachment step2
              Then a passing step
          `);
                // Act
                const output = await testFormatIssue(sourceData);
                // Assert
                (0, chai_1.expect)(output).to.eql((0, reindent_template_literals_1.reindent)(`
            1) Scenario: my scenario # a.feature:2
               ${figures_1.default.tick} Given attachment step1 # steps.ts:35
                   Attachment (text/plain): Some info
                   Attachment (application/json)
                   Attachment (image/png): screenshot.png
               ${figures_1.default.cross} When attachment step2 # steps.ts:44
                   Attachment (text/plain): Other info
                   Error: error
               - Then a passing step # steps.ts:29


          `));
            });
            (0, mocha_1.describe)('when it is requested to not print attachments', () => {
                (0, mocha_1.it)('does not output attachment', async () => {
                    // Arrange
                    const sourceData = (0, reindent_template_literals_1.reindent)(`
            Feature: my feature
              Scenario: my scenario
                Given attachment step1
                When attachment step2
                Then a passing step
          `);
                    // Act
                    const output = await testFormatIssue(sourceData, false);
                    // Assert
                    (0, chai_1.expect)(output).to.eql((0, reindent_template_literals_1.reindent)(`
              1) Scenario: my scenario # a.feature:2
                 ${figures_1.default.tick} Given attachment step1 # steps.ts:35
                 ${figures_1.default.cross} When attachment step2 # steps.ts:44
                     Error: error
                 - Then a passing step # steps.ts:29


            `));
                });
            });
        });
    });
});
//# sourceMappingURL=issue_helpers_spec.js.map