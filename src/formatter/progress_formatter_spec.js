"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const reindent_template_literals_1 = require("reindent-template-literals");
const figures_1 = __importDefault(require("figures"));
const fake_timers_1 = __importDefault(require("@sinonjs/fake-timers"));
const formatter_helpers_1 = require("../../test/formatter_helpers");
const steps_1 = require("../../test/fixtures/steps");
const time_1 = __importDefault(require("../time"));
(0, mocha_1.describe)('ProgressFormatter', () => {
    let clock;
    (0, mocha_1.beforeEach)(() => {
        clock = fake_timers_1.default.withGlobal(time_1.default).install();
    });
    (0, mocha_1.afterEach)(() => {
        clock.uninstall();
    });
    (0, mocha_1.it)('outputs a character for each step representing the status and then prints the summary format', async () => {
        // Arrange
        const sources = [
            {
                data: (0, reindent_template_literals_1.reindent)(`
          Feature: a
            Scenario: a1
              Given an ambiguous step
            Scenario: a2
              Given a failing step
            Scenario: a3
              Given a pending step
            Scenario: a4
              Given a passing step
            Scenario: a5
              Given a skipped step
            Scenario: a6
              Given an undefined step
          `),
                uri: 'a.feature',
            },
        ];
        const supportCodeLibrary = (0, steps_1.getBaseSupportCodeLibrary)();
        // Act
        const output = await (0, formatter_helpers_1.testFormatter)({
            sources,
            supportCodeLibrary,
            type: 'progress',
        });
        // Assert
        (0, chai_1.expect)(output).to.eql((0, reindent_template_literals_1.reindent)(`
        AFP.-U

        Failures:

        1) Scenario: a1 # a.feature:2
           ${figures_1.default.cross} Given an ambiguous step

        2) Scenario: a2 # a.feature:4
           ${figures_1.default.cross} Given a failing step # steps.ts:9
               Error: error

        3) Scenario: a6 # a.feature:12
           ? Given an undefined step
               Undefined. Implement with the following snippet:

                 Given('an undefined step', function () {
                   // Write code here that turns the phrase above into concrete actions
                   return 'pending';
                 });


        Warnings:

        1) Scenario: a3 # a.feature:6
           ? Given a pending step # steps.ts:16
               Pending

        6 scenarios (1 failed, 1 ambiguous, 1 undefined, 1 pending, 1 skipped, 1 passed)
        6 steps (1 failed, 1 ambiguous, 1 undefined, 1 pending, 1 skipped, 1 passed)
        <duration-stat>

      `));
    });
    (0, mocha_1.it)('handles rule/example results', async () => {
        // Arrange
        const sources = [
            {
                data: (0, reindent_template_literals_1.reindent)(`
          Feature: feature
            Rule: rule1
              Example: example1
                Given a passing step

              Example: example2
                Given a passing step

            Rule: rule2
              Example: example1
                Given a passing step
          `),
                uri: 'a.feature',
            },
        ];
        const supportCodeLibrary = (0, steps_1.getBaseSupportCodeLibrary)();
        // Act
        const output = await (0, formatter_helpers_1.testFormatter)({
            sources,
            supportCodeLibrary,
            type: 'progress',
        });
        // Assert
        (0, chai_1.expect)(output).to.eql((0, reindent_template_literals_1.reindent)(`
        ...

        3 scenarios (3 passed)
        3 steps (3 passed)
        <duration-stat>

      `));
    });
});
//# sourceMappingURL=progress_formatter_spec.js.map