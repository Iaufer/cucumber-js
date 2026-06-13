"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_stream_1 = __importDefault(require("node:stream"));
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const _1 = __importDefault(require("./"));
(0, mocha_1.describe)('AttachmentManager', () => {
    (0, mocha_1.describe)('create()', () => {
        (0, mocha_1.describe)('buffer', () => {
            (0, mocha_1.describe)('with mime type', () => {
                (0, mocha_1.it)('adds the data and media', function () {
                    // Arrange
                    const attachments = [];
                    const attachmentManager = new _1.default((x) => attachments.push(x));
                    // Act
                    const result = attachmentManager.create(Buffer.from('my string'), 'text/special');
                    // Assert
                    (0, chai_1.expect)(result).to.eql(undefined);
                    (0, chai_1.expect)(attachments).to.eql([
                        {
                            data: 'bXkgc3RyaW5n',
                            media: {
                                contentType: 'text/special',
                                encoding: 'BASE64',
                            },
                        },
                    ]);
                    const decodedData = Buffer.from(attachments[0].data, 'base64').toString();
                    (0, chai_1.expect)(decodedData).to.eql('my string');
                });
            });
            (0, mocha_1.describe)('without media type', () => {
                (0, mocha_1.it)('throws', function () {
                    // Arrange
                    const attachments = [];
                    const attachmentManager = new _1.default((x) => attachments.push(x));
                    let error;
                    let result;
                    // Act
                    try {
                        result = attachmentManager.create(Buffer.from('my string'));
                    }
                    catch (e) {
                        error = e;
                    }
                    // Assert
                    (0, chai_1.expect)(result).to.eql(undefined);
                    (0, chai_1.expect)(error).to.exist();
                    (0, chai_1.expect)(error.message).to.eql('Buffer attachments must specify a media type');
                });
            });
            (0, mocha_1.describe)('with mime type and filename', () => {
                (0, mocha_1.it)('adds the data and media and filename', function () {
                    // Arrange
                    const attachments = [];
                    const attachmentManager = new _1.default((x) => attachments.push(x));
                    // Act
                    const result = attachmentManager.create(Buffer.from('my string'), {
                        mediaType: 'text/special',
                        fileName: 'foo.txt',
                    });
                    // Assert
                    (0, chai_1.expect)(result).to.eql(undefined);
                    (0, chai_1.expect)(attachments).to.eql([
                        {
                            data: 'bXkgc3RyaW5n',
                            media: {
                                contentType: 'text/special',
                                encoding: 'BASE64',
                            },
                            fileName: 'foo.txt',
                        },
                    ]);
                    const decodedData = Buffer.from(attachments[0].data, 'base64').toString();
                    (0, chai_1.expect)(decodedData).to.eql('my string');
                });
            });
        });
        (0, mocha_1.describe)('readable stream', () => {
            (0, mocha_1.describe)('with mime type', () => {
                (0, mocha_1.describe)('with callback', () => {
                    (0, mocha_1.it)('does not return a promise and adds the data and media', async function () {
                        // Arrange
                        const attachments = [];
                        const attachmentManager = new _1.default((x) => attachments.push(x));
                        const readableStream = new node_stream_1.default.PassThrough();
                        let result;
                        // Act
                        await new Promise((resolve) => {
                            result = attachmentManager.create(readableStream, 'text/special', resolve);
                            setTimeout(() => {
                                readableStream.write('my string');
                                readableStream.end();
                            }, 25);
                        });
                        // Assert
                        (0, chai_1.expect)(result).to.eql(undefined);
                        (0, chai_1.expect)(attachments).to.eql([
                            {
                                data: 'bXkgc3RyaW5n',
                                media: {
                                    contentType: 'text/special',
                                    encoding: 'BASE64',
                                },
                            },
                        ]);
                        const decodedData = Buffer.from(attachments[0].data, 'base64').toString();
                        (0, chai_1.expect)(decodedData).to.eql('my string');
                    });
                });
                (0, mocha_1.describe)('without callback', () => {
                    (0, mocha_1.it)('returns a promise and adds the data and media', async function () {
                        // Arrange
                        const attachments = [];
                        const attachmentManager = new _1.default((x) => attachments.push(x));
                        const readableStream = new node_stream_1.default.PassThrough();
                        // Act
                        const result = attachmentManager.create(readableStream, 'text/special');
                        setTimeout(() => {
                            readableStream.write('my string');
                            readableStream.end();
                        }, 25);
                        await result;
                        // Assert
                        (0, chai_1.expect)(attachments).to.eql([
                            {
                                data: 'bXkgc3RyaW5n',
                                media: {
                                    contentType: 'text/special',
                                    encoding: 'BASE64',
                                },
                            },
                        ]);
                        const decodedData = Buffer.from(attachments[0].data, 'base64').toString();
                        (0, chai_1.expect)(decodedData).to.eql('my string');
                    });
                });
            });
            (0, mocha_1.describe)('with mime type and filename', () => {
                (0, mocha_1.describe)('with callback', () => {
                    (0, mocha_1.it)('does not return a promise and adds the data and media and filename', async function () {
                        // Arrange
                        const attachments = [];
                        const attachmentManager = new _1.default((x) => attachments.push(x));
                        const readableStream = new node_stream_1.default.PassThrough();
                        let result;
                        // Act
                        await new Promise((resolve) => {
                            result = attachmentManager.create(readableStream, {
                                mediaType: 'text/special',
                                fileName: 'foo.txt',
                            }, resolve);
                            setTimeout(() => {
                                readableStream.write('my string');
                                readableStream.end();
                            }, 25);
                        });
                        // Assert
                        (0, chai_1.expect)(result).to.eql(undefined);
                        (0, chai_1.expect)(attachments).to.eql([
                            {
                                data: 'bXkgc3RyaW5n',
                                media: {
                                    contentType: 'text/special',
                                    encoding: 'BASE64',
                                },
                                fileName: 'foo.txt',
                            },
                        ]);
                        const decodedData = Buffer.from(attachments[0].data, 'base64').toString();
                        (0, chai_1.expect)(decodedData).to.eql('my string');
                    });
                });
                (0, mocha_1.describe)('without callback', () => {
                    (0, mocha_1.it)('returns a promise and adds the data and media and filename', async function () {
                        // Arrange
                        const attachments = [];
                        const attachmentManager = new _1.default((x) => attachments.push(x));
                        const readableStream = new node_stream_1.default.PassThrough();
                        // Act
                        const result = attachmentManager.create(readableStream, {
                            mediaType: 'text/special',
                            fileName: 'foo.txt',
                        });
                        setTimeout(() => {
                            readableStream.write('my string');
                            readableStream.end();
                        }, 25);
                        await result;
                        // Assert
                        (0, chai_1.expect)(attachments).to.eql([
                            {
                                data: 'bXkgc3RyaW5n',
                                media: {
                                    contentType: 'text/special',
                                    encoding: 'BASE64',
                                },
                                fileName: 'foo.txt',
                            },
                        ]);
                        const decodedData = Buffer.from(attachments[0].data, 'base64').toString();
                        (0, chai_1.expect)(decodedData).to.eql('my string');
                    });
                });
            });
            (0, mocha_1.describe)('without media type', () => {
                (0, mocha_1.it)('throws', function () {
                    // Arrange
                    const attachments = [];
                    const attachmentManager = new _1.default((x) => attachments.push(x));
                    const readableStream = new node_stream_1.default.PassThrough();
                    let error;
                    let result;
                    // Act
                    try {
                        result = attachmentManager.create(readableStream);
                    }
                    catch (e) {
                        error = e;
                    }
                    // Assert
                    (0, chai_1.expect)(result).to.eql(undefined);
                    (0, chai_1.expect)(error).to.exist();
                    (0, chai_1.expect)(error.message).to.eql('Stream attachments must specify a media type');
                });
            });
        });
        (0, mocha_1.describe)('string', () => {
            (0, mocha_1.describe)('with media type', () => {
                (0, mocha_1.it)('adds the data and media', function () {
                    // Arrange
                    const attachments = [];
                    const attachmentManager = new _1.default((x) => attachments.push(x));
                    // Act
                    const result = attachmentManager.create('my string', 'text/special');
                    // Assert
                    (0, chai_1.expect)(result).to.eql(undefined);
                    (0, chai_1.expect)(attachments).to.eql([
                        {
                            data: 'my string',
                            media: {
                                contentType: 'text/special',
                                encoding: 'IDENTITY',
                            },
                        },
                    ]);
                });
            });
            (0, mocha_1.describe)('with media type, already base64 encoded', () => {
                (0, mocha_1.it)('adds the data and media', function () {
                    // Arrange
                    const attachments = [];
                    const attachmentManager = new _1.default((x) => attachments.push(x));
                    // Act
                    const result = attachmentManager.create(Buffer.from('my string', 'utf8').toString('base64'), 'base64:text/special');
                    // Assert
                    (0, chai_1.expect)(result).to.eql(undefined);
                    (0, chai_1.expect)(attachments).to.eql([
                        {
                            data: 'bXkgc3RyaW5n',
                            media: {
                                contentType: 'text/special',
                                encoding: 'BASE64',
                            },
                        },
                    ]);
                });
            });
            (0, mocha_1.describe)('without mime type', () => {
                (0, mocha_1.it)('adds the data with the default mime type', function () {
                    // Arrange
                    const attachments = [];
                    const attachmentManager = new _1.default((x) => attachments.push(x));
                    // Act
                    const result = attachmentManager.create('my string');
                    // Assert
                    (0, chai_1.expect)(result).to.eql(undefined);
                    (0, chai_1.expect)(attachments).to.eql([
                        {
                            data: 'my string',
                            media: {
                                contentType: 'text/plain',
                                encoding: 'IDENTITY',
                            },
                        },
                    ]);
                });
            });
            (0, mocha_1.describe)('with media type and filename', () => {
                (0, mocha_1.it)('adds the data and media and filename', function () {
                    // Arrange
                    const attachments = [];
                    const attachmentManager = new _1.default((x) => attachments.push(x));
                    // Act
                    const result = attachmentManager.create('my string', {
                        mediaType: 'text/special',
                        fileName: 'foo.txt',
                    });
                    // Assert
                    (0, chai_1.expect)(result).to.eql(undefined);
                    (0, chai_1.expect)(attachments).to.eql([
                        {
                            data: 'my string',
                            media: {
                                contentType: 'text/special',
                                encoding: 'IDENTITY',
                            },
                            fileName: 'foo.txt',
                        },
                    ]);
                });
            });
        });
        (0, mocha_1.describe)('log', () => {
            (0, mocha_1.it)('adds a string attachment with the appropriate mime type', function () {
                // Arrange
                const attachments = [];
                const attachmentManager = new _1.default((x) => attachments.push(x));
                // Act
                const result = attachmentManager.log('stuff happened');
                // Assert
                (0, chai_1.expect)(result).to.eql(undefined);
                (0, chai_1.expect)(attachments).to.eql([
                    {
                        data: 'stuff happened',
                        media: {
                            contentType: 'text/x.cucumber.log+plain',
                            encoding: 'IDENTITY',
                        },
                    },
                ]);
            });
        });
        (0, mocha_1.describe)('link', () => {
            (0, mocha_1.it)('adds a string attachment with the appropriate mime type', function () {
                // Arrange
                const attachments = [];
                const attachmentManager = new _1.default((x) => attachments.push(x));
                // Act
                const result = attachmentManager.link('https://github.com/cucumber/cucumber-js');
                // Assert
                (0, chai_1.expect)(result).to.eql(undefined);
                (0, chai_1.expect)(attachments).to.eql([
                    {
                        data: 'https://github.com/cucumber/cucumber-js',
                        media: {
                            contentType: 'text/uri-list',
                            encoding: 'IDENTITY',
                        },
                    },
                ]);
            });
            (0, mocha_1.it)('adds multiple urls delimited by newlines', function () {
                // Arrange
                const attachments = [];
                const attachmentManager = new _1.default((x) => attachments.push(x));
                // Act
                const result = attachmentManager.link('https://github.com/cucumber/cucumber-js', 'https://github.com/cucumber/cucumber-jvm', 'https://github.com/cucumber/cucumber-ruby');
                // Assert
                (0, chai_1.expect)(result).to.eql(undefined);
                (0, chai_1.expect)(attachments).to.eql([
                    {
                        data: 'https://github.com/cucumber/cucumber-js\nhttps://github.com/cucumber/cucumber-jvm\nhttps://github.com/cucumber/cucumber-ruby',
                        media: {
                            contentType: 'text/uri-list',
                            encoding: 'IDENTITY',
                        },
                    },
                ]);
            });
        });
        (0, mocha_1.describe)('unsupported data type', () => {
            (0, mocha_1.it)('throws', function () {
                // Arrange
                const attachments = [];
                const attachmentManager = new _1.default((x) => attachments.push(x));
                let error;
                let result;
                // Act
                try {
                    const obj = {};
                    result = attachmentManager.create(obj, 'object/special');
                }
                catch (e) {
                    error = e;
                }
                // Assert
                (0, chai_1.expect)(result).to.eql(undefined);
                (0, chai_1.expect)(error).to.exist();
                (0, chai_1.expect)(error.message).to.eql('Invalid attachment data: must be a buffer, readable stream, or string');
            });
        });
    });
});
//# sourceMappingURL=index_spec.js.map