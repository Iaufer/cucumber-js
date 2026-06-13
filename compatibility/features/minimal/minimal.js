"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const src_1 = require("../../../src");
(0, src_1.Given)('I have {int} cukes in my belly', function (cukeCount) {
    (0, node_assert_1.default)(cukeCount);
});
//# sourceMappingURL=minimal.js.map