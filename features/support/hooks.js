"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const __1 = require("../../");
const value_checker_1 = require("../../src/value_checker");
const warn_user_about_enabling_developer_mode_1 = require("./warn_user_about_enabling_developer_mode");
const projectPath = node_path_1.default.join(__dirname, '..', '..');
(0, __1.Before)('@debug', function () {
    this.debug = true;
});
(0, __1.Before)('@spawn or @esm', function () {
    this.spawn = true;
});
(0, __1.Before)(function ({ gherkinDocument, pickle }) {
    const { line } = __1.formatterHelpers.PickleParser.getPickleLocation({
        gherkinDocument,
        pickle,
    });
    this.tmpDir = node_path_1.default.join(projectPath, 'tmp', `${node_path_1.default.basename(pickle.uri)}_${line.toString()}`);
    fs_extra_1.default.removeSync(this.tmpDir);
    const tmpDirNodeModulesPath = node_path_1.default.join(this.tmpDir, 'node_modules');
    const tmpDirCucumberPath = node_path_1.default.join(tmpDirNodeModulesPath, '@cucumber', 'cucumber');
    try {
        fs_extra_1.default.ensureSymlinkSync(projectPath, tmpDirCucumberPath);
    }
    catch (error) {
        (0, warn_user_about_enabling_developer_mode_1.warnUserAboutEnablingDeveloperMode)(error);
    }
    this.localExecutablePath = node_path_1.default.join(projectPath, 'bin', 'cucumber.js');
});
(0, __1.Before)('@esm', function () {
    fs_extra_1.default.writeJSONSync(node_path_1.default.join(this.tmpDir, 'package.json'), {
        name: 'feature-test-pickle',
        type: 'module',
    });
});
(0, __1.Before)('@without-require-esm', function () {
    if (process.features.require_module) {
        return 'skipped';
    }
    return undefined;
});
(0, __1.After)(async function () {
    if (this.reportServer?.started) {
        await this.reportServer.stop();
    }
    if ((0, value_checker_1.doesHaveValue)(this.lastRun) &&
        (0, value_checker_1.doesHaveValue)(this.lastRun.error) &&
        !this.verifiedLastRunError) {
        throw new Error(`Last run errored unexpectedly. Output:\n\n${this.lastRun.output}\n\n` +
            `Error Output:\n\n${this.lastRun.errorOutput}`);
    }
});
//# sourceMappingURL=hooks.js.map