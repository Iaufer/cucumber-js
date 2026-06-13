"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentation = void 0;
const json_formatter_1 = __importDefault(require("../json_formatter"));
const rerun_formatter_1 = __importDefault(require("../rerun_formatter"));
const snippets_formatter_1 = __importDefault(require("../snippets_formatter"));
const usage_formatter_1 = __importDefault(require("../usage_formatter"));
const usage_json_formatter_1 = __importDefault(require("../usage_json_formatter"));
const summary_1 = __importDefault(require("./summary"));
const pretty_1 = __importDefault(require("./pretty"));
const progress_1 = __importDefault(require("./progress"));
const progress_bar_1 = __importDefault(require("./progress-bar"));
const message_1 = __importDefault(require("./message"));
const html_1 = __importDefault(require("./html"));
const builtin = {
    // new plugin-based formatters
    html: html_1.default,
    junit: '@cucumber/junit-xml-formatter',
    message: message_1.default,
    pretty: pretty_1.default,
    progress: progress_1.default,
    'progress-bar': progress_bar_1.default,
    summary: summary_1.default,
    // legacy class-based formatters
    json: json_formatter_1.default,
    rerun: rerun_formatter_1.default,
    snippets: snippets_formatter_1.default,
    usage: usage_formatter_1.default,
    'usage-json': usage_json_formatter_1.default,
};
exports.default = builtin;
exports.documentation = {
    // new plugin-based formatters
    html: 'Outputs a HTML report',
    junit: 'Produces a JUnit XML report',
    message: 'Emits Cucumber messages in newline-delimited JSON',
    pretty: 'Writes a rich report of the scenario and example execution as it happens',
    progress: 'Prints one character per scenario.',
    'progress-bar': 'Provides a real-time updating progress bar',
    summary: 'Summary output of feature and scenarios',
    // legacy class-based formatters
    json: json_formatter_1.default.documentation,
    rerun: rerun_formatter_1.default.documentation,
    snippets: snippets_formatter_1.default.documentation,
    usage: usage_formatter_1.default.documentation,
    'usage-json': usage_json_formatter_1.default.documentation,
};
//# sourceMappingURL=index.js.map