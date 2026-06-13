"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const chai_1 = require("chai");
const __1 = require("../../");
(0, __1.Then)('it outputs the usage data:', function (table) {
    const usageData = JSON.parse(this.lastRun.output);
    table.hashes().forEach((row) => {
        const rowUsage = usageData.find((datum) => datum.pattern === row.PATTERN && datum.patternType === row.PATTERN_TYPE);
        (0, chai_1.expect)(rowUsage).to.be.an('object');
        (0, chai_1.expect)(rowUsage.line).to.eql(parseInt(row.LINE));
        (0, chai_1.expect)(rowUsage.matches).to.have.lengthOf(Number(row['NUMBER OF MATCHES']));
        (0, chai_1.expect)(rowUsage.uri).to.eql(node_path_1.default.normalize(row.URI));
    });
});
//# sourceMappingURL=usage_json_steps.js.map