"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_util_1 = require("node:util");
const node_path_1 = __importDefault(require("node:path"));
const tmp_1 = __importDefault(require("tmp"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const fake_logger_1 = require("../../test/fake_logger");
const paths_1 = require("./paths");
async function buildTestWorkingDirectory() {
    const cwd = await (0, node_util_1.promisify)(tmp_1.default.dir)({
        unsafeCleanup: true,
    });
    await fs_extra_1.default.mkdirp(node_path_1.default.join(cwd, 'features'));
    return cwd;
}
(0, mocha_1.describe)('resolvePaths', () => {
    (0, mocha_1.describe)('path to a feature', () => {
        (0, mocha_1.it)('returns the appropriate .feature and support code paths', async function () {
            // Arrange
            const cwd = await buildTestWorkingDirectory();
            const relativeFeaturePath = node_path_1.default.join('features', 'a.feature');
            const featurePath = node_path_1.default.join(cwd, relativeFeaturePath);
            await fs_extra_1.default.outputFile(featurePath, '');
            const jsSupportCodePath = node_path_1.default.join(cwd, 'features', 'a.js');
            await fs_extra_1.default.outputFile(jsSupportCodePath, '');
            const esmSupportCodePath = node_path_1.default.join(cwd, 'features', 'a.mjs');
            await fs_extra_1.default.outputFile(esmSupportCodePath, '');
            // Act
            const { sourcePaths, unexpandedSourcePaths, requirePaths, importPaths } = await (0, paths_1.resolvePaths)(new fake_logger_1.FakeLogger(), cwd, {
                paths: [relativeFeaturePath],
            }, {
                requireModules: [],
                requirePaths: [],
                importPaths: [],
                loaders: [],
            });
            // Assert
            (0, chai_1.expect)(sourcePaths).to.eql([featurePath]);
            (0, chai_1.expect)(unexpandedSourcePaths).to.eql([relativeFeaturePath]);
            (0, chai_1.expect)(requirePaths).to.eql([]);
            (0, chai_1.expect)(importPaths).to.eql([jsSupportCodePath, esmSupportCodePath]);
        });
        (0, mocha_1.it)('deduplicates features based on overlapping expressions', async function () {
            // Arrange
            const cwd = await buildTestWorkingDirectory();
            const relativeFeaturePath = node_path_1.default.join('features', 'a.feature');
            const featurePath = node_path_1.default.join(cwd, relativeFeaturePath);
            await fs_extra_1.default.outputFile(featurePath, '');
            // Act
            const { sourcePaths } = await (0, paths_1.resolvePaths)(new fake_logger_1.FakeLogger(), cwd, {
                paths: ['features/*.feature', 'features/a.feature'],
            }, {
                requireModules: [],
                requirePaths: [],
                importPaths: [],
                loaders: [],
            });
            // Assert
            (0, chai_1.expect)(sourcePaths).to.eql([featurePath]);
        });
        (0, mocha_1.it)('deduplicates features based on multiple targets of same path', async function () {
            // Arrange
            const cwd = await buildTestWorkingDirectory();
            const relativeFeaturePath = node_path_1.default.join('features', 'a.feature');
            const featurePath = node_path_1.default.join(cwd, relativeFeaturePath);
            await fs_extra_1.default.outputFile(featurePath, '');
            // Act
            const { sourcePaths } = await (0, paths_1.resolvePaths)(new fake_logger_1.FakeLogger(), cwd, {
                paths: [`${relativeFeaturePath}:3`, `${relativeFeaturePath}:4`],
            }, {
                requireModules: [],
                requirePaths: [],
                importPaths: [],
                loaders: [],
            });
            // Assert
            (0, chai_1.expect)(sourcePaths).to.eql([featurePath]);
        });
        (0, mocha_1.it)('returns the appropriate .md and support code paths', async function () {
            // Arrange
            const cwd = await buildTestWorkingDirectory();
            const relativeFeaturePath = node_path_1.default.join('features', 'a.feature.md');
            const featurePath = node_path_1.default.join(cwd, relativeFeaturePath);
            await fs_extra_1.default.outputFile(featurePath, '');
            const supportCodePath = node_path_1.default.join(cwd, 'features', 'a.js');
            await fs_extra_1.default.outputFile(supportCodePath, '');
            // Act
            const { sourcePaths, unexpandedSourcePaths, importPaths } = await (0, paths_1.resolvePaths)(new fake_logger_1.FakeLogger(), cwd, {
                paths: [relativeFeaturePath],
            }, {
                requireModules: [],
                requirePaths: [],
                importPaths: [],
                loaders: [],
            });
            // Assert
            (0, chai_1.expect)(sourcePaths).to.eql([featurePath]);
            (0, chai_1.expect)(unexpandedSourcePaths).to.eql([relativeFeaturePath]);
            (0, chai_1.expect)(importPaths).to.eql([supportCodePath]);
        });
    });
    (0, mocha_1.describe)('path to a nested feature', () => {
        (0, mocha_1.it)('returns the appropriate .feature and support code paths', async function () {
            // Arrange
            const cwd = await buildTestWorkingDirectory();
            const relativeFeaturePath = node_path_1.default.join('features', 'nested', 'a.feature');
            const featurePath = node_path_1.default.join(cwd, relativeFeaturePath);
            await fs_extra_1.default.outputFile(featurePath, '');
            const supportCodePath = node_path_1.default.join(cwd, 'features', 'a.js');
            await fs_extra_1.default.outputFile(supportCodePath, '');
            // Act
            const { sourcePaths, unexpandedSourcePaths, importPaths } = await (0, paths_1.resolvePaths)(new fake_logger_1.FakeLogger(), cwd, {
                paths: [relativeFeaturePath],
            }, {
                requireModules: [],
                requirePaths: [],
                importPaths: [],
                loaders: [],
            });
            // Assert
            (0, chai_1.expect)(sourcePaths).to.eql([featurePath]);
            (0, chai_1.expect)(unexpandedSourcePaths).to.eql([relativeFeaturePath]);
            (0, chai_1.expect)(importPaths).to.eql([supportCodePath]);
        });
        (0, mocha_1.it)('returns the appropriate .md and support code paths', async function () {
            // Arrange
            const cwd = await buildTestWorkingDirectory();
            const relativeFeaturePath = node_path_1.default.join('features', 'nested', 'a.feature.md');
            const featurePath = node_path_1.default.join(cwd, relativeFeaturePath);
            await fs_extra_1.default.outputFile(featurePath, '');
            const supportCodePath = node_path_1.default.join(cwd, 'features', 'a.js');
            await fs_extra_1.default.outputFile(supportCodePath, '');
            // Act
            const { sourcePaths, unexpandedSourcePaths, importPaths } = await (0, paths_1.resolvePaths)(new fake_logger_1.FakeLogger(), cwd, {
                paths: [relativeFeaturePath],
            }, {
                requireModules: [],
                requirePaths: [],
                importPaths: [],
                loaders: [],
            });
            // Assert
            (0, chai_1.expect)(sourcePaths).to.eql([featurePath]);
            (0, chai_1.expect)(unexpandedSourcePaths).to.eql([relativeFeaturePath]);
            (0, chai_1.expect)(importPaths).to.eql([supportCodePath]);
        });
    });
    (0, mocha_1.describe)('multiple paths ordering', async () => {
        (0, mocha_1.it)('should honour the provided order of multiple files', async () => {
            // Arrange
            const cwd = await buildTestWorkingDirectory();
            const featurePathA = node_path_1.default.join(cwd, 'features', 'a.feature');
            const featurePathB = node_path_1.default.join(cwd, 'features', 'b.feature');
            await fs_extra_1.default.outputFile(featurePathA, '');
            await fs_extra_1.default.outputFile(featurePathB, '');
            // Act
            const { sourcePaths } = await (0, paths_1.resolvePaths)(new fake_logger_1.FakeLogger(), cwd, {
                paths: ['features/b.feature', 'features/a.feature'],
            }, {
                requireModules: [],
                requirePaths: [],
                importPaths: [],
                loaders: [],
            });
            // Assert
            (0, chai_1.expect)(sourcePaths).to.eql([featurePathB, featurePathA]);
        });
        (0, mocha_1.it)('should honour the provided order of multiple directories', async () => {
            // Arrange
            const cwd = await buildTestWorkingDirectory();
            const featurePathA = node_path_1.default.join(cwd, 'features-a', 'something.feature');
            const featurePathB = node_path_1.default.join(cwd, 'features-b', 'something.feature');
            await fs_extra_1.default.outputFile(featurePathA, '');
            await fs_extra_1.default.outputFile(featurePathB, '');
            // Act
            const { sourcePaths } = await (0, paths_1.resolvePaths)(new fake_logger_1.FakeLogger(), cwd, {
                paths: ['features-b', 'features-a'],
            }, {
                requireModules: [],
                requirePaths: [],
                importPaths: [],
                loaders: [],
            });
            // Assert
            (0, chai_1.expect)(sourcePaths).to.eql([featurePathB, featurePathA]);
        });
    });
    (0, mocha_1.describe)('path to an empty rerun file', () => {
        (0, mocha_1.it)('returns empty featurePaths and support code paths', async function () {
            // Arrange
            const cwd = await buildTestWorkingDirectory();
            const relativeRerunPath = '@empty_rerun.txt';
            const rerunPath = node_path_1.default.join(cwd, '@empty_rerun.txt');
            await fs_extra_1.default.outputFile(rerunPath, '');
            // Act
            const { sourcePaths, unexpandedSourcePaths, requirePaths } = await (0, paths_1.resolvePaths)(new fake_logger_1.FakeLogger(), cwd, {
                paths: [relativeRerunPath],
            }, {
                requireModules: [],
                requirePaths: [],
                importPaths: [],
                loaders: [],
            });
            // Assert
            (0, chai_1.expect)(sourcePaths).to.eql([]);
            (0, chai_1.expect)(unexpandedSourcePaths).to.eql([]);
            (0, chai_1.expect)(requirePaths).to.eql([]);
        });
    });
    (0, mocha_1.describe)('path to an rerun file with new line', () => {
        (0, mocha_1.it)('returns empty featurePaths and support code paths', async function () {
            // Arrange
            const cwd = await buildTestWorkingDirectory();
            const relativeRerunPath = '@empty_rerun.txt';
            const rerunPath = node_path_1.default.join(cwd, '@empty_rerun.txt');
            await fs_extra_1.default.outputFile(rerunPath, '\n');
            // Act
            const { sourcePaths, unexpandedSourcePaths, requirePaths } = await (0, paths_1.resolvePaths)(new fake_logger_1.FakeLogger(), cwd, {
                paths: [relativeRerunPath],
            }, {
                requireModules: [],
                requirePaths: [],
                importPaths: [],
                loaders: [],
            });
            // Assert
            (0, chai_1.expect)(sourcePaths).to.eql([]);
            (0, chai_1.expect)(unexpandedSourcePaths).to.eql([]);
            (0, chai_1.expect)(requirePaths).to.eql([]);
        });
    });
    (0, mocha_1.describe)('path to a rerun file with one new line character', () => {
        (0, mocha_1.it)('returns empty featurePaths and support code paths', async function () {
            // Arrange
            const cwd = await buildTestWorkingDirectory();
            const relativeRerunPath = '@empty_rerun.txt';
            const rerunPath = node_path_1.default.join(cwd, '@empty_rerun.txt');
            await fs_extra_1.default.outputFile(rerunPath, '\n\n');
            // Act
            const { sourcePaths, unexpandedSourcePaths, requirePaths } = await (0, paths_1.resolvePaths)(new fake_logger_1.FakeLogger(), cwd, { paths: [relativeRerunPath] }, {
                requireModules: [],
                requirePaths: [],
                importPaths: [],
                loaders: [],
            });
            // Assert
            (0, chai_1.expect)(sourcePaths).to.eql([]);
            (0, chai_1.expect)(unexpandedSourcePaths).to.eql([]);
            (0, chai_1.expect)(requirePaths).to.eql([]);
        });
    });
    (0, mocha_1.describe)('logging', () => {
        (0, mocha_1.it)('should emit debugs logs for the feature, import and require paths', async () => {
            // Arrange
            const logger = new fake_logger_1.FakeLogger();
            const cwd = await buildTestWorkingDirectory();
            const relativeFeaturePath = node_path_1.default.join('features', 'a.feature');
            const featurePath = node_path_1.default.join(cwd, relativeFeaturePath);
            await fs_extra_1.default.outputFile(featurePath, '');
            const cjsSupportCodePath = node_path_1.default.join(cwd, 'features', 'a.cjs');
            await fs_extra_1.default.outputFile(cjsSupportCodePath, '');
            const esmSupportCodePath = node_path_1.default.join(cwd, 'features', 'a.mjs');
            await fs_extra_1.default.outputFile(esmSupportCodePath, '');
            // Act
            await (0, paths_1.resolvePaths)(logger, cwd, {
                paths: [relativeFeaturePath],
            }, {
                requireModules: [],
                requirePaths: [cjsSupportCodePath],
                importPaths: [esmSupportCodePath],
                loaders: [],
            });
            // Assert
            (0, chai_1.expect)(logger.debug).to.have.been.calledWith('Found source files based on configuration:', [featurePath]);
            (0, chai_1.expect)(logger.debug).to.have.been.calledWith('Found support files to load via `require` based on configuration:', [cjsSupportCodePath]);
            (0, chai_1.expect)(logger.debug).to.have.been.calledWith('Found support files to load via `import` based on configuration:', [esmSupportCodePath]);
        });
    });
});
//# sourceMappingURL=paths_spec.js.map