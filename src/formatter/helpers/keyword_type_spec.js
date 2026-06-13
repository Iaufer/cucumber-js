"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const keyword_type_1 = require("./keyword_type");
(0, mocha_1.describe)('KeywordType', () => {
    (0, mocha_1.describe)('getStepKeywordType()', () => {
        (0, mocha_1.describe)('keyword is Given', () => {
            (0, mocha_1.it)('returns precondition', function () {
                // Arrange
                // Act
                const result = (0, keyword_type_1.getStepKeywordType)({
                    keyword: 'Given ',
                    language: 'en',
                });
                // Assert
                (0, chai_1.expect)(result).to.eql(keyword_type_1.KeywordType.Precondition);
            });
        });
        (0, mocha_1.describe)('keyword is When', () => {
            (0, mocha_1.it)('returns event', function () {
                // Arrange
                // Act
                const result = (0, keyword_type_1.getStepKeywordType)({
                    keyword: 'When ',
                    language: 'en',
                });
                // Assert
                (0, chai_1.expect)(result).to.eql(keyword_type_1.KeywordType.Event);
            });
        });
        (0, mocha_1.describe)('keyword is Then', () => {
            (0, mocha_1.it)('returns outcome', function () {
                // Arrange
                // Act
                const result = (0, keyword_type_1.getStepKeywordType)({
                    keyword: 'Then ',
                    language: 'en',
                });
                // Assert
                (0, chai_1.expect)(result).to.eql(keyword_type_1.KeywordType.Outcome);
            });
        });
        (0, mocha_1.describe)('keyword is And, no previous step', () => {
            (0, mocha_1.it)('returns precondition', function () {
                // Arrange
                // Act
                const result = (0, keyword_type_1.getStepKeywordType)({
                    keyword: 'And ',
                    language: 'en',
                });
                // Assert
                (0, chai_1.expect)(result).to.eql(keyword_type_1.KeywordType.Precondition);
            });
        });
        (0, mocha_1.describe)('keyword is And, previous keyword type is event', () => {
            (0, mocha_1.it)('returns event', function () {
                // Arrange
                // Act
                const result = (0, keyword_type_1.getStepKeywordType)({
                    keyword: 'And ',
                    language: 'en',
                    previousKeywordType: keyword_type_1.KeywordType.Event,
                });
                // Assert
                (0, chai_1.expect)(result).to.eql(keyword_type_1.KeywordType.Event);
            });
        });
        (0, mocha_1.describe)('keyword is But, no previous step', () => {
            (0, mocha_1.it)('returns precondition', function () {
                // Arrange
                // Act
                const result = (0, keyword_type_1.getStepKeywordType)({
                    keyword: 'But ',
                    language: 'en',
                });
                // Assert
                (0, chai_1.expect)(result).to.eql(keyword_type_1.KeywordType.Precondition);
            });
        });
        (0, mocha_1.describe)('keyword is But, previous keyword type is outcome', () => {
            (0, mocha_1.it)('returns outcome', function () {
                // Arrange
                // Act
                const result = (0, keyword_type_1.getStepKeywordType)({
                    keyword: 'And ',
                    language: 'en',
                    previousKeywordType: keyword_type_1.KeywordType.Outcome,
                });
                // Assert
                (0, chai_1.expect)(result).to.eql(keyword_type_1.KeywordType.Outcome);
            });
        });
        (0, mocha_1.describe)('keyword is unknown', () => {
            (0, mocha_1.it)('returns precondition', function () {
                // Arrange
                // Act
                const result = (0, keyword_type_1.getStepKeywordType)({
                    keyword: 'Other ',
                    language: 'en',
                });
                // Assert
                (0, chai_1.expect)(result).to.eql(keyword_type_1.KeywordType.Precondition);
            });
        });
    });
});
//# sourceMappingURL=keyword_type_spec.js.map