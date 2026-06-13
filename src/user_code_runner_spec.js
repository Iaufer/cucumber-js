"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const semver_1 = __importDefault(require("semver"));
const user_code_runner_1 = __importDefault(require("./user_code_runner"));
async function testUserCodeRunner(opts) {
    return await user_code_runner_1.default.run({
        argsArray: [],
        fn: () => 'result',
        thisArg: {},
        timeoutInMilliseconds: 100,
        ...opts,
    });
}
(0, mocha_1.describe)('UserCodeRunner', () => {
    (0, mocha_1.describe)('run()', () => {
        (0, mocha_1.describe)('function uses synchronous interface', () => {
            (0, mocha_1.describe)('function throws serializable error', () => {
                (0, mocha_1.it)('returns the error', async function () {
                    // Arrange
                    const fn = function () {
                        throw 'error';
                    };
                    // Act
                    const { error, result } = await testUserCodeRunner({ fn });
                    // Assert
                    (0, chai_1.expect)(error).to.eql('error');
                    (0, chai_1.expect)(result).to.eql(undefined);
                });
            });
            (0, mocha_1.describe)('function throws non-serializable error', () => {
                (0, mocha_1.it)('returns the error', async function () {
                    // Arrange
                    const fn = function () {
                        const error = {};
                        error.loop = error;
                        throw error;
                    };
                    // Act
                    const { error, result } = await testUserCodeRunner({ fn });
                    // Assert
                    if (semver_1.default.satisfies(process.version, '>=14.0.0')) {
                        (0, chai_1.expect)(error).to.eql('<ref *1> { loop: [Circular *1] }');
                    }
                    else {
                        (0, chai_1.expect)(error).to.eql('{ loop: [Circular] }');
                    }
                    (0, chai_1.expect)(result).to.eql(undefined);
                });
            });
            (0, mocha_1.describe)('function returns', () => {
                (0, mocha_1.it)('returns the return value of the function', async function () {
                    // Arrange
                    const fn = function () {
                        return 'result';
                    };
                    // Act
                    const { error, result } = await testUserCodeRunner({ fn });
                    // Assert
                    (0, chai_1.expect)(error).to.eql(undefined);
                    (0, chai_1.expect)(result).to.eql('result');
                });
            });
        });
        (0, mocha_1.describe)('function uses callback interface', () => {
            (0, mocha_1.describe)('function asynchronously throws', () => {
                // Cannot unit test because mocha also sets an uncaught exception handler
            });
            (0, mocha_1.describe)('function calls back with serializable error', () => {
                (0, mocha_1.it)('returns the error', async function () {
                    // Arrange
                    const fn = function (callback) {
                        setTimeout(() => {
                            callback('error');
                        }, 25);
                    };
                    // Act
                    const { error, result } = await testUserCodeRunner({ fn });
                    // Assert
                    (0, chai_1.expect)(error).to.eql('error');
                    (0, chai_1.expect)(result).to.eql(undefined);
                });
            });
            (0, mocha_1.describe)('function calls back with non-serializable error', () => {
                (0, mocha_1.it)('returns the error', async function () {
                    // Arrange
                    const fn = function (callback) {
                        const error = {};
                        error.loop = error;
                        setTimeout(() => {
                            callback(error);
                        }, 25);
                    };
                    // Act
                    const { error, result } = await testUserCodeRunner({ fn });
                    // Assert
                    if (semver_1.default.satisfies(process.version, '>=14.0.0')) {
                        (0, chai_1.expect)(error).to.eql('<ref *1> { loop: [Circular *1] }');
                    }
                    else {
                        (0, chai_1.expect)(error).to.eql('{ loop: [Circular] }');
                    }
                    (0, chai_1.expect)(result).to.eql(undefined);
                });
            });
            (0, mocha_1.describe)('function calls back with result', () => {
                (0, mocha_1.it)('returns the what the function calls back with', async function () {
                    // Arrange
                    const fn = function (callback) {
                        setTimeout(() => {
                            callback(null, 'result');
                        }, 25);
                    };
                    // Act
                    const { error, result } = await testUserCodeRunner({ fn });
                    // Assert
                    (0, chai_1.expect)(error).to.eql(undefined);
                    (0, chai_1.expect)(result).to.eql('result');
                });
            });
            (0, mocha_1.describe)('function times out', () => {
                (0, mocha_1.it)('returns timeout as an error', async function () {
                    // Arrange
                    const fn = function (callback) {
                        setTimeout(() => {
                            callback(null, 'result');
                        }, 200);
                    };
                    // Act
                    const { error, result } = await testUserCodeRunner({ fn });
                    // Assert
                    (0, chai_1.expect)(error).to.be.instanceof(Error);
                    (0, chai_1.expect)(error.message).to.eql('function timed out, ensure the callback is executed within 100 milliseconds');
                    (0, chai_1.expect)(result).to.eql(undefined);
                });
            });
            (0, mocha_1.describe)('timeout of -1', () => {
                (0, mocha_1.it)('disables timeout protection', async function () {
                    // Arrange
                    const fn = function (callback) {
                        setTimeout(() => {
                            callback(null, 'result');
                        }, 200);
                    };
                    // Act
                    const { error, result } = await testUserCodeRunner({
                        fn,
                        timeoutInMilliseconds: -1,
                    });
                    // Assert
                    (0, chai_1.expect)(error).to.eql(undefined);
                    (0, chai_1.expect)(result).to.eql('result');
                });
            });
        });
        (0, mocha_1.describe)('function uses promise interface', () => {
            (0, mocha_1.describe)('function asynchronously throws', () => {
                // Cannot unit test because mocha also sets an uncaught exception handler
            });
            (0, mocha_1.describe)('promise resolves', () => {
                (0, mocha_1.it)('returns what the promise resolves to', async function () {
                    // Arrange
                    const fn = async function () {
                        return 'result';
                    };
                    // Act
                    const { error, result } = await testUserCodeRunner({ fn });
                    // Assert
                    (0, chai_1.expect)(error).to.eql(undefined);
                    (0, chai_1.expect)(result).to.eql('result');
                });
            });
            (0, mocha_1.describe)('promise rejects with reason', () => {
                (0, mocha_1.it)('returns what the promise rejects as an error', async function () {
                    // Arrange
                    const fn = async function () {
                        throw 'error';
                    };
                    // Act
                    const { error, result } = await testUserCodeRunner({ fn });
                    // Assert
                    (0, chai_1.expect)(error).to.eql('error');
                    (0, chai_1.expect)(result).to.eql(undefined);
                });
            });
            (0, mocha_1.describe)('promise rejects without reason', () => {
                (0, mocha_1.it)('returns a helpful error message', async function () {
                    // Arrange
                    const fn = async function () {
                        return await Promise.reject();
                    };
                    // Act
                    const { error, result } = await testUserCodeRunner({ fn });
                    // Assert
                    (0, chai_1.expect)(error).to.be.instanceOf(Error);
                    (0, chai_1.expect)(error.message).to.eql('Promise rejected without a reason');
                    (0, chai_1.expect)(result).to.eql(undefined);
                });
            });
            (0, mocha_1.describe)('promise times out', function () {
                (0, mocha_1.it)('returns timeout as an error', async function () {
                    // Arrange
                    const fn = async function () {
                        return await new Promise((resolve) => {
                            setTimeout(() => resolve('result'), 200);
                        });
                    };
                    // Act
                    const { error, result } = await testUserCodeRunner({ fn });
                    // Assert
                    (0, chai_1.expect)(error).to.be.instanceof(Error);
                    (0, chai_1.expect)(error.message).to.eql('function timed out, ensure the promise resolves within 100 milliseconds');
                    (0, chai_1.expect)(result).to.eql(undefined);
                });
            });
            (0, mocha_1.describe)('timeout of -1', () => {
                (0, mocha_1.it)('disables timeout protection', async function () {
                    // Arrange
                    const fn = async function () {
                        return await new Promise((resolve) => {
                            setTimeout(() => resolve('result'), 200);
                        });
                    };
                    // Act
                    const { error, result } = await testUserCodeRunner({
                        fn,
                        timeoutInMilliseconds: -1,
                    });
                    // Assert
                    (0, chai_1.expect)(error).to.eql(undefined);
                    (0, chai_1.expect)(result).to.eql('result');
                });
            });
        });
        (0, mocha_1.describe)('function uses multiple asynchronous interfaces: callback and promise', () => {
            (0, mocha_1.it)('returns an error that multiple interface are used', async function () {
                // Arrange
                const fn = async function (callback) {
                    callback();
                    return await Promise.resolve();
                };
                // Act
                const { error, result } = await testUserCodeRunner({ fn });
                // Assert
                (0, chai_1.expect)(error).to.be.instanceof(Error);
                (0, chai_1.expect)(error.message).to.eql('function uses multiple asynchronous interfaces: callback and promise\n' +
                    'to use the callback interface: do not return a promise\n' +
                    'to use the promise interface: remove the last argument to the function');
                (0, chai_1.expect)(result).to.eql(undefined);
            });
        });
    });
});
//# sourceMappingURL=user_code_runner_spec.js.map