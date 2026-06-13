"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const time_1 = require("./time");
(0, mocha_1.describe)('wrapPromiseWithTimeout()', () => {
    (0, mocha_1.describe)('promise times out (default timeout message)', () => {
        (0, mocha_1.it)('rejects the promise', async () => {
            // Arrange
            const promise = new Promise((resolve) => {
                setTimeout(resolve, 50);
            });
            // Act
            let error = null;
            try {
                await (0, time_1.wrapPromiseWithTimeout)(promise, 25);
            }
            catch (e) {
                error = e;
            }
            // Assert
            (0, chai_1.expect)(error).to.exist();
            (0, chai_1.expect)(error.message).to.eql('Action did not complete within 25 milliseconds');
        });
    });
    (0, mocha_1.describe)('promise times out (supplied timeout message)', () => {
        (0, mocha_1.it)('rejects the promise', async () => {
            // Arrange
            const promise = new Promise((resolve) => {
                setTimeout(resolve, 50);
            });
            // Act
            let error = null;
            try {
                await (0, time_1.wrapPromiseWithTimeout)(promise, 25, 'custom timeout message');
            }
            catch (e) {
                error = e;
            }
            // Assert
            (0, chai_1.expect)(error).to.exist();
            (0, chai_1.expect)(error.message).to.eql('custom timeout message');
        });
    });
    (0, mocha_1.describe)('promise does not time out', () => {
        (0, mocha_1.it)('resolves the promise', async () => {
            // Arrange
            const promise = new Promise((resolve) => {
                setTimeout(() => resolve('value'), 10);
            });
            // Act
            const result = await (0, time_1.wrapPromiseWithTimeout)(promise, 25);
            // Assert
            (0, chai_1.expect)(result).to.eql('value');
        });
    });
});
//# sourceMappingURL=time_spec.js.map