"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const messages_1 = require("@cucumber/messages");
const stopwatch_1 = require("./stopwatch");
(0, mocha_1.describe)('stopwatch', () => {
    (0, mocha_1.it)('returns a duration between the start and stop', async () => {
        const stopwatch = (0, stopwatch_1.create)();
        stopwatch.start();
        await new Promise((resolve) => setTimeout(resolve, 1200));
        stopwatch.stop();
        (0, chai_1.expect)(messages_1.TimeConversion.durationToMilliseconds(stopwatch.duration())).to.be.closeTo(1200, 50);
    });
    (0, mocha_1.it)('accounts for an initial duration', async () => {
        const stopwatch = (0, stopwatch_1.create)(messages_1.TimeConversion.millisecondsToDuration(300));
        stopwatch.start();
        await new Promise((resolve) => setTimeout(resolve, 200));
        stopwatch.stop();
        (0, chai_1.expect)(messages_1.TimeConversion.durationToMilliseconds(stopwatch.duration())).to.be.closeTo(500, 50);
    });
    (0, mocha_1.it)('returns accurate durations ad-hoc if not stopped', async () => {
        const stopwatch = (0, stopwatch_1.create)();
        stopwatch.start();
        await new Promise((resolve) => setTimeout(resolve, 200));
        (0, chai_1.expect)(messages_1.TimeConversion.durationToMilliseconds(stopwatch.duration())).to.be.closeTo(200, 50);
        await new Promise((resolve) => setTimeout(resolve, 200));
        stopwatch.stop();
        (0, chai_1.expect)(messages_1.TimeConversion.durationToMilliseconds(stopwatch.duration())).to.be.closeTo(400, 50);
    });
    (0, mocha_1.it)('returns 0 duration if never started', async () => {
        const stopwatch = (0, stopwatch_1.create)();
        await new Promise((resolve) => setTimeout(resolve, 200));
        stopwatch.stop();
        (0, chai_1.expect)(messages_1.TimeConversion.durationToMilliseconds(stopwatch.duration())).to.eq(0);
    });
    (0, mocha_1.it)('returns a timestamp close to now', () => {
        (0, chai_1.expect)(messages_1.TimeConversion.timestampToMillisecondsSinceEpoch((0, stopwatch_1.timestamp)())).to.be.closeTo(Date.now(), 100);
    });
});
//# sourceMappingURL=stopwatch_spec.js.map