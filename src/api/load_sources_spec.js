"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const node_stream_1 = require("node:stream");
const chai_1 = require("chai");
const fs_1 = __importDefault(require("mz/fs"));
const messages_1 = require("@cucumber/messages");
const load_sources_1 = require("./load_sources");
const newId = messages_1.IdGenerator.uuid();
async function setupEnvironment() {
    const cwd = node_path_1.default.join(__dirname, '..', '..', 'tmp', `loadSources_${newId()}`);
    await fs_1.default.mkdir(node_path_1.default.join(cwd, 'features'), { recursive: true });
    await fs_1.default.writeFile(node_path_1.default.join(cwd, 'features', 'test.feature'), `@tag1
Feature: test fixture
  Scenario: one
    Given a step
    Then another step
  
  @tag2
  Scenario: two
    Given a step
    Then another step
    
  Scenario: three
    Given a step
    Then another step
    
  Scenario Outline: four with <param>
    Given a step
    Then another step\`
  Examples:
    | param |
    | foo   |
    | bar   |`);
    await fs_1.default.writeFile(node_path_1.default.join(cwd, '@rerun.txt'), 'features/test.feature:8');
    const stdout = new node_stream_1.PassThrough();
    return { cwd, stdout };
}
describe('loadSources', () => {
    it('should produce a plan with all pickles', async () => {
        const environment = await setupEnvironment();
        const { plan } = await (0, load_sources_1.loadSources)({
            defaultDialect: 'en',
            order: 'defined',
            paths: [],
            names: [],
            tagExpression: '',
            shard: '',
        }, environment);
        (0, chai_1.expect)(plan.map((planned) => ({
            ...planned,
            uri: planned.uri.replace(/\\/g, '/'),
        }))).to.deep.eq([
            {
                name: 'one',
                uri: 'features/test.feature',
                location: {
                    line: 3,
                    column: 3,
                },
            },
            {
                name: 'two',
                uri: 'features/test.feature',
                location: {
                    line: 8,
                    column: 3,
                },
            },
            {
                name: 'three',
                uri: 'features/test.feature',
                location: {
                    line: 12,
                    column: 3,
                },
            },
            {
                name: 'four with foo',
                uri: 'features/test.feature',
                location: {
                    line: 21,
                    column: 5,
                },
            },
            {
                name: 'four with bar',
                uri: 'features/test.feature',
                location: {
                    line: 22,
                    column: 5,
                },
            },
        ]);
    });
    it('should produce a plan with pickles filtered by path:line', async () => {
        const environment = await setupEnvironment();
        const { plan } = await (0, load_sources_1.loadSources)({
            defaultDialect: 'en',
            order: 'defined',
            paths: ['features/test.feature:8'],
            names: [],
            tagExpression: '',
            shard: '',
        }, environment);
        (0, chai_1.expect)(plan.map((pickle) => pickle.name)).to.deep.eq(['two']);
    });
    it('should produce a plan with pickles filtered by name', async () => {
        const environment = await setupEnvironment();
        const { plan } = await (0, load_sources_1.loadSources)({
            defaultDialect: 'en',
            order: 'defined',
            paths: [],
            names: ['two'],
            tagExpression: '',
            shard: '',
        }, environment);
        (0, chai_1.expect)(plan.map((pickle) => pickle.name)).to.deep.eq(['two']);
    });
    it('should produce a plan with pickles filtered by tags', async () => {
        const environment = await setupEnvironment();
        const { plan } = await (0, load_sources_1.loadSources)({
            defaultDialect: 'en',
            order: 'defined',
            paths: [],
            names: [],
            tagExpression: '@tag2',
            shard: '',
        }, environment);
        (0, chai_1.expect)(plan.map((pickle) => pickle.name)).to.deep.eq(['two']);
    });
    it('should produce a plan based on a rerun file', async () => {
        const environment = await setupEnvironment();
        const { plan } = await (0, load_sources_1.loadSources)({
            defaultDialect: 'en',
            order: 'defined',
            paths: ['@rerun.txt'],
            names: [],
            tagExpression: '',
            shard: '',
        }, environment);
        (0, chai_1.expect)(plan.map((pickle) => pickle.name)).to.deep.eq(['two']);
    });
});
//# sourceMappingURL=load_sources_spec.js.map