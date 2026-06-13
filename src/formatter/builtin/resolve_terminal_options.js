"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTerminalOptions = resolveTerminalOptions;
function resolveTerminalOptions(options) {
    const includeAttachments = options.includeAttachments ?? options.printAttachments;
    const resolvedOptions = {};
    if (includeAttachments !== undefined) {
        resolvedOptions.includeAttachments = includeAttachments;
    }
    if (options.theme !== undefined) {
        resolvedOptions.theme = options.theme;
    }
    return resolvedOptions;
}
//# sourceMappingURL=resolve_terminal_options.js.map