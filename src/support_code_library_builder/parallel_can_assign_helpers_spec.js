"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const parallel_can_assign_helpers_1 = require("./parallel_can_assign_helpers");
function pickleWithTags(tagNames) {
    return {
        id: 'test',
        name: '',
        uri: '',
        steps: [],
        language: null,
        astNodeIds: [],
        tags: tagNames.map((tagName) => ({ name: tagName, astNodeId: '123' })),
    };
}
describe('parallel can assign helpers', () => {
    describe('atMostOnePicklePerTag()', () => {
        const testCanAssignFn = (0, parallel_can_assign_helpers_1.atMostOnePicklePerTag)(['@complex', '@simple']);
        it('returns true if no pickles in progress', () => {
            // Arrange
            const inQuestion = pickleWithTags(['@complex']);
            const inProgress = [];
            // Act
            const result = testCanAssignFn(inQuestion, inProgress);
            // Assert
            (0, chai_1.expect)(result).to.eql(true);
        });
        it('returns true if pickle in question does not any of the given tags', () => {
            // Arrange
            const inQuestion = pickleWithTags([]);
            const inProgress = [
                pickleWithTags(['@complex']),
                pickleWithTags(['@simple']),
            ];
            // Act
            const result = testCanAssignFn(inQuestion, inProgress);
            // Assert
            (0, chai_1.expect)(result).to.eql(true);
        });
        it('returns true if pickle in question has one of the given tags but no other pickles in progress do', () => {
            // Arrange
            const inQuestion = pickleWithTags(['@complex']);
            const inProgress = [pickleWithTags(['@simple'])];
            // Act
            const result = testCanAssignFn(inQuestion, inProgress);
            // Assert
            (0, chai_1.expect)(result).to.eql(true);
        });
        it('returns false if pickle in question has one of the given tags and a pickle in progress also has that tag', () => {
            // Arrange
            const inQuestion = pickleWithTags(['@complex']);
            const inProgress = [pickleWithTags(['@complex'])];
            // Act
            const result = testCanAssignFn(inQuestion, inProgress);
            // Assert
            (0, chai_1.expect)(result).to.eql(false);
        });
    });
});
//# sourceMappingURL=parallel_can_assign_helpers_spec.js.map