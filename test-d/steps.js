"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
(0, __1.Given)('some context', async function () { });
(0, __1.When)('an action context', async function () { });
(0, __1.Then)('verification', async function () { });
(0, __1.Given)('a step that will be skipped', async function () {
    return 'skipped';
});
(0, __1.Given)('a step that we need to implement', async function () {
    return 'pending';
});
//# sourceMappingURL=steps.js.map