"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
const tsd_1 = require("tsd");
// should allow us to read parameters and add attachments
(0, __1.Before)(async function () {
    await this.attach(this.parameters.foo);
});
(0, __1.When)('stuff happens', async function () {
    await this.attach(this.parameters.foo);
});
// should prevent reassignment of parameters
(0, tsd_1.expectError)((0, __1.Before)(async function () {
    this.parameters = null;
}));
(0, tsd_1.expectError)((0, __1.When)('stuff happens', async function () {
    this.parameters = null;
}));
// should allow us to set and get arbitrary properties
(0, __1.Before)(async function () {
    this.bar = 'baz';
    await this.log(this.baz);
});
(0, __1.When)('stuff happens', async function () {
    this.bar = 'baz';
    await this.log(this.baz);
});
// should allow us to use a custom world class
class CustomWorld extends __1.World {
    doThing() {
        return 'foo';
    }
}
(0, __1.setWorldConstructor)(CustomWorld);
(0, __1.Before)(async function () {
    this.doThing();
});
(0, __1.When)('stuff happens', async function () {
    this.doThing();
});
(0, __1.Before)(async function () {
    this.log(this.parameters.foo);
});
(0, tsd_1.expectError)((0, __1.Before)(async function () {
    this.log(this.parameters.bar);
}));
// should allow us to use a custom parameters type with a custom world
class CustomWorldWithParameters extends __1.World {
    doThing() {
        return 'foo';
    }
}
(0, __1.setWorldConstructor)(CustomWorldWithParameters);
(0, __1.Before)(async function () {
    this.log(this.parameters.foo);
});
(0, tsd_1.expectError)((0, __1.Before)(async function () {
    this.log(this.parameters.bar);
}));
//# sourceMappingURL=world.js.map