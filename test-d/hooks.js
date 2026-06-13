"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
// should allow argument-less hooks
(0, __1.BeforeAll)(function () { });
(0, __1.AfterAll)(function () { });
(0, __1.Before)(function () { });
(0, __1.After)(function () { });
(0, __1.BeforeStep)(function () { });
(0, __1.AfterStep)(function () { });
// should allow hook functions to be async
(0, __1.BeforeAll)(async function () { });
(0, __1.AfterAll)(async function () { });
(0, __1.Before)(async function () { });
(0, __1.After)(async function () { });
(0, __1.BeforeStep)(async function () { });
(0, __1.AfterStep)(async function () { });
// should allow accessing world parameters in global hooks
(0, __1.BeforeAll)(function () {
    this.parameters.foo = 1;
});
(0, __1.AfterAll)(function () {
    this.parameters.foo = 1;
});
// should allow typed arguments in hooks
(0, __1.Before)(function (param) { });
(0, __1.After)(function (param) { });
(0, __1.BeforeStep)(function (param) { });
(0, __1.AfterStep)(function (param) { });
// should allow an object with tags and/or name in hooks
(0, __1.Before)({ tags: '@foo', name: 'before hook' }, function () { });
(0, __1.After)({ tags: '@foo', name: 'after hook' }, function () { });
// should allow us to return 'skipped' from a test case hook
(0, __1.Before)(async function () {
    return 'skipped';
});
(0, __1.After)(async function () {
    return 'skipped';
});
// should allow named hooks
(0, __1.BeforeAll)({ name: 'before test run' }, function () { });
(0, __1.AfterAll)({ name: 'after test run' }, function () { });
(0, __1.Before)({ name: 'before test case' }, function () { });
(0, __1.After)({ name: 'after test case' }, function () { });
//# sourceMappingURL=hooks.js.map