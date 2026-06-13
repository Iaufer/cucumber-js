"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const src_1 = require("../../../src");
class Flight {
    from;
    to;
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }
}
(0, src_1.defineParameterType)({
    name: 'flight',
    regexp: /([A-Z]{3})-([A-Z]{3})/,
    transformer(from, to) {
        return new Flight(from, to);
    },
});
(0, src_1.Given)('{flight} has been delayed', function (flight) {
    node_assert_1.default.strictEqual(flight.from, 'LHR');
    node_assert_1.default.strictEqual(flight.to, 'CDG');
});
//# sourceMappingURL=parameter-types.js.map