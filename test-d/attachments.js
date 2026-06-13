"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
const tsd_1 = require("tsd");
const stream_1 = require("stream");
(0, __1.After)(async function () {
    // log
    (0, tsd_1.expectType)(this.log('things'));
    // string
    (0, tsd_1.expectType)(this.attach('stuff'));
    (0, tsd_1.expectType)(this.attach('{}', 'application/json'));
    // buffer
    (0, tsd_1.expectType)(this.attach(Buffer.from('{}'), 'application/json'));
    // stream
    (0, tsd_1.expectType)(this.attach(new stream_1.PassThrough(), 'application/json'));
    (0, tsd_1.expectType)(this.attach(new stream_1.PassThrough(), 'application/json', () => undefined));
    // buffer and stream flavours must specify media type
    (0, tsd_1.expectError)(this.attach(Buffer.from('{}')));
    (0, tsd_1.expectError)(this.attach(new stream_1.PassThrough()));
});
//# sourceMappingURL=attachments.js.map