"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.warnUserAboutEnablingDeveloperMode = warnUserAboutEnablingDeveloperMode;
const reindent_template_literals_1 = require("reindent-template-literals");
const chalk_1 = __importDefault(require("chalk"));
function warnUserAboutEnablingDeveloperMode(error) {
    if (!(error?.code === 'EPERM')) {
        throw error;
    }
    if (!(process.platform === 'win32')) {
        throw error;
    }
    // eslint-disable-next-line no-console
    console.error(chalk_1.default.red((0, reindent_template_literals_1.reindent)(`
        Error: Unable to run feature tests!

        You need to enable Developer Mode in Windows to run Cucumber JS's feature tests.

        See this link for more info:
        https://docs.microsoft.com/en-us/windows/apps/get-started/developer-mode-features-and-debugging
      `)));
    process.exit(1);
}
//# sourceMappingURL=warn_user_about_enabling_developer_mode.js.map