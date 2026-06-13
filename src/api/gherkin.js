"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPicklesAndErrors = getPicklesAndErrors;
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const gherkin_1 = require("@cucumber/gherkin");
const gherkin_streams_1 = require("@cucumber/gherkin-streams");
const gherkin_utils_1 = require("@cucumber/gherkin-utils");
async function getPicklesAndErrors({ newId, cwd, sourcePaths, coordinates, onEnvelope, }) {
    const gherkinQuery = new gherkin_utils_1.Query();
    const parseErrors = [];
    await gherkinFromPaths(sourcePaths, {
        newId,
        relativeTo: cwd,
        defaultDialect: coordinates.defaultDialect,
    }, (envelope) => {
        gherkinQuery.update(envelope);
        if (envelope.parseError) {
            parseErrors.push(envelope.parseError);
        }
        onEnvelope?.(envelope);
    });
    const filterablePickles = gherkinQuery.getPickles().map((pickle) => {
        const gherkinDocument = gherkinQuery
            .getGherkinDocuments()
            .find((doc) => doc.uri === pickle.uri);
        const location = gherkinQuery.getLocation(pickle.astNodeIds[pickle.astNodeIds.length - 1]);
        return {
            gherkinDocument,
            location,
            pickle,
        };
    });
    return {
        filterablePickles,
        parseErrors,
    };
}
function getSourceUri(filePath, relativeTo) {
    if (!relativeTo) {
        return filePath;
    }
    const relativePath = node_path_1.default.relative(relativeTo, filePath);
    /*
     * Keep the original path for sources that resolve outside `relativeTo`,
     * such as virtual file systems like Bun's embedded `/$bunfs`, where a
     * relative URI would be meaningless.
     */
    return relativePath.startsWith('..') ? filePath : relativePath;
}
async function gherkinFromPaths(paths, options, onEnvelope) {
    /*
     * Read the sources ourselves rather than letting `GherkinStreams.fromPaths`
     * stream them, so we support file systems that don't implement
     * `fs.createReadStream` (e.g. Bun's embedded `/$bunfs`).
     */
    const sources = await Promise.all(paths.map(async (filePath) => (0, gherkin_1.makeSourceEnvelope)(await promises_1.default.readFile(filePath, 'utf-8'), getSourceUri(filePath, options.relativeTo))));
    return new Promise((resolve, reject) => {
        const gherkinMessageStream = gherkin_streams_1.GherkinStreams.fromSources(sources, options);
        gherkinMessageStream.on('data', onEnvelope);
        gherkinMessageStream.on('end', resolve);
        gherkinMessageStream.on('error', reject);
    });
}
//# sourceMappingURL=gherkin.js.map