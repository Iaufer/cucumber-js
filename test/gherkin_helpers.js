"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = parse;
exports.generatePickles = generatePickles;
exports.getPickleWithTags = getPickleWithTags;
exports.getPickleStepWithText = getPickleStepWithText;
const messages_1 = require("@cucumber/messages");
const gherkin_streams_1 = require("@cucumber/gherkin-streams");
const value_checker_1 = require("../src/value_checker");
async function parse({ data, uri, options, }) {
    const sources = [
        {
            source: {
                uri,
                data: data,
                mediaType: messages_1.SourceMediaType.TEXT_X_CUCUMBER_GHERKIN_PLAIN,
            },
        },
    ];
    return await new Promise((resolve, reject) => {
        let source;
        let gherkinDocument;
        const pickles = [];
        const envelopes = [];
        const messageStream = gherkin_streams_1.GherkinStreams.fromSources(sources, options);
        messageStream.on('data', (envelope) => {
            envelopes.push(envelope);
            if ((0, value_checker_1.doesHaveValue)(envelope.source)) {
                source = envelope.source;
            }
            if ((0, value_checker_1.doesHaveValue)(envelope.gherkinDocument)) {
                gherkinDocument = envelope.gherkinDocument;
            }
            if ((0, value_checker_1.doesHaveValue)(envelope.pickle)) {
                pickles.push(envelope.pickle);
            }
            if ((0, value_checker_1.doesHaveValue)(envelope.attachment)) {
                reject(new Error(`Parse error in '${uri}': ${envelope.attachment.body}`));
            }
        });
        messageStream.on('end', () => {
            resolve({
                envelopes,
                source,
                gherkinDocument,
                pickles,
            });
        });
        messageStream.on('error', reject);
    });
}
async function generatePickles({ data, eventBroadcaster, uri, }) {
    const { envelopes, gherkinDocument, pickles } = await parse({
        data,
        uri,
    });
    envelopes.forEach((envelope) => eventBroadcaster.emit('envelope', envelope));
    return pickles.map((pickle) => {
        return {
            gherkinDocument,
            pickle,
        };
    });
}
async function getPickleWithTags(tags) {
    const { pickles: [pickle], } = await parse({
        data: `\
Feature: a
  ${tags.join(' ')} 
  Scenario: b
    Given a step
`,
        uri: 'a.feature',
    });
    return pickle;
}
async function getPickleStepWithText(text) {
    const { pickles: [pickle], } = await parse({
        data: `\
Feature: a
  Scenario: b
    ${text}
`,
        uri: 'a.feature',
    });
    return pickle.steps[0];
}
//# sourceMappingURL=gherkin_helpers.js.map