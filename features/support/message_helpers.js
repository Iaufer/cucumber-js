"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPickleNamesInOrderOfExecution = getPickleNamesInOrderOfExecution;
exports.getPickleStep = getPickleStep;
exports.getTestCaseResult = getTestCaseResult;
exports.getTestStepResults = getTestStepResults;
exports.getTestStepAttachmentsForStep = getTestStepAttachmentsForStep;
exports.getTestStepAttachmentsForHook = getTestStepAttachmentsForHook;
const node_util_1 = __importDefault(require("node:util"));
const query_1 = require("@cucumber/query");
const value_checker_1 = require("../../src/value_checker");
const pickle_parser_1 = require("../../src/formatter/helpers/pickle_parser");
const gherkin_document_parser_1 = require("../../src/formatter/helpers/gherkin_document_parser");
function getPickleNamesInOrderOfExecution(envelopes) {
    const pickleNameMap = {};
    const testCaseToPickleNameMap = {};
    const result = [];
    envelopes.forEach((e) => {
        if (e.pickle != null) {
            pickleNameMap[e.pickle.id] = e.pickle.name;
        }
        else if (e.testCase != null) {
            testCaseToPickleNameMap[e.testCase.id] =
                pickleNameMap[e.testCase.pickleId];
        }
        else if (e.testCaseStarted != null) {
            result.push(testCaseToPickleNameMap[e.testCaseStarted.testCaseId]);
        }
    });
    return result;
}
function getPickleStep(envelopes, pickleName, stepText) {
    const pickle = getAcceptedPickle(envelopes, pickleName);
    const gherkinDocument = getGherkinDocument(envelopes, pickle.uri);
    return getPickleStepByStepText(pickle, gherkinDocument, stepText);
}
function getTestCaseResult(envelopes, pickleName) {
    const query = new query_1.Query();
    envelopes.forEach((envelope) => query.update(envelope));
    const matched = query
        .findAllTestCaseStarted()
        .find((testCaseStarted) => query.findPickleBy(testCaseStarted).name === pickleName);
    return query.findMostSevereTestStepResultBy(matched);
}
function getTestStepResults(envelopes, pickleName, attempt = 0) {
    const pickle = getAcceptedPickle(envelopes, pickleName);
    const gherkinDocument = getGherkinDocument(envelopes, pickle.uri);
    const testCase = getTestCase(envelopes, pickle.id);
    const testCaseStarted = getTestCaseStarted(envelopes, testCase.id, attempt);
    const testStepIdToResultMap = {};
    envelopes.forEach((e) => {
        if (e.testStepFinished != null &&
            e.testStepFinished.testCaseStartedId === testCaseStarted.id) {
            testStepIdToResultMap[e.testStepFinished.testStepId] =
                e.testStepFinished.testStepResult;
        }
    });
    const gherkinStepMap = (0, gherkin_document_parser_1.getGherkinStepMap)(gherkinDocument);
    const pickleStepMap = (0, pickle_parser_1.getPickleStepMap)(pickle);
    let isBeforeHook = true;
    return testCase.testSteps.map((testStep) => {
        let text = '';
        if (!(0, value_checker_1.doesHaveValue)(testStep.pickleStepId)) {
            text = isBeforeHook ? 'Before' : 'After';
        }
        else {
            isBeforeHook = false;
            const pickleStep = pickleStepMap[testStep.pickleStepId];
            const keyword = (0, pickle_parser_1.getStepKeyword)({ pickleStep, gherkinStepMap });
            text = `${keyword}${pickleStep.text}`;
        }
        return { text, result: testStepIdToResultMap[testStep.id] };
    });
}
function getTestStepAttachmentsForStep(envelopes, pickleName, stepText) {
    const pickle = getAcceptedPickle(envelopes, pickleName);
    const gherkinDocument = getGherkinDocument(envelopes, pickle.uri);
    const testCase = getTestCase(envelopes, pickle.id);
    const pickleStep = getPickleStepByStepText(pickle, gherkinDocument, stepText);
    const testStep = testCase.testSteps.find((s) => s.pickleStepId === pickleStep.id);
    const testCaseStarted = getTestCaseStarted(envelopes, testCase.id);
    return getTestStepAttachments(envelopes, testCaseStarted.id, testStep.id);
}
function getTestStepAttachmentsForHook(envelopes, pickleName, isBeforeHook) {
    const pickle = getAcceptedPickle(envelopes, pickleName);
    const testCase = getTestCase(envelopes, pickle.id);
    const testStepIndex = isBeforeHook ? 0 : testCase.testSteps.length - 1;
    const testStep = testCase.testSteps[testStepIndex];
    const testCaseStarted = getTestCaseStarted(envelopes, testCase.id);
    return getTestStepAttachments(envelopes, testCaseStarted.id, testStep.id);
}
function getAcceptedPickle(envelopes, pickleName) {
    const pickleEnvelope = envelopes.find((e) => (0, value_checker_1.doesHaveValue)(e.pickle) && e.pickle.name === pickleName);
    if ((0, value_checker_1.doesNotHaveValue)(pickleEnvelope)) {
        throw new Error(`No pickle with name "${pickleName}" in envelopes:\n ${node_util_1.default.inspect(envelopes)}`);
    }
    return pickleEnvelope.pickle;
}
function getGherkinDocument(envelopes, uri) {
    const gherkinDocumentEnvelope = envelopes.find((e) => (0, value_checker_1.doesHaveValue)(e.gherkinDocument) && e.gherkinDocument.uri === uri);
    if ((0, value_checker_1.doesNotHaveValue)(gherkinDocumentEnvelope)) {
        throw new Error(`No gherkinDocument with uri "${uri}" in envelopes:\n ${node_util_1.default.inspect(envelopes)}`);
    }
    return gherkinDocumentEnvelope.gherkinDocument;
}
function getTestCase(envelopes, pickleId) {
    const testCaseEnvelope = envelopes.find((e) => (0, value_checker_1.doesHaveValue)(e.testCase) && e.testCase.pickleId === pickleId);
    if ((0, value_checker_1.doesNotHaveValue)(testCaseEnvelope)) {
        throw new Error(`No testCase with pickleId "${pickleId}" in envelopes:\n ${node_util_1.default.inspect(envelopes)}`);
    }
    return testCaseEnvelope.testCase;
}
function getTestCaseStarted(envelopes, testCaseId, attempt = 0) {
    const testCaseStartedEnvelope = envelopes.find((e) => (0, value_checker_1.doesHaveValue)(e.testCaseStarted) &&
        e.testCaseStarted.testCaseId === testCaseId &&
        e.testCaseStarted.attempt === attempt);
    if ((0, value_checker_1.doesNotHaveValue)(testCaseStartedEnvelope)) {
        throw new Error(`No testCaseStarted with testCaseId "${testCaseId}" in envelopes:\n ${node_util_1.default.inspect(envelopes)}`);
    }
    return testCaseStartedEnvelope.testCaseStarted;
}
function getPickleStepByStepText(pickle, gherkinDocument, stepText) {
    const gherkinStepMap = (0, gherkin_document_parser_1.getGherkinStepMap)(gherkinDocument);
    return pickle.steps.find((s) => {
        const keyword = (0, pickle_parser_1.getStepKeyword)({ pickleStep: s, gherkinStepMap });
        return `${keyword}${s.text}` === stepText;
    });
}
function getTestStepAttachments(envelopes, testCaseStartedId, testStepId) {
    return envelopes
        .filter((e) => (0, value_checker_1.doesHaveValue)(e.attachment) &&
        e.attachment.testCaseStartedId === testCaseStartedId &&
        e.attachment.testStepId === testStepId)
        .map((e) => e.attachment);
}
//# sourceMappingURL=message_helpers.js.map