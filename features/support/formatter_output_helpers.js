"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ignorableKeys = void 0;
exports.normalizeMessageOutput = normalizeMessageOutput;
exports.stripMetaMessages = stripMetaMessages;
exports.normalizeJsonOutput = normalizeJsonOutput;
const value_checker_1 = require("../../src/value_checker");
function isObject(obj) {
    return typeof obj === 'object' && obj !== null;
}
// Converting windows stack trace to posix and removing cwd
//    C:\\project\\path\\features\\support/code.js
//      becomes
//    features/support/code.js
function normalizeExceptionAndUri(exception, cwd) {
    return exception
        .replace(cwd, '')
        .replace(/\\/g, '/')
        .replace('/features', 'features')
        .split('\n')[0];
}
function normalizeMessage(obj, cwd) {
    if (isObject(obj)) {
        if (typeof obj.uri === 'string') {
            obj.uri = normalizeExceptionAndUri(obj.uri, cwd);
        }
        if (isObject(obj.sourceReference) &&
            typeof obj.sourceReference.uri === 'string') {
            obj.sourceReference.uri = normalizeExceptionAndUri(obj.sourceReference.uri, cwd);
        }
        if (isObject(obj.testStepResult)) {
            if (isObject(obj.testStepResult.duration)) {
                obj.testStepResult.duration.nanos = 0;
            }
            if (typeof obj.testStepResult.message === 'string') {
                obj.testStepResult.message = normalizeExceptionAndUri(obj.testStepResult.message, cwd);
            }
        }
    }
}
function normalizeMessageOutput(envelopeObjects, cwd) {
    envelopeObjects.forEach((e) => {
        const keys = Object.keys(e);
        keys.forEach((key) => {
            normalizeMessage(e[key], cwd);
        });
    });
    return envelopeObjects;
}
function stripMetaMessages(envelopeObjects) {
    return envelopeObjects.filter((e) => {
        // filter off meta objects, almost none of it predictable/useful for testing
        return (0, value_checker_1.doesNotHaveValue)(e.meta);
    });
}
function normalizeJsonOutput(str, cwd) {
    const json = JSON.parse((0, value_checker_1.valueOrDefault)(str, '[]'));
    json.forEach((feature) => {
        if ((0, value_checker_1.doesHaveValue)(feature.uri)) {
            feature.uri = normalizeExceptionAndUri(feature.uri, cwd);
        }
        feature.elements.forEach((element) => {
            element.steps.forEach((step) => {
                if ((0, value_checker_1.doesHaveValue)(step.match) && (0, value_checker_1.doesHaveValue)(step.match.location)) {
                    step.match.location = normalizeExceptionAndUri(step.match.location, cwd);
                }
                if ((0, value_checker_1.doesHaveValue)(step.result)) {
                    if ((0, value_checker_1.doesHaveValue)(step.result.duration)) {
                        step.result.duration = 0;
                    }
                    if ((0, value_checker_1.doesHaveValue)(step.result.error_message)) {
                        step.result.error_message = normalizeExceptionAndUri(step.result.error_message, cwd);
                    }
                }
            });
        });
    });
    return json;
}
exports.ignorableKeys = [
    'meta',
    // sources
    'uri',
    'line',
    // ids
    'astNodeId',
    'astNodeIds',
    'hookId',
    'id',
    'pickleId',
    'pickleStepId',
    'stepDefinitionIds',
    'testRunStartedId',
    'testRunHookStartedId',
    'testCaseId',
    'testCaseStartedId',
    'testStepId',
    // time
    'nanos',
    'seconds',
    // errors
    'message',
    'stackTrace',
    // snippets
    'language',
    'code',
];
//# sourceMappingURL=formatter_output_helpers.js.map