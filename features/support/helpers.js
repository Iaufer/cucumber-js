"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeText = normalizeText;
const node_path_1 = __importDefault(require("node:path"));
const figures_1 = __importDefault(require("figures"));
const formatter_helpers_1 = require("../../test/formatter_helpers");
function normalizeText(text) {
    const normalized = (0, figures_1.default)(text)
        .replace(/\r\n|\r/g, '\n')
        .trim()
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\d+(.\d+)?ms/g, '<d>ms')
        .replace(/\//g, node_path_1.default.sep)
        .replace(/ +/g, ' ')
        .replace(/─+/gu, '─')
        .split('\n')
        .map((line) => line.trim())
        .join('\n');
    return (0, formatter_helpers_1.normalizeSummaryDuration)(normalized);
}
//# sourceMappingURL=helpers.js.map