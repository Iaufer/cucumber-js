"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const node_stream_1 = require("node:stream");
const promises_1 = require("node:stream/promises");
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const chai_exclude_1 = __importDefault(require("chai-exclude"));
const glob_1 = require("glob");
const messageStreams = __importStar(require("@cucumber/message-streams"));
const formatter_output_helpers_1 = require("../features/support/formatter_output_helpers");
const api_1 = require("../src/api");
const PROJECT_PATH = node_path_1.default.join(__dirname, '..');
const CCK_FEATURES_PATH = 'node_modules/@cucumber/compatibility-kit/features';
const CCK_IMPLEMENTATIONS_PATH = 'compatibility/features';
const UNSUPPORTED = [
    // not a test sample
    'all-statuses',
    // we aren't fully compliant yet for global hooks
    'global-hooks-attachments',
    'global-hooks-beforeall-error',
    'global-hooks-afterall-error',
    // not a test sample
    'test-run-exception',
];
chai_1.config.truncateThreshold = 100;
(0, chai_1.use)(chai_exclude_1.default);
(0, mocha_1.describe)('Cucumber Compatibility Kit', () => {
    const directories = glob_1.glob.sync(`${CCK_FEATURES_PATH}/*`, { nodir: false });
    for (const directory of directories) {
        const suite = node_path_1.default.basename(directory);
        if (UNSUPPORTED.includes(suite)) {
            mocha_1.it.skip(suite, () => { });
            continue;
        }
        (0, mocha_1.it)(suite, async () => {
            const actualMessages = [];
            const stdout = new node_stream_1.PassThrough();
            const stderr = new node_stream_1.PassThrough();
            const runConfiguration = {
                sources: {
                    defaultDialect: 'en',
                    paths: [
                        `${CCK_FEATURES_PATH}/${suite}/*.feature`,
                        `${CCK_FEATURES_PATH}/${suite}/*.feature.md`,
                    ],
                    names: [],
                    tagExpression: '',
                    order: suite === 'multiple-features-reversed' ? 'reverse' : 'defined',
                    shard: '',
                },
                support: {
                    requireModules: ['ts-node/register'],
                    requirePaths: [`${CCK_IMPLEMENTATIONS_PATH}/${suite}/*.ts`],
                },
                runtime: {
                    dryRun: false,
                    failFast: false,
                    filterStacktraces: true,
                    parallel: 0,
                    retry: suite === 'retry' ? 2 : 0,
                    retryTagFilter: '',
                    strict: true,
                    worldParameters: {},
                },
                formats: {
                    stdout: 'summary',
                    files: {},
                    options: {},
                    publish: false,
                },
            };
            await (0, api_1.runCucumber)(runConfiguration, {
                cwd: PROJECT_PATH,
                stdout,
                stderr,
            }, (message) => actualMessages.push(JSON.parse(JSON.stringify(message))));
            stdout.end();
            stderr.end();
            const expectedMessages = [];
            await (0, promises_1.pipeline)(node_fs_1.default.createReadStream(node_path_1.default.join(directory, suite + '.ndjson'), {
                encoding: 'utf-8',
            }), new messageStreams.NdjsonToMessageStream(), new node_stream_1.Writable({
                objectMode: true,
                write(envelope, _, callback) {
                    expectedMessages.push(envelope);
                    callback();
                },
            }));
            (0, chai_1.expect)(reorderEnvelopes(actualMessages))
                .excludingEvery(formatter_output_helpers_1.ignorableKeys)
                .to.deep.eq(expectedMessages);
        });
    }
});
function reorderEnvelopes(envelopes) {
    let testRunStartedEnvelope;
    let testCaseStartedEnvelope;
    const result = [];
    const moveAfterTestRunStarted = [];
    for (const envelope of envelopes) {
        if (envelope.testRunStarted) {
            testRunStartedEnvelope = envelope;
        }
        if (envelope.testCaseStarted) {
            testCaseStartedEnvelope = envelope;
        }
        if ((envelope.testRunHookStarted || envelope.testRunHookFinished) &&
            !testCaseStartedEnvelope) {
            moveAfterTestRunStarted.push(envelope);
        }
        else {
            result.push(envelope);
        }
    }
    result.splice(result.indexOf(testRunStartedEnvelope) + 1, 0, ...moveAfterTestRunStarted);
    return result;
}
//# sourceMappingURL=cck_spec.js.map