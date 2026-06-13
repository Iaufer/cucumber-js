"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const fake_timers_1 = __importDefault(require("@sinonjs/fake-timers"));
const reindent_template_literals_1 = require("reindent-template-literals");
const time_1 = __importDefault(require("../time"));
const usage_steps_1 = require("../../test/fixtures/usage_steps");
const formatter_helpers_1 = require("../../test/formatter_helpers");
(0, mocha_1.describe)('UsageFormatter', () => {
    let clock;
    (0, mocha_1.beforeEach)(() => {
        clock = fake_timers_1.default.withGlobal(time_1.default).install();
    });
    (0, mocha_1.afterEach)(() => {
        clock.uninstall();
    });
    (0, mocha_1.describe)('no step definitions', () => {
        (0, mocha_1.it)('outputs "No step definitions"', async () => {
            // Arrange
            // Act
            const output = await (0, formatter_helpers_1.testFormatter)({ type: 'usage' });
            // Assert
            (0, chai_1.expect)(output).to.eql('No step definitions');
        });
    });
    (0, mocha_1.describe)('with step definitions', () => {
        (0, mocha_1.describe)('unused', () => {
            (0, mocha_1.it)('outputs the step definitions as unused', async () => {
                // Arrange
                const supportCodeLibrary = (0, usage_steps_1.getUsageSupportCodeLibrary)(clock);
                // Act
                const output = await (0, formatter_helpers_1.testFormatter)({
                    supportCodeLibrary,
                    type: 'usage',
                });
                // Assert
                (0, chai_1.expect)(output).to.eql((0, reindent_template_literals_1.reindent)(`
            ┌────────────────┬──────────┬───────────────────┐
            │ Pattern / Text │ Duration │ Location          │
            ├────────────────┼──────────┼───────────────────┤
            │ abc            │ UNUSED   │ usage_steps.ts:11 │
            ├────────────────┼──────────┼───────────────────┤
            │ /def?/         │ UNUSED   │ usage_steps.ts:16 │
            ├────────────────┼──────────┼───────────────────┤
            │ ghi            │ UNUSED   │ usage_steps.ts:25 │
            └────────────────┴──────────┴───────────────────┘

          `));
            });
        });
        (0, mocha_1.describe)('used', () => {
            (0, mocha_1.describe)('in dry run', () => {
                (0, mocha_1.it)('outputs the step definition without durations', async () => {
                    // Arrange
                    const runtimeOptions = { dryRun: true };
                    const sources = [
                        {
                            data: 'Feature: a\nScenario: b\nWhen def\nThen de',
                            uri: 'a.feature',
                        },
                    ];
                    const supportCodeLibrary = (0, usage_steps_1.getUsageSupportCodeLibrary)(clock);
                    // Act
                    const output = await (0, formatter_helpers_1.testFormatter)({
                        runtimeOptions,
                        sources,
                        supportCodeLibrary,
                        type: 'usage',
                    });
                    // Assert
                    (0, chai_1.expect)(output).to.eql((0, reindent_template_literals_1.reindent)(`
              ┌────────────────┬──────────┬───────────────────┐
              │ Pattern / Text │ Duration │ Location          │
              ├────────────────┼──────────┼───────────────────┤
              │ abc            │ UNUSED   │ usage_steps.ts:11 │
              ├────────────────┼──────────┼───────────────────┤
              │ /def?/         │ -        │ usage_steps.ts:16 │
              │   de           │ -        │ a.feature:4       │
              │   def          │ -        │ a.feature:3       │
              ├────────────────┼──────────┼───────────────────┤
              │ ghi            │ UNUSED   │ usage_steps.ts:25 │
              └────────────────┴──────────┴───────────────────┘

            `));
                });
            });
            (0, mocha_1.describe)('not in dry run', () => {
                (0, mocha_1.it)('outputs the step definition without durations', async () => {
                    // Arrange
                    const sources = [
                        {
                            data: 'Feature: a\nScenario: b\nWhen def\nThen de',
                            uri: 'a.feature',
                        },
                    ];
                    const supportCodeLibrary = (0, usage_steps_1.getUsageSupportCodeLibrary)(clock);
                    // Act
                    const output = await (0, formatter_helpers_1.testFormatter)({
                        sources,
                        supportCodeLibrary,
                        type: 'usage',
                    });
                    // Assert
                    (0, chai_1.expect)(output).to.eql((0, reindent_template_literals_1.reindent)(`
              ┌────────────────┬──────────┬───────────────────┐
              │ Pattern / Text │ Duration │ Location          │
              ├────────────────┼──────────┼───────────────────┤
              │ /def?/         │ 1.50ms   │ usage_steps.ts:16 │
              │   def          │ 2.00ms   │ a.feature:3       │
              │   de           │ 1.00ms   │ a.feature:4       │
              ├────────────────┼──────────┼───────────────────┤
              │ abc            │ UNUSED   │ usage_steps.ts:11 │
              ├────────────────┼──────────┼───────────────────┤
              │ ghi            │ UNUSED   │ usage_steps.ts:25 │
              └────────────────┴──────────┴───────────────────┘

            `));
                });
            });
        });
    });
});
//# sourceMappingURL=usage_formatter_spec.js.map