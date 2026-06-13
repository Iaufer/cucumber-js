"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_util_1 = require("node:util");
const chai_1 = require("chai");
const format_error_1 = require("./format_error");
describe('formatError', () => {
    describe('type and message', () => {
        function testFormatError(fn) {
            try {
                fn();
                return undefined;
            }
            catch (error) {
                const { exception: { type, message }, } = (0, format_error_1.formatError)(error, false);
                return { type, message };
            }
        }
        it('should handle a custom error', () => {
            (0, chai_1.expect)(testFormatError(() => {
                node_assert_1.default.ok(false, 'Thing that should have been truthy was falsy!');
            })).to.eql({
                type: 'AssertionError',
                message: 'Thing that should have been truthy was falsy!',
            });
        });
        it('should handle a generic error', () => {
            (0, chai_1.expect)(testFormatError(() => {
                throw new Error('A generally bad thing happened!');
            })).to.eql({
                type: 'Error',
                message: 'A generally bad thing happened!',
            });
        });
        it('should handle an omitted message', () => {
            (0, chai_1.expect)(testFormatError(() => {
                throw new Error();
            })).to.eql({
                type: 'Error',
                message: '',
            });
        });
        it('should handle a thrown string', () => {
            (0, chai_1.expect)(testFormatError(() => {
                throw 'Yikes!';
            })).to.eql({
                type: 'Error',
                message: 'Yikes!',
            });
        });
    });
    describe('stack traces', () => {
        ;
        [false, true].forEach((filterStackTraces) => {
            describe('with filterStackTraces=' + filterStackTraces, () => {
                function testFormatError(fn) {
                    try {
                        fn();
                        return undefined;
                    }
                    catch (error) {
                        const { exception: { stackTrace }, } = (0, format_error_1.formatError)(error, filterStackTraces);
                        return stackTrace;
                    }
                }
                it('should handle a custom error', () => {
                    const result = testFormatError(() => {
                        node_assert_1.default.ok(false, 'Thing that should have been truthy was falsy!');
                    });
                    (0, chai_1.expect)(result).to.have.string(' at ');
                    (0, chai_1.expect)(result).to.have.string('AssertionError');
                    (0, chai_1.expect)(result).to.have.string('Thing that should have been truthy was falsy!');
                });
                it('should handle a generic error', () => {
                    const result = testFormatError(() => {
                        throw new Error('A generally bad thing happened!');
                    });
                    (0, chai_1.expect)(result).to.have.string(' at ');
                    (0, chai_1.expect)(result).to.have.string('Error: A generally bad thing happened!');
                });
                it('should handle an assertion error', () => {
                    const result = testFormatError(() => {
                        node_assert_1.default.equal(1, 2, 'number go up');
                    });
                    const sanitised = (0, node_util_1.stripVTControlCharacters)(result);
                    (0, chai_1.expect)(sanitised).to.have.string('number go up');
                    (0, chai_1.expect)(sanitised).to.have.string('+ expected');
                    (0, chai_1.expect)(sanitised).to.have.string('- actual');
                    (0, chai_1.expect)(sanitised).to.have.string('-1');
                    (0, chai_1.expect)(sanitised).to.have.string('+2');
                });
                it('should handle an omitted message', () => {
                    const result = testFormatError(() => {
                        throw new Error();
                    });
                    (0, chai_1.expect)(result).to.have.string(' at ');
                    (0, chai_1.expect)(result).to.have.string('{}');
                });
                it('should handle a thrown string', () => {
                    const result = testFormatError(() => {
                        throw 'Yikes!';
                    });
                    (0, chai_1.expect)(result).to.eq('Error: Yikes!');
                });
            });
        });
    });
});
//# sourceMappingURL=format_error_spec.js.map