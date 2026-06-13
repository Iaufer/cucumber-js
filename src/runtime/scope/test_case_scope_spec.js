"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sinon_1 = __importDefault(require("sinon"));
const chai_1 = require("chai");
const world_1 = __importDefault(require("../../support_code_library_builder/world"));
const test_case_scope_1 = require("./test_case_scope");
describe('testCaseScope', () => {
    class CustomWorld extends world_1.default {
        firstNumber = 0;
        secondNumber = 0;
        get numbers() {
            return [this.firstNumber, this.secondNumber];
        }
        sum() {
            return this.firstNumber + this.secondNumber;
        }
    }
    it('provides a proxy to the world that works when running a test case', async () => {
        const customWorld = new CustomWorld({
            attach: sinon_1.default.stub(),
            log: sinon_1.default.stub(),
            link: sinon_1.default.stub(),
            parameters: {},
        });
        const customProxy = test_case_scope_1.worldProxy;
        await (0, test_case_scope_1.runInTestCaseScope)({ world: customWorld }, () => {
            // simple property access
            customProxy.firstNumber = 1;
            customProxy.secondNumber = 2;
            (0, chai_1.expect)(customProxy.firstNumber).to.eq(1);
            (0, chai_1.expect)(customProxy.secondNumber).to.eq(2);
            // getters using internal state
            (0, chai_1.expect)(customProxy.numbers).to.deep.eq([1, 2]);
            // instance methods using internal state
            (0, chai_1.expect)(customProxy.sum()).to.eq(3);
            // enumeration
            (0, chai_1.expect)(Object.keys(customProxy)).to.deep.eq([
                'attach',
                'log',
                'link',
                'parameters',
                'firstNumber',
                'secondNumber',
            ]);
        });
    });
});
//# sourceMappingURL=test_case_scope_spec.js.map