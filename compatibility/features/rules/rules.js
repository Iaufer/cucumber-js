"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const src_1 = require("../../../src");
(0, src_1.Given)('the customer has {int} cents', function (money) {
    this.money = money;
});
(0, src_1.Given)('there are chocolate bars in stock', function () {
    this.stock = ['Mars'];
});
(0, src_1.Given)('there are no chocolate bars in stock', function () {
    this.stock = [];
});
(0, src_1.When)('the customer tries to buy a {int} cent chocolate bar', function (price) {
    if (this.money >= price) {
        this.chocolate = this.stock.pop();
    }
});
(0, src_1.Then)('the sale should not happen', function () {
    node_assert_1.default.strictEqual(this.chocolate, undefined);
});
(0, src_1.Then)('the sale should happen', function () {
    node_assert_1.default.ok(this.chocolate);
});
//# sourceMappingURL=rules.js.map