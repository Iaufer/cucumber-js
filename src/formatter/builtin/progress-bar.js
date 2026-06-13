"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pretty_formatter_1 = require("@cucumber/pretty-formatter");
const resolve_terminal_options_1 = require("./resolve_terminal_options");
exports.default = {
    type: 'formatter',
    formatter({ on, stream, options }) {
        const printer = new pretty_formatter_1.ProgressBarPrinter({
            stream: stream,
            options: {
                ...(0, resolve_terminal_options_1.resolveTerminalOptions)(options),
                interference: {
                    mode: 'suppress',
                    streams: [process.stdout, process.stderr],
                },
                summarise: true,
            },
        });
        on('message', (envelope) => printer.update(envelope));
    },
};
//# sourceMappingURL=progress-bar.js.map