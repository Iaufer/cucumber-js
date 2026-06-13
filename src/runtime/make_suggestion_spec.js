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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const messages_1 = require("@cucumber/messages");
const messages = __importStar(require("@cucumber/messages"));
const runtime_helpers_1 = require("../../test/runtime_helpers");
const builder_1 = __importDefault(require("../formatter/builder"));
const make_suggestion_1 = require("./make_suggestion");
(0, mocha_1.describe)('makeSuggestion', () => {
    (0, mocha_1.it)('generates multiple snippets for expressions with numeric parameters', async () => {
        const supportCodeLibrary = (0, runtime_helpers_1.buildSupportCodeLibrary)();
        const snippetBuilder = await builder_1.default.getStepDefinitionSnippetBuilder({
            cwd: process.cwd(),
            supportCodeLibrary,
        });
        const newId = messages_1.IdGenerator.incrementing();
        const pickleStep = {
            id: '1',
            text: 'I have 5 apples',
            type: messages.PickleStepType.CONTEXT,
            astNodeIds: [],
        };
        const suggestion = (0, make_suggestion_1.makeSuggestion)({
            newId,
            snippetBuilder,
            pickleStep,
        });
        (0, chai_1.expect)(suggestion).to.deep.equal({
            id: '0',
            pickleStepId: '1',
            snippets: [
                {
                    code: "Given('I have {int} apples', function (int) {\n  // Write code here that turns the phrase above into concrete actions\n  return 'pending';\n});",
                    language: 'javascript',
                },
                {
                    code: "Given('I have {float} apples', function (float) {\n  // Write code here that turns the phrase above into concrete actions\n  return 'pending';\n});",
                    language: 'javascript',
                },
            ],
        });
    });
});
//# sourceMappingURL=make_suggestion_spec.js.map