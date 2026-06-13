"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const test_run_scope_1 = require("./test_run_scope");
describe('testRunScope', () => {
    it('provides a proxy to the context that works when running a test run hook', async () => {
        const context = {
            parameters: {
                foo: 1,
                bar: 2,
            },
        };
        await (0, test_run_scope_1.runInTestRunScope)({ context }, () => {
            // simple property access
            (0, chai_1.expect)(test_run_scope_1.contextProxy.parameters.foo).to.eq(1);
            test_run_scope_1.contextProxy.parameters.foo = 'baz';
            (0, chai_1.expect)(test_run_scope_1.contextProxy.parameters.foo).to.eq('baz');
        });
    });
});
//# sourceMappingURL=test_run_scope_spec.js.map