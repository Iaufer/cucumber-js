"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const src_1 = require("../../../src");
(0, src_1.When)('the following table is transposed:', function (table) {
    this.transposed = table.transpose();
});
(0, src_1.Then)('it should be:', function (expected) {
    (0, chai_1.expect)(this.transposed.raw()).to.deep.eq(expected.raw());
});
//# sourceMappingURL=data-tables.js.map