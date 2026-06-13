"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeLogger = void 0;
const sinon_1 = __importDefault(require("sinon"));
class FakeLogger {
    debug = sinon_1.default.fake();
    error = sinon_1.default.fake();
    warn = sinon_1.default.fake();
    info = sinon_1.default.fake();
}
exports.FakeLogger = FakeLogger;
//# sourceMappingURL=fake_logger.js.map