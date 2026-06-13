"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const __1 = require("../../");
function getSetsOfPicklesRunningAtTheSameTime(envelopes) {
    const pickleIdToName = {};
    const testCaseIdToPickleId = {};
    const testCaseStartedIdToPickleId = {};
    let currentRunningPickleIds = [];
    const result = [];
    envelopes.forEach((envelope) => {
        if (envelope.pickle != null) {
            pickleIdToName[envelope.pickle.id] = envelope.pickle.name;
        }
        else if (envelope.testCase != null) {
            testCaseIdToPickleId[envelope.testCase.id] = envelope.testCase.pickleId;
        }
        else if (envelope.testCaseStarted != null) {
            const pickleId = testCaseIdToPickleId[envelope.testCaseStarted.testCaseId];
            testCaseStartedIdToPickleId[envelope.testCaseStarted.id] = pickleId;
            currentRunningPickleIds.push(pickleId);
            if (currentRunningPickleIds.length > 1) {
                const setOfPickleNames = currentRunningPickleIds
                    .map((x) => pickleIdToName[x])
                    .sort()
                    .join(', ');
                result.push(setOfPickleNames);
            }
        }
        else if (envelope.testCaseFinished != null) {
            const pickleId = testCaseStartedIdToPickleId[envelope.testCaseFinished.testCaseStartedId];
            currentRunningPickleIds = currentRunningPickleIds.filter((x) => x != pickleId);
        }
    });
    return result;
}
/**
 * Returns any failed {@link message.TestCaseFinished} events that failed and will be retried.
 * @param envelopes The total envelopes for the run.
 * @param scenarioName The name of the scenario to gether events for.
 * @returns The events that indicate a particular step failed and was retried.
 */
function getRetriesForScenario(envelopes, scenarioName) {
    const scenarioEnvelope = envelopes.find((envelope) => envelope.pickle?.name === scenarioName);
    if (scenarioEnvelope === undefined) {
        throw new Error('Could not find scenario: ' + scenarioEnvelope);
    }
    const scenarioPickle = scenarioEnvelope.pickle;
    const testCase = envelopes.find((env) => env.testCase?.pickleId === scenarioPickle.id)?.testCase;
    if (testCase === undefined) {
        throw new Error('Could not find test case for scenario: ' + scenarioName);
    }
    const scenarioCasesStarted = envelopes.filter((envelope) => envelope.testCaseStarted?.testCaseId === testCase.id);
    const testStartedIds = scenarioCasesStarted.map((started) => started.testCaseStarted.id);
    const scenarioCasesFinished = envelopes.filter((envelope) => {
        if (envelope.testCaseFinished?.testCaseStartedId) {
            return testStartedIds.includes(envelope.testCaseFinished.testCaseStartedId);
        }
        return false;
    });
    return scenarioCasesFinished.filter((testCaseFinished) => testCaseFinished.testCaseFinished.willBeRetried === true);
}
(0, __1.Then)('no pickles run at the same time', function () {
    const actualSets = getSetsOfPicklesRunningAtTheSameTime(this.lastRun.envelopes);
    (0, chai_1.expect)(actualSets).to.eql([]);
});
(0, __1.Then)('the following sets of pickles execute at the same time:', function (dataTable) {
    const expectedSets = dataTable.raw().map((row) => row[0]);
    const actualSets = getSetsOfPicklesRunningAtTheSameTime(this.lastRun.envelopes);
    (0, chai_1.expect)(actualSets).to.eql(expectedSets);
});
(0, __1.Then)('`testCaseStarted` envelope has `workerId`', function () {
    const testCaseStartedEnvelope = this.lastRun.envelopes.find((envelope) => envelope.testCaseStarted);
    (0, chai_1.expect)(testCaseStartedEnvelope.testCaseStarted).to.ownProperty('workerId');
});
(0, __1.Then)('the scenario {string} retried {int} times', function (scenarioName, retryCount) {
    const retried = getRetriesForScenario(this.lastRun.envelopes, scenarioName);
    (0, chai_1.expect)(retried).to.have.lengthOf(retryCount);
});
(0, __1.Then)('the first two scenarios run in parallel while the last runs sequentially', function () {
    const sets = getSetsOfPicklesRunningAtTheSameTime(this.lastRun.envelopes);
    (0, chai_1.expect)(Array.from(new Set(sets).values())).to.eql([
        'fail_parallel, pass_parallel',
    ]);
});
//# sourceMappingURL=parallel_steps.js.map