"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const src_1 = require("../../../src");
(0, src_1.Given)('there are {int} cucumbers', function (initialCount) {
    this.count = initialCount;
});
(0, src_1.Given)('there are {int} friends', function (initialFriends) {
    this.friends = initialFriends;
});
(0, src_1.When)('I eat {int} cucumbers', function (eatCount) {
    this.count -= eatCount;
});
(0, src_1.Then)('I should have {int} cucumbers', function (expectedCount) {
    node_assert_1.default.strictEqual(this.count, expectedCount);
});
(0, src_1.Then)('each person can eat {int} cucumbers', function (expectedShare) {
    const share = Math.floor(this.count / (1 + this.friends));
    node_assert_1.default.strictEqual(share, expectedShare);
});
//# sourceMappingURL=examples-tables.js.map