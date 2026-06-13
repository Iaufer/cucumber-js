"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const tmp_1 = __importDefault(require("tmp"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const __1 = require("../../");
/*
Simulates something like a global install, where the Cucumber being executed
is not the one being imported by support code
 */
(0, __1.Given)('an invalid installation', async function () {
    const projectPath = node_path_1.default.join(__dirname, '..', '..');
    const tmpObject = tmp_1.default.dirSync({ unsafeCleanup: true });
    // Symlink everything in node_modules so the fake installation has all the dependencies it needs
    const projectNodeModulesPath = node_path_1.default.join(projectPath, 'node_modules');
    const projectNodeModulesDirs = node_fs_1.default.readdirSync(projectNodeModulesPath);
    const installationNodeModulesPath = node_path_1.default.join(tmpObject.name, 'node_modules');
    projectNodeModulesDirs.forEach((nodeModuleDir) => {
        let pathsToLink = [nodeModuleDir];
        if (nodeModuleDir[0] === '@') {
            const scopeNodeModuleDirs = node_fs_1.default.readdirSync(node_path_1.default.join(projectNodeModulesPath, nodeModuleDir));
            pathsToLink = scopeNodeModuleDirs.map((x) => node_path_1.default.join(nodeModuleDir, x));
        }
        pathsToLink.forEach((pathToLink) => {
            const installationPackagePath = node_path_1.default.join(installationNodeModulesPath, pathToLink);
            const projectPackagePath = node_path_1.default.join(projectNodeModulesPath, pathToLink);
            fs_extra_1.default.ensureSymlinkSync(projectPackagePath, installationPackagePath);
        });
    });
    const invalidInstallationCucumberPath = node_path_1.default.join(installationNodeModulesPath, '@cucumber', 'cucumber');
    const itemsToCopy = ['bin', 'lib', 'package.json'];
    itemsToCopy.forEach((item) => {
        fs_extra_1.default.copySync(node_path_1.default.join(projectPath, item), node_path_1.default.join(invalidInstallationCucumberPath, item));
    });
    this.localExecutablePath = node_path_1.default.join(invalidInstallationCucumberPath, 'bin', 'cucumber.js');
});
//# sourceMappingURL=install_steps.js.map