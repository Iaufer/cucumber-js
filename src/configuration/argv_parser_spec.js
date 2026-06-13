"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const argv_parser_1 = __importDefault(require("./argv_parser"));
const baseArgv = ['/path/to/node', '/path/to/cucumber-js'];
describe('ArgvParser', () => {
    describe('parse', () => {
        it('should produce an empty object when no arguments', () => {
            const { configuration } = argv_parser_1.default.parse(baseArgv);
            (0, chai_1.expect)(configuration).to.deep.eq({});
        });
        it('should handle repeatable arguments', () => {
            const { configuration } = argv_parser_1.default.parse([
                ...baseArgv,
                'features/hello.feature',
                'features/world.feature',
                '--require',
                'hooks/**/*.js',
                '--require',
                'steps/**/*.js',
            ]);
            (0, chai_1.expect)(configuration).to.deep.eq({
                paths: ['features/hello.feature', 'features/world.feature'],
                require: ['hooks/**/*.js', 'steps/**/*.js'],
            });
        });
        it('should handle mergeable tag strings', () => {
            const { configuration } = argv_parser_1.default.parse([
                ...baseArgv,
                '--tags',
                '@foo',
                '--tags',
                '@bar',
            ]);
            (0, chai_1.expect)(configuration).to.deep.eq({
                tags: '(@foo) and (@bar)',
            });
        });
        it('should handle mergeable json objects', () => {
            const params1 = { foo: 1, bar: { stuff: 3 } };
            const params2 = { foo: 2, bar: { things: 4 } };
            const { configuration } = argv_parser_1.default.parse([
                ...baseArgv,
                '--world-parameters',
                JSON.stringify(params1),
                '--world-parameters',
                JSON.stringify(params2),
            ]);
            (0, chai_1.expect)(configuration).to.deep.eq({
                worldParameters: { foo: 2, bar: { stuff: 3, things: 4 } },
            });
        });
    });
});
//# sourceMappingURL=argv_parser_spec.js.map