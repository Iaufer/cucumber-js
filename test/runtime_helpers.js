"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildOptions = buildOptions;
exports.buildSupportCodeLibrary = buildSupportCodeLibrary;
const messages_1 = require("@cucumber/messages");
const support_code_library_builder_1 = require("../src/support_code_library_builder");
const value_checker_1 = require("../src/value_checker");
function buildOptions(overrides) {
    return {
        dryRun: false,
        failFast: false,
        filterStacktraces: false,
        retry: 0,
        retryTagFilter: '',
        strict: true,
        worldParameters: {},
        ...overrides,
    };
}
function buildSupportCodeLibrary(cwd = __dirname, fn = null) {
    if (typeof cwd === 'function') {
        fn = cwd;
        cwd = __dirname;
    }
    const supportCodeLibraryBuilder = new support_code_library_builder_1.SupportCodeLibraryBuilder();
    supportCodeLibraryBuilder.reset(cwd, messages_1.IdGenerator.incrementing());
    if ((0, value_checker_1.doesHaveValue)(fn)) {
        fn(supportCodeLibraryBuilder.methods);
    }
    return supportCodeLibraryBuilder.finalize();
}
//# sourceMappingURL=runtime_helpers.js.map