"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const chai_1 = require("chai");
const load_support_1 = require("./load_support");
const load_configuration_1 = require("./load_configuration");
const test_helpers_1 = require("./test_helpers");
describe('loadSupport', function () {
    this.timeout(10_000);
    let environment;
    beforeEach(async () => {
        environment = await (0, test_helpers_1.setupEnvironment)();
    });
    afterEach(async () => (0, test_helpers_1.teardownEnvironment)(environment));
    it('should include original paths in the returned support code library', async () => {
        const { runConfiguration } = await (0, load_configuration_1.loadConfiguration)({}, environment);
        const support = await (0, load_support_1.loadSupport)(runConfiguration, environment);
        (0, chai_1.expect)(support.originalCoordinates).to.deep.eq({
            requireModules: ['ts-node/register'],
            requirePaths: [node_path_1.default.join(environment.cwd, 'features', 'steps.ts')],
            importPaths: [],
            loaders: [],
        });
    });
});
//# sourceMappingURL=load_support_spec.js.map