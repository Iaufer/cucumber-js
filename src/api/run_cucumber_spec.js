"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messages_1 = require("@cucumber/messages");
const chai_1 = require("chai");
const run_cucumber_1 = require("./run_cucumber");
const load_support_1 = require("./load_support");
const load_configuration_1 = require("./load_configuration");
const test_helpers_1 = require("./test_helpers");
describe('runCucumber', function () {
    this.timeout(10_000);
    describe('preloading support code', () => {
        let environment;
        beforeEach(async () => {
            environment = await (0, test_helpers_1.setupEnvironment)();
        });
        afterEach(async () => (0, test_helpers_1.teardownEnvironment)(environment));
        it('should be able to load support code upfront and supply it to runCucumber', async () => {
            const messages = [];
            const { runConfiguration } = await (0, load_configuration_1.loadConfiguration)({}, environment);
            const support = await (0, load_support_1.loadSupport)(runConfiguration, environment);
            await (0, run_cucumber_1.runCucumber)({ ...runConfiguration, support }, environment, (envelope) => messages.push(envelope));
            const testStepFinishedEnvelopes = messages.filter((envelope) => envelope.testStepFinished);
            (0, chai_1.expect)(testStepFinishedEnvelopes).to.have.length(2);
            (0, chai_1.expect)(testStepFinishedEnvelopes.every((envelope) => envelope.testStepFinished.testStepResult.status ===
                messages_1.TestStepResultStatus.PASSED)).to.be.true();
        });
    });
    describe('reusing support code across runs', () => {
        let environment;
        beforeEach(async () => {
            environment = await (0, test_helpers_1.setupEnvironment)();
        });
        afterEach(async () => (0, test_helpers_1.teardownEnvironment)(environment));
        it('successfully executes 2 test runs', async () => {
            const messages = [];
            const { runConfiguration } = await (0, load_configuration_1.loadConfiguration)({}, environment);
            const { support } = await (0, run_cucumber_1.runCucumber)(runConfiguration, environment, (envelope) => messages.push(envelope));
            await (0, run_cucumber_1.runCucumber)({ ...runConfiguration, support }, environment, (envelope) => messages.push(envelope));
            const testStepFinishedEnvelopes = messages.filter((envelope) => envelope.testStepFinished);
            const testRunFinishedEnvelopes = messages.filter((envelope) => envelope.testRunFinished);
            (0, chai_1.expect)(testStepFinishedEnvelopes).to.have.length(4);
            (0, chai_1.expect)(testStepFinishedEnvelopes.every((envelope) => envelope.testStepFinished.testStepResult.status ===
                messages_1.TestStepResultStatus.PASSED)).to.be.true();
            (0, chai_1.expect)(testRunFinishedEnvelopes).to.have.length(2);
            (0, chai_1.expect)(testRunFinishedEnvelopes.every((envelope) => envelope.testRunFinished.success === true)).to.be.true();
        });
    });
});
//# sourceMappingURL=run_cucumber_spec.js.map