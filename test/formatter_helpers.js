"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testFormatter = testFormatter;
exports.getTestCaseAttempts = getTestCaseAttempts;
exports.getEnvelopesAndEventDataCollector = getEnvelopesAndEventDataCollector;
exports.normalizeLegacySummaryDuration = normalizeLegacySummaryDuration;
exports.normalizeSummaryDuration = normalizeSummaryDuration;
const node_events_1 = require("node:events");
const node_stream_1 = require("node:stream");
const node_util_1 = require("node:util");
const messages_1 = require("@cucumber/messages");
const runtime_1 = require("../src/runtime");
const helpers_1 = require("../src/formatter/helpers");
const builder_1 = __importDefault(require("../src/formatter/builder"));
const value_checker_1 = require("../src/value_checker");
const emit_support_code_messages_1 = require("../src/api/emit_support_code_messages");
const gherkin_helpers_1 = require("./gherkin_helpers");
const runtime_helpers_1 = require("./runtime_helpers");
const fake_logger_1 = require("./fake_logger");
async function testFormatter({ parsedArgvOptions = {}, runtimeOptions = {}, supportCodeLibrary, sources = [], type, }) {
    if ((0, value_checker_1.doesNotHaveValue)(supportCodeLibrary)) {
        supportCodeLibrary = (0, runtime_helpers_1.buildSupportCodeLibrary)();
    }
    const eventBroadcaster = new node_events_1.EventEmitter();
    const eventDataCollector = new helpers_1.EventDataCollector(eventBroadcaster);
    (0, emit_support_code_messages_1.emitSupportCodeMessages)({
        supportCodeLibrary,
        eventBroadcaster,
        newId: messages_1.IdGenerator.uuid(),
    });
    let output = '';
    const logFn = (data) => {
        output += data;
    };
    const passThrough = new node_stream_1.PassThrough();
    await builder_1.default.build(type, {
        env: {},
        cwd: '',
        eventBroadcaster,
        eventDataCollector,
        log: logFn,
        parsedArgvOptions,
        stream: passThrough,
        cleanup: (0, node_util_1.promisify)(passThrough.end.bind(passThrough)),
        supportCodeLibrary,
    });
    let sourcedPickles = [];
    for (const source of sources) {
        const generated = await (0, gherkin_helpers_1.generatePickles)({
            data: source.data,
            eventBroadcaster,
            uri: source.uri,
        });
        sourcedPickles = sourcedPickles.concat(generated);
    }
    const runtime = await (0, runtime_1.makeRuntime)({
        environment: {},
        logger: new fake_logger_1.FakeLogger(),
        eventBroadcaster,
        sourcedPickles,
        newId: messages_1.IdGenerator.uuid(),
        supportCodeLibrary,
        options: {
            ...(0, runtime_helpers_1.buildOptions)(runtimeOptions),
            parallel: 0,
        },
        snippetOptions: {},
    });
    await runtime.run();
    return normalizeLegacySummaryDuration(output);
}
async function getTestCaseAttempts({ runtimeOptions = {}, supportCodeLibrary, sources = [], }) {
    const { eventDataCollector } = await getEnvelopesAndEventDataCollector({
        runtimeOptions,
        supportCodeLibrary,
        sources,
    });
    return eventDataCollector.getTestCaseAttempts();
}
async function getEnvelopesAndEventDataCollector({ runtimeOptions = {}, supportCodeLibrary, sources = [], pickleFilter = () => true, }) {
    if ((0, value_checker_1.doesNotHaveValue)(supportCodeLibrary)) {
        supportCodeLibrary = (0, runtime_helpers_1.buildSupportCodeLibrary)();
    }
    const eventBroadcaster = new node_events_1.EventEmitter();
    const eventDataCollector = new helpers_1.EventDataCollector(eventBroadcaster);
    const envelopes = [];
    eventBroadcaster.on('envelope', (envelope) => envelopes.push(envelope));
    (0, emit_support_code_messages_1.emitSupportCodeMessages)({
        supportCodeLibrary,
        eventBroadcaster,
        newId: messages_1.IdGenerator.uuid(),
    });
    let sourcedPickles = [];
    for (const source of sources) {
        const generated = await (0, gherkin_helpers_1.generatePickles)({
            data: source.data,
            eventBroadcaster,
            uri: source.uri,
        });
        sourcedPickles = sourcedPickles.concat(generated.filter((item) => pickleFilter(item.pickle)));
    }
    const runtime = await (0, runtime_1.makeRuntime)({
        environment: {},
        logger: new fake_logger_1.FakeLogger(),
        eventBroadcaster,
        sourcedPickles,
        newId: messages_1.IdGenerator.uuid(),
        supportCodeLibrary,
        options: {
            ...(0, runtime_helpers_1.buildOptions)(runtimeOptions),
            parallel: 0,
        },
        snippetOptions: {},
    });
    await runtime.run();
    return { envelopes, eventDataCollector };
}
function normalizeLegacySummaryDuration(output) {
    return output.replace(/\d+m\d{2}\.\d{3}s \(executing steps: \d+m\d{2}\.\d{3}s\)/, '<duration-stat>');
}
function normalizeSummaryDuration(output) {
    return output.replace(/\d+m \d+\.\d+s \(\d+m \d+\.\d+s executing your code\)/, '<duration-stat>');
}
//# sourceMappingURL=formatter_helpers.js.map