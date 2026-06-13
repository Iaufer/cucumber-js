"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const merge_configurations_1 = require("./merge_configurations");
describe('mergeConfigurations', () => {
    it('should not default anything with empty configurations', () => {
        const result = (0, merge_configurations_1.mergeConfigurations)({}, {});
        (0, chai_1.expect)(result).to.deep.eq({});
    });
    it('should not override a real value with undefined', () => {
        const result = (0, merge_configurations_1.mergeConfigurations)({
            parallel: 2,
        }, {
            parallel: undefined,
        });
        (0, chai_1.expect)(result).to.deep.eq({ parallel: 2 });
    });
    describe('additive arrays', () => {
        it('should merge two arrays correctly', () => {
            const result = (0, merge_configurations_1.mergeConfigurations)({ paths: ['a'] }, { paths: ['b'] });
            (0, chai_1.expect)(result).to.deep.eq({
                paths: ['a', 'b'],
            });
        });
        it('should handle one array and one undefined correctly', () => {
            const result = (0, merge_configurations_1.mergeConfigurations)({ paths: ['a'] }, { paths: undefined });
            (0, chai_1.expect)(result).to.deep.eq({
                paths: ['a'],
            });
        });
        it('should handle one undefined and one array correctly', () => {
            const result = (0, merge_configurations_1.mergeConfigurations)({ paths: undefined }, { paths: ['b'] });
            (0, chai_1.expect)(result).to.deep.eq({
                paths: ['b'],
            });
        });
    });
    describe('tag expressions', () => {
        it('should merge two tag expressions correctly', () => {
            const result = (0, merge_configurations_1.mergeConfigurations)({ tags: '@foo' }, { tags: '@bar' });
            (0, chai_1.expect)(result).to.deep.eq({
                tags: '(@foo) and (@bar)',
            });
        });
        it('should handle one tag and one undefined correctly', () => {
            const result = (0, merge_configurations_1.mergeConfigurations)({ tags: '@foo' }, { tags: undefined });
            (0, chai_1.expect)(result).to.deep.eq({
                tags: '@foo',
            });
        });
        it('should handle one undefined and one tag correctly', () => {
            const result = (0, merge_configurations_1.mergeConfigurations)({ tags: undefined }, { tags: '@foo' });
            (0, chai_1.expect)(result).to.deep.eq({
                tags: '@foo',
            });
        });
        it('should merge three tag expressions correctly', () => {
            const result = (0, merge_configurations_1.mergeConfigurations)({ tags: '@foo' }, { tags: '@bar' }, { tags: '@baz' });
            (0, chai_1.expect)(result).to.deep.eq({
                tags: '(@foo) and (@bar) and (@baz)',
            });
        });
    });
});
//# sourceMappingURL=merge_configurations_spec.js.map