"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_util_1 = require("node:util");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const tmp_1 = __importDefault(require("tmp"));
const chai_1 = require("chai");
const semver_1 = __importDefault(require("semver"));
const fake_logger_1 = require("../../test/fake_logger");
const from_file_1 = require("./from_file");
async function setup(file = 'cucumber.json', content = JSON.stringify({
    default: { paths: ['some/path/*.feature'] },
    p1: { paths: ['other/path/*.feature'] },
    p2: 'other/other/path/*.feature --no-strict',
}), packageJson = `{}`) {
    const logger = new fake_logger_1.FakeLogger();
    const cwd = await (0, node_util_1.promisify)(tmp_1.default.dir)({
        unsafeCleanup: true,
    });
    node_fs_1.default.writeFileSync(node_path_1.default.join(cwd, file), content, { encoding: 'utf-8' });
    node_fs_1.default.writeFileSync(node_path_1.default.join(cwd, 'package.json'), packageJson, {
        encoding: 'utf-8',
    });
    return { logger, cwd };
}
describe('fromFile', () => {
    it('should return empty config if no default provide and no profiles requested', async () => {
        const { logger, cwd } = await setup('cucumber.json', JSON.stringify({ p1: { paths: ['other/path/*.feature'] } }));
        const result = await (0, from_file_1.fromFile)(logger, cwd, 'cucumber.json', []);
        (0, chai_1.expect)(result).to.deep.eq({});
    });
    it('should get default config from file if no profiles requested', async () => {
        const { logger, cwd } = await setup();
        const result = await (0, from_file_1.fromFile)(logger, cwd, 'cucumber.json', []);
        (0, chai_1.expect)(result).to.deep.eq({ paths: ['some/path/*.feature'] });
    });
    it('should throw when a requested profile doesnt exist', async () => {
        const { logger, cwd } = await setup();
        try {
            await (0, from_file_1.fromFile)(logger, cwd, 'cucumber.json', ['nope']);
            chai_1.expect.fail('should have thrown');
        }
        catch (error) {
            (0, chai_1.expect)(error.message).to.eq(`Requested profile "nope" doesn't exist`);
        }
    });
    it('should get single profile config from file', async () => {
        const { logger, cwd } = await setup();
        const result = await (0, from_file_1.fromFile)(logger, cwd, 'cucumber.json', ['p1']);
        (0, chai_1.expect)(result).to.deep.eq({ paths: ['other/path/*.feature'] });
    });
    it('should merge multiple profiles config from file', async () => {
        const { logger, cwd } = await setup();
        const result = await (0, from_file_1.fromFile)(logger, cwd, 'cucumber.json', ['p1', 'p2']);
        (0, chai_1.expect)(result).to.deep.eq({
            paths: ['other/path/*.feature', 'other/other/path/*.feature'],
            strict: false,
        });
    });
    it('should throw when an object doesnt conform to the schema', async () => {
        const { logger, cwd } = await setup('cucumber.json', JSON.stringify({ p1: { paths: 4, things: 8, requireModule: 'aardvark' } }));
        try {
            await (0, from_file_1.fromFile)(logger, cwd, 'cucumber.json', ['p1']);
            chai_1.expect.fail('should have thrown');
        }
        catch (error) {
            (0, chai_1.expect)(error.message).to.eq('Profile "p1" configuration value failed schema validation: paths must be a `array` type, but the final value was: `4`. requireModule must be a `array` type, but the final value was: `"aardvark"`.');
        }
    });
    describe('supported formats', () => {
        it('should work with .mjs', async () => {
            const { logger, cwd } = await setup('cucumber.mjs', `export default {}; export const p1 = {paths: ['other/path/*.feature']}`);
            const result = await (0, from_file_1.fromFile)(logger, cwd, 'cucumber.mjs', ['p1']);
            (0, chai_1.expect)(result).to.deep.eq({ paths: ['other/path/*.feature'] });
        });
        it('should work with .mjs with default function', async () => {
            const { logger, cwd } = await setup('cucumber.mjs', `export default async function() { 
          return {
            default: { paths: ['default/path/*.feature'] },
            p1: { paths: ['p1/path/*.feature'] }
          };
        };`);
            const defaultResult = await (0, from_file_1.fromFile)(logger, cwd, 'cucumber.mjs', [
                'default',
            ]);
            (0, chai_1.expect)(defaultResult).to.deep.eq({ paths: ['default/path/*.feature'] });
        });
        it('should throw with .mjs with default function and additional static profiles', async () => {
            const { logger, cwd } = await setup('cucumber.mjs', `export default async function() { 
          return {
            default: { paths: ['default/path/*.feature'] },
            p1: { paths: ['p1/path/*.feature'] }
          };
        };
        export const p1 = { paths: ['other/p1/path/*.feature'] };
        export const p2 = { paths: ['p2/path/*.feature'] };`);
            try {
                await (0, from_file_1.fromFile)(logger, cwd, 'cucumber.mjs', ['default']);
                chai_1.expect.fail('should have thrown');
            }
            catch (error) {
                (0, chai_1.expect)(error.message).to.eq('Invalid profiles specified: if a default function definition is provided, no other static profiles should be specified');
            }
        });
        it('should work with .cjs', async () => {
            const { logger, cwd } = await setup('cucumber.cjs', `module.exports = { default: {}, p1: { paths: ['other/path/*.feature'] } }`);
            const result = await (0, from_file_1.fromFile)(logger, cwd, 'cucumber.cjs', ['p1']);
            (0, chai_1.expect)(result).to.deep.eq({ paths: ['other/path/*.feature'] });
        });
        it('should work with .js when commonjs (undeclared)', async () => {
            const { logger, cwd } = await setup('cucumber.js', `module.exports = { default: {}, p1: { paths: ['other/path/*.feature'] } }`);
            const result = await (0, from_file_1.fromFile)(logger, cwd, 'cucumber.js', ['p1']);
            (0, chai_1.expect)(result).to.deep.eq({ paths: ['other/path/*.feature'] });
        });
        it('should work with .js when commonjs (explicit)', async () => {
            const { logger, cwd } = await setup('cucumber.js', `module.exports = { default: {}, p1: { paths: ['other/path/*.feature'] } }`, JSON.stringify({ type: 'commonjs' }));
            const result = await (0, from_file_1.fromFile)(logger, cwd, 'cucumber.js', ['p1']);
            (0, chai_1.expect)(result).to.deep.eq({ paths: ['other/path/*.feature'] });
        });
        it('should work with .js when module (explicit)', async () => {
            const { logger, cwd } = await setup('cucumber.js', `export default {}; export const p1 = {paths: ['other/path/*.feature']}`, JSON.stringify({ type: 'module' }));
            const result = await (0, from_file_1.fromFile)(logger, cwd, 'cucumber.js', ['p1']);
            (0, chai_1.expect)(result).to.deep.eq({ paths: ['other/path/*.feature'] });
        });
        it('should work with .json', async () => {
            const { logger, cwd } = await setup('cucumber.json', `{ "default": {}, "p1": { "paths": ["other/path/*.feature"] } }`);
            const result = await (0, from_file_1.fromFile)(logger, cwd, 'cucumber.json', ['p1']);
            (0, chai_1.expect)(result).to.deep.eq({ paths: ['other/path/*.feature'] });
        });
        it('should work with .yaml', async () => {
            const { logger, cwd } = await setup('cucumber.yaml', `default:

p1:
  paths:
    - "other/path/*.feature"
`);
            const result = await (0, from_file_1.fromFile)(logger, cwd, 'cucumber.yaml', ['p1']);
            (0, chai_1.expect)(result).to.deep.eq({ paths: ['other/path/*.feature'] });
        });
        it('should work with .yml', async () => {
            const { logger, cwd } = await setup('cucumber.yml', `default:

p1:
  paths:
    - "other/path/*.feature"
`);
            const result = await (0, from_file_1.fromFile)(logger, cwd, 'cucumber.yml', ['p1']);
            (0, chai_1.expect)(result).to.deep.eq({ paths: ['other/path/*.feature'] });
        });
        it('should throw for an unsupported format', async () => {
            const { logger, cwd } = await setup('cucumber.foo', `{}`);
            try {
                await (0, from_file_1.fromFile)(logger, cwd, 'cucumber.foo', ['p1']);
                chai_1.expect.fail('should have thrown');
            }
            catch (error) {
                (0, chai_1.expect)(error.message).to.eq('Unsupported configuration file extension ".foo"');
            }
        });
        it('should throw when a supported format fails to load or parse', async () => {
            const { logger, cwd } = await setup('cucumber.js', `nope!`);
            try {
                await (0, from_file_1.fromFile)(logger, cwd, 'cucumber.js', ['p1']);
                chai_1.expect.fail('should have thrown');
            }
            catch (error) {
                (0, chai_1.expect)(error.message).to.eq('Configuration file "cucumber.js" failed to load/parse');
            }
        });
        describe('typescript', function () {
            if (!semver_1.default.satisfies(process.version, '>=22.0.0')) {
                return;
            }
            it('should work with .mts', async () => {
                const { logger, cwd } = await setup('cucumber.mts', `import type { IConfiguration } from '@cucumber/cucumber'

export default {}

export const p1 = {paths: ['other/path/*.feature']}`);
                const result = await (0, from_file_1.fromFile)(logger, cwd, 'cucumber.mts', ['p1']);
                (0, chai_1.expect)(result).to.deep.eq({ paths: ['other/path/*.feature'] });
            });
            it('should work with .ts', async () => {
                const { logger, cwd } = await setup('cucumber.ts', `import type { IConfiguration } from '@cucumber/cucumber'

export default {}

export const p1 = {paths: ['other/path/*.feature']}`);
                const result = await (0, from_file_1.fromFile)(logger, cwd, 'cucumber.ts', ['p1']);
                (0, chai_1.expect)(result).to.deep.eq({ paths: ['other/path/*.feature'] });
            });
            it('should work with .cts', async () => {
                const { logger, cwd } = await setup('cucumber.cts', `module.exports = { default: {}, p1: { paths: ['other/path/*.feature'] } }`);
                const result = await (0, from_file_1.fromFile)(logger, cwd, 'cucumber.cts', ['p1']);
                (0, chai_1.expect)(result).to.deep.eq({ paths: ['other/path/*.feature'] });
            });
        });
    });
});
//# sourceMappingURL=from_file_spec.js.map