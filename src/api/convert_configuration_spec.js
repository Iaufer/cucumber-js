"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const configuration_1 = require("../configuration");
const fake_logger_1 = require("../../test/fake_logger");
const convert_configuration_1 = require("./convert_configuration");
(0, mocha_1.describe)('convertConfiguration', () => {
    (0, mocha_1.it)('should convert defaults correctly', async () => {
        const result = await (0, convert_configuration_1.convertConfiguration)(new fake_logger_1.FakeLogger(), configuration_1.DEFAULT_CONFIGURATION, {});
        (0, chai_1.expect)(result).to.eql({
            formats: {
                files: {},
                options: {},
                publish: false,
                stdout: 'progress',
            },
            plugins: {
                specifiers: [],
                options: {},
            },
            runtime: {
                dryRun: false,
                failFast: false,
                filterStacktraces: true,
                parallel: 0,
                retry: 0,
                retryTagFilter: '',
                strict: true,
                worldParameters: {},
            },
            sources: {
                defaultDialect: 'en',
                names: [],
                order: 'defined',
                paths: [],
                tagExpression: '',
                shard: '',
            },
            support: {
                requireModules: [],
                requirePaths: [],
                importPaths: [],
                loaders: [],
            },
        });
    });
    (0, mocha_1.it)('should map multiple formatters with string notation', async () => {
        const result = await (0, convert_configuration_1.convertConfiguration)(new fake_logger_1.FakeLogger(), {
            ...configuration_1.DEFAULT_CONFIGURATION,
            format: [
                'summary',
                'message',
                'json:./report.json',
                'html:./report.html',
            ],
        }, {});
        (0, chai_1.expect)(result.formats).to.eql({
            stdout: 'message',
            files: {
                './report.html': 'html',
                './report.json': 'json',
            },
            publish: false,
            options: {},
        });
    });
    (0, mocha_1.it)('should map multiple formatters with array notation', async () => {
        const result = await (0, convert_configuration_1.convertConfiguration)(new fake_logger_1.FakeLogger(), {
            ...configuration_1.DEFAULT_CONFIGURATION,
            format: [
                ['summary'],
                ['message'],
                ['json', './report.json'],
                ['html', './report.html'],
            ],
        }, {});
        (0, chai_1.expect)(result.formats).to.eql({
            stdout: 'message',
            files: {
                './report.html': 'html',
                './report.json': 'json',
            },
            publish: false,
            options: {},
        });
    });
    (0, mocha_1.it)('should map formatters correctly when file:// urls are involved', async () => {
        const result = await (0, convert_configuration_1.convertConfiguration)(new fake_logger_1.FakeLogger(), {
            ...configuration_1.DEFAULT_CONFIGURATION,
            format: [
                'file:///my/fancy/formatter',
                'json:./report.json',
                'html:./report.html',
            ],
        }, {});
        (0, chai_1.expect)(result.formats).to.eql({
            stdout: 'file:///my/fancy/formatter',
            files: {
                './report.html': 'html',
                './report.json': 'json',
            },
            publish: false,
            options: {},
        });
    });
});
//# sourceMappingURL=convert_configuration_spec.js.map