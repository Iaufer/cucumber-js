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
exports.World = void 0;
const node_child_process_1 = require("node:child_process");
const node_stream_1 = require("node:stream");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const node_util_1 = __importDefault(require("node:util"));
const node_console_1 = require("node:console");
const chai_1 = require("chai");
const stream_to_string_1 = __importDefault(require("stream-to-string"));
const messageStreams = __importStar(require("@cucumber/message-streams"));
const value_checker_1 = require("../../src/value_checker");
const __1 = require("../../");
const api_1 = require("../../lib/api");
const configuration_1 = require("../../lib/configuration");
const asyncPipeline = node_util_1.default.promisify(node_stream_1.pipeline);
class World {
    tmpDir;
    sharedEnv;
    spawn = false;
    debug = false;
    lastRun;
    verifiedLastRunError;
    localExecutablePath;
    reportServer;
    parseEnvString(str) {
        const result = {};
        if ((0, value_checker_1.doesHaveValue)(str)) {
            try {
                Object.assign(result, JSON.parse(str));
            }
            catch {
                str
                    .split(/\s+/)
                    .map((keyValue) => keyValue.split('='))
                    .forEach((pair) => (result[pair[0]] = pair[1]));
            }
        }
        return result;
    }
    async run(executablePath, inputArgs, envOverride = {}) {
        const messageFilename = 'message.ndjson';
        const args = ['node', executablePath].concat(inputArgs, [
            '--backtrace',
            '--format',
            `message:${messageFilename}`,
        ]);
        const cwd = this.tmpDir;
        let result;
        if (this.spawn) {
            const env = { ...process.env, ...this.sharedEnv, ...envOverride };
            result = await new Promise((resolve) => {
                (0, node_child_process_1.execFile)(args[0], args.slice(1), { cwd, env }, (error, stdout, stderr) => {
                    resolve({ error, stdout, stderr });
                });
            });
        }
        else {
            const stdout = new node_stream_1.PassThrough();
            const stderr = new node_stream_1.PassThrough();
            const environment = { cwd, stdout, stderr };
            let error;
            for (const key of Object.keys(envOverride)) {
                process.env[key] = envOverride[key];
            }
            try {
                const { options, configuration: argvConfiguration } = configuration_1.ArgvParser.parse(args);
                const { runConfiguration } = await (0, api_1.loadConfiguration)({
                    file: options.config,
                    profiles: options.profile,
                    provided: argvConfiguration,
                }, environment);
                const { success } = await (0, api_1.runCucumber)(runConfiguration, environment);
                if (!success) {
                    error = new Error('runCucumber was not successful');
                    error.code = 42;
                }
            }
            catch (err) {
                error = err;
            }
            finally {
                for (const key of Object.keys(envOverride)) {
                    delete process.env[key];
                }
            }
            if (error) {
                new node_console_1.Console(stderr).error(error);
            }
            stdout.end();
            stderr.end();
            result = {
                error,
                stdout: await (0, stream_to_string_1.default)(stdout),
                stderr: await (0, stream_to_string_1.default)(stderr),
            };
        }
        const envelopes = [];
        const messageOutputPath = node_path_1.default.join(cwd, messageFilename);
        if (node_fs_1.default.existsSync(messageOutputPath)) {
            await asyncPipeline(node_fs_1.default.createReadStream(messageOutputPath, { encoding: 'utf-8' }), new messageStreams.NdjsonToMessageStream(), new node_stream_1.Writable({
                objectMode: true,
                write(envelope, _, callback) {
                    envelopes.push(envelope);
                    callback();
                },
            }));
        }
        if (this.debug) {
            console.log(result.stdout + result.stderr); // eslint-disable-line no-console
        }
        this.lastRun = {
            error: result.error,
            errorOutput: result.stderr,
            envelopes,
            output: node_util_1.default.stripVTControlCharacters(result.stdout),
        };
        this.verifiedLastRunError = false;
        (0, chai_1.expect)(this.lastRun.output).to.not.include('Unhandled rejection');
    }
}
exports.World = World;
(0, __1.setWorldConstructor)(World);
//# sourceMappingURL=world.js.map