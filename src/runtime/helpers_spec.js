"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const gherkin_helpers_1 = require("../../test/gherkin_helpers");
const runtime_helpers_1 = require("../../test/runtime_helpers");
const helpers_1 = require("./helpers");
(0, mocha_1.describe)('Helpers', () => {
    (0, mocha_1.describe)('retriesForPickle', () => {
        (0, mocha_1.it)('returns 0 if options.retry is not set', async () => {
            // Arrange
            const pickle = await (0, gherkin_helpers_1.getPickleWithTags)([]);
            const options = (0, runtime_helpers_1.buildOptions)({});
            // Act
            const result = (0, helpers_1.retriesForPickle)(pickle, options);
            // Assert
            (0, chai_1.expect)(result).to.eql(0);
        });
        (0, mocha_1.it)('returns options.retry if set and no options.retryTagFilter is specified', async () => {
            // Arrange
            const pickle = await (0, gherkin_helpers_1.getPickleWithTags)([]);
            const options = (0, runtime_helpers_1.buildOptions)({ retry: 1 });
            // Act
            const result = (0, helpers_1.retriesForPickle)(pickle, options);
            // Assert
            (0, chai_1.expect)(result).to.eql(1);
        });
        (0, mocha_1.it)('returns options.retry is set and the pickle tags match options.retryTagFilter', async () => {
            // Arrange
            const pickle = await (0, gherkin_helpers_1.getPickleWithTags)(['@retry']);
            const options = (0, runtime_helpers_1.buildOptions)({
                retry: 1,
                retryTagFilter: '@retry',
            });
            // Act
            const result = (0, helpers_1.retriesForPickle)(pickle, options);
            // Assert
            (0, chai_1.expect)(result).to.eql(1);
        });
        (0, mocha_1.it)('returns 0 if options.retry is set but the pickle tags do not match options.retryTagFilter', async () => {
            // Arrange
            const pickle = await (0, gherkin_helpers_1.getPickleWithTags)([]);
            const options = (0, runtime_helpers_1.buildOptions)({
                retry: 1,
                retryTagFilter: '@retry',
            });
            // Act
            const result = (0, helpers_1.retriesForPickle)(pickle, options);
            // Assert
            (0, chai_1.expect)(result).to.eql(0);
        });
    });
});
//# sourceMappingURL=helpers_spec.js.map