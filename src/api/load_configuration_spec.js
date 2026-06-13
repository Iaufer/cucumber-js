"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const test_helpers_1 = require("./test_helpers");
const load_configuration_1 = require("./load_configuration");
describe('loadConfiguration', function () {
    this.timeout(10_000);
    let environment;
    beforeEach(async () => {
        environment = await (0, test_helpers_1.setupEnvironment)();
    });
    afterEach(async () => (0, test_helpers_1.teardownEnvironment)(environment));
    it('should handle configuration directly provided as an array of strings', async () => {
        const { useConfiguration } = await (0, load_configuration_1.loadConfiguration)({ provided: ['--world-parameters', '{"foo":"bar"}'] }, environment);
        (0, chai_1.expect)(useConfiguration.worldParameters).to.deep.eq({ foo: 'bar' });
    });
    it('should handle configuration directly provided as a string', async () => {
        const { useConfiguration } = await (0, load_configuration_1.loadConfiguration)({ provided: `--world-parameters '{"foo":"bar"}'` }, environment);
        (0, chai_1.expect)(useConfiguration.worldParameters).to.deep.eq({ foo: 'bar' });
    });
    it('should skip trying to resolve from a file if `file=false`', async () => {
        const { useConfiguration } = await (0, load_configuration_1.loadConfiguration)({ file: false }, environment);
        // values from configuration file are not present
        (0, chai_1.expect)(useConfiguration.paths).to.deep.eq([]);
        (0, chai_1.expect)(useConfiguration.requireModule).to.deep.eq([]);
        (0, chai_1.expect)(useConfiguration.require).to.deep.eq([]);
    });
});
//# sourceMappingURL=load_configuration_spec.js.map