"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon = __importStar(require("sinon"));
const validate_node_engine_version_1 = require("./validate_node_engine_version");
describe(validate_node_engine_version_1.validateNodeEngineVersion.name, () => {
    const readPackageJSON = () => ({
        engines: {
            node: '12 || 14 || >=16',
        },
        enginesTested: {
            node: '12 || 14 || 16 || 17',
        },
    });
    it('calls the onError callback when the version is lower than any of our supported versions', () => {
        // Arrange
        const errorSpy = sinon.spy();
        const warningSpy = sinon.spy();
        // Act
        (0, validate_node_engine_version_1.validateNodeEngineVersion)('v11.1.2', errorSpy, warningSpy, readPackageJSON);
        // Assert
        (0, chai_1.expect)(errorSpy).to.have.been.calledOnceWith('Cucumber can only run on Node.js versions 12 || 14 || >=16. This Node.js version is v11.1.2');
        (0, chai_1.expect)(warningSpy).not.to.have.been.called();
    });
    it('calls the onError callback when the version is between our supported versions', () => {
        // Arrange
        const errorSpy = sinon.spy();
        const warningSpy = sinon.spy();
        (0, validate_node_engine_version_1.validateNodeEngineVersion)('v13.1.2', errorSpy, warningSpy, readPackageJSON);
        // Assert
        (0, chai_1.expect)(errorSpy).to.have.been.calledOnceWith('Cucumber can only run on Node.js versions 12 || 14 || >=16. This Node.js version is v13.1.2');
        (0, chai_1.expect)(warningSpy).not.to.have.been.called();
    });
    it('does not call onError or onWarning when the version is one of our supported versions', () => {
        // Arrange
        const errorSpy = sinon.spy();
        const warningSpy = sinon.spy();
        // Act
        (0, validate_node_engine_version_1.validateNodeEngineVersion)('v17.1.2', errorSpy, warningSpy, readPackageJSON);
        // Assert
        (0, chai_1.expect)(errorSpy).not.to.have.been.called();
        (0, chai_1.expect)(warningSpy).not.to.have.been.called();
    });
    it('does not call onError when the version is a version that isnt out yet at time of release', () => {
        // Arrange
        const errorSpy = sinon.spy();
        const warningSpy = sinon.spy();
        // Act
        (0, validate_node_engine_version_1.validateNodeEngineVersion)('v18.0.0', errorSpy, warningSpy, readPackageJSON);
        // Assert
        (0, chai_1.expect)(errorSpy).not.to.have.been.called();
        (0, chai_1.expect)(warningSpy).to.have.been.calledOnceWith(`This Node.js version (v18.0.0) has not been tested with this version of Cucumber; it should work normally, but please raise an issue if you see anything unexpected.`);
    });
});
//# sourceMappingURL=validate_node_engine_version_spec.js.map