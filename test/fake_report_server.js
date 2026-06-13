"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_stream_1 = require("node:stream");
const node_http_1 = __importDefault(require("node:http"));
const express_1 = __importDefault(require("express"));
const value_checker_1 = require("../src/value_checker");
/**
 * Fake implementation of the same report server that backs Cucumber Reports
 * (https://messages.cucumber.io). Used for testing only.
 */
class FakeReportServer {
    port;
    server;
    receivedBodies = Buffer.alloc(0);
    receivedHeaders = {};
    failOnTouch = false;
    failOnUpload = false;
    constructor(port) {
        this.port = port;
        const app = (0, express_1.default)();
        app.put('/s3', (req, res) => {
            if (this.failOnUpload) {
                res.status(500).end();
                return;
            }
            this.receivedHeaders = { ...this.receivedHeaders, ...req.headers };
            const captureBodyStream = new node_stream_1.Writable({
                write: (chunk, encoding, callback) => {
                    this.receivedBodies = Buffer.concat([this.receivedBodies, chunk]);
                    callback();
                },
            });
            (0, node_stream_1.pipeline)(req, captureBodyStream, (err) => {
                if ((0, value_checker_1.doesHaveValue)(err)) {
                    res.status(500).end(err.stack);
                    return;
                }
                res.end('Do not display this response');
            });
        });
        app.get('/api/reports', (req, res) => {
            if (this.failOnTouch) {
                res.status(500).end('Not a useful error message');
                return;
            }
            this.receivedHeaders = { ...this.receivedHeaders, ...req.headers };
            const token = extractAuthorizationToken(req.headers.authorization);
            if (token && !isValidUUID(token)) {
                res.status(401).end(`┌─────────────────────┐
│ Error invalid token │
└─────────────────────┘
`);
                return;
            }
            res.setHeader('Location', `http://localhost:${this.port}/s3`);
            res.status(202);
            res.end(`┌──────────────────────────────────────────────────────────────────────────┐
│ View your Cucumber Report at:                                            │
│ https://reports.cucumber.io/reports/f318d9ec-5a3d-4727-adec-bd7b69e2edd3 │
│                                                                          │
│ This report will self-destruct in 24h unless it is claimed or deleted.   │
└──────────────────────────────────────────────────────────────────────────┘
`);
        });
        this.server = node_http_1.default.createServer(app);
    }
    async start() {
        return new Promise((resolve) => this.server.listen(this.port, () => resolve()));
    }
    /**
     * @return all the received request bodies
     */
    async stop() {
        return new Promise((resolve, reject) => {
            this.server.close((err) => {
                if ((0, value_checker_1.doesHaveValue)(err))
                    return reject(err);
                resolve(this.receivedBodies);
            });
        });
    }
    get started() {
        return this.server.listening;
    }
}
exports.default = FakeReportServer;
function extractAuthorizationToken(authorizationHeader) {
    if (!authorizationHeader)
        return null;
    const tokenMatch = authorizationHeader.match(/Bearer (.*)/);
    return tokenMatch ? tokenMatch[1] : null;
}
function isValidUUID(token) {
    const v4 = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    return v4.test(token);
}
//# sourceMappingURL=fake_report_server.js.map