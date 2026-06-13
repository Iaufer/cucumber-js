"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sinon_1 = __importDefault(require("sinon"));
const chai_1 = require("chai");
const fake_logger_1 = require("../../test/fake_logger");
const plugin_manager_1 = require("./plugin_manager");
describe('PluginManager', () => {
    const usableEnvironment = {
        cwd: 'cwd',
        stdout: process.stdout,
        stderr: process.stderr,
        env: {},
        debug: false,
        logger: new fake_logger_1.FakeLogger(),
    };
    it('passes the correct context to the coordinator function', async () => {
        const pluginManager = new plugin_manager_1.PluginManager(usableEnvironment);
        const coordinator = sinon_1.default.fake();
        await pluginManager.initCoordinator('runCucumber', {
            type: 'plugin',
            coordinator,
        }, {});
        (0, chai_1.expect)(coordinator).to.have.been.calledOnce;
        (0, chai_1.expect)(coordinator.lastCall.firstArg.operation).to.eq('runCucumber');
        (0, chai_1.expect)(coordinator.lastCall.firstArg.on).to.exist;
        (0, chai_1.expect)(coordinator.lastCall.firstArg.options).to.deep.eq({});
        (0, chai_1.expect)(coordinator.lastCall.firstArg.logger).to.eq(usableEnvironment.logger);
        (0, chai_1.expect)(Object.keys(coordinator.lastCall.firstArg.environment)).to.deep.eq([
            'cwd',
            'stderr',
            'env',
        ]);
    });
    it('wraps errors from custom plugin coordinator functions', async () => {
        const pluginManager = new plugin_manager_1.PluginManager(usableEnvironment);
        const originalError = new Error('whoops');
        try {
            await pluginManager.initCoordinator('runCucumber', {
                type: 'plugin',
                coordinator: () => {
                    throw originalError;
                },
            }, {}, './my-plugin.mjs');
            chai_1.expect.fail('Expected error to be thrown');
        }
        catch (error) {
            (0, chai_1.expect)(error.message).to.equal('Plugin "./my-plugin.mjs" errored when trying to init');
            (0, chai_1.expect)(error.cause).to.equal(originalError);
        }
    });
    it('does not wrap errors from internal plugin coordinator functions', async () => {
        const pluginManager = new plugin_manager_1.PluginManager(usableEnvironment);
        const originalError = new Error('whoops');
        try {
            await pluginManager.initCoordinator('runCucumber', {
                type: 'plugin',
                coordinator: () => {
                    throw originalError;
                },
            }, {});
            chai_1.expect.fail('Expected error to be thrown');
        }
        catch (error) {
            (0, chai_1.expect)(error).to.equal(originalError);
        }
    });
    describe('event handlers', () => {
        it('throws error when custom plugin tries to register handler for unknown event', async () => {
            const pluginManager = new plugin_manager_1.PluginManager(usableEnvironment);
            try {
                await pluginManager.initCoordinator('runCucumber', {
                    type: 'plugin',
                    coordinator: ({ on }) => on('unknown', () => { }),
                }, {}, './my-plugin.mjs');
                chai_1.expect.fail('Expected error to be thrown');
            }
            catch (error) {
                (0, chai_1.expect)(error.message).to.equal('Plugin "./my-plugin.mjs" errored when trying to init');
                (0, chai_1.expect)(error.cause.message).to.equal('Cannot register handler for unknown event "unknown"');
            }
        });
        it(`emits void event to all handlers`, async () => {
            const pluginManager = new plugin_manager_1.PluginManager(usableEnvironment);
            const handler1 = sinon_1.default.fake();
            const handler2 = sinon_1.default.fake();
            await pluginManager.initCoordinator('runCucumber', {
                type: 'plugin',
                coordinator: ({ on }) => on('message', handler1),
            }, {});
            await pluginManager.initCoordinator('runCucumber', {
                type: 'plugin',
                coordinator: ({ on }) => on('message', handler2),
            }, {});
            const value = {
                testRunStarted: {
                    timestamp: {
                        seconds: 1,
                        nanos: 1,
                    },
                },
            };
            pluginManager.emit('message', value);
            (0, chai_1.expect)(handler1).to.have.been.calledOnceWith(value);
            (0, chai_1.expect)(handler2).to.have.been.calledOnceWith(value);
        });
        it('wraps errors from custom plugin event handlers', async () => {
            const pluginManager = new plugin_manager_1.PluginManager(usableEnvironment);
            const originalError = new Error('handler failed');
            await pluginManager.initCoordinator('runCucumber', {
                type: 'plugin',
                coordinator: ({ on }) => on('message', () => {
                    throw originalError;
                }),
            }, {}, './my-plugin.mjs');
            try {
                pluginManager.emit('message', {
                    testRunStarted: {
                        timestamp: { seconds: 1, nanos: 1 },
                    },
                });
                chai_1.expect.fail('Expected error to be thrown');
            }
            catch (error) {
                (0, chai_1.expect)(error.message).to.equal('Plugin "./my-plugin.mjs" errored when trying to handle a "message" event');
                (0, chai_1.expect)(error.cause).to.equal(originalError);
            }
        });
        it('does not wrap errors from internal plugin event handlers', async () => {
            const pluginManager = new plugin_manager_1.PluginManager(usableEnvironment);
            const originalError = new Error('handler failed');
            await pluginManager.initCoordinator('runCucumber', {
                type: 'plugin',
                coordinator: ({ on }) => on('message', () => {
                    throw originalError;
                }),
            }, {});
            try {
                pluginManager.emit('message', {
                    testRunStarted: {
                        timestamp: { seconds: 1, nanos: 1 },
                    },
                });
                chai_1.expect.fail('Expected error to be thrown');
            }
            catch (error) {
                (0, chai_1.expect)(error).to.equal(originalError);
            }
        });
    });
    describe('transformers', () => {
        it('throws error when custom plugin tries to register transformer for unknown event', async () => {
            const pluginManager = new plugin_manager_1.PluginManager(usableEnvironment);
            try {
                await pluginManager.initCoordinator('runCucumber', {
                    type: 'plugin',
                    coordinator: ({ transform }) => transform('unknown', (x) => x),
                }, {}, './my-plugin.mjs');
                chai_1.expect.fail('Expected error to be thrown');
            }
            catch (error) {
                (0, chai_1.expect)(error.message).to.equal('Plugin "./my-plugin.mjs" errored when trying to init');
                (0, chai_1.expect)(error.cause.message).to.equal('Cannot register transformer for unknown event "unknown"');
            }
        });
        const filterablePickles = [
            {
                pickle: {
                    id: 'pickle-1',
                },
            },
            {
                pickle: {
                    id: 'pickle-2',
                },
            },
            {
                pickle: {
                    id: 'pickle-3',
                },
            },
        ];
        it('should apply transforms in the order registered', async () => {
            const pluginManager = new plugin_manager_1.PluginManager(usableEnvironment);
            await pluginManager.initCoordinator('runCucumber', {
                type: 'plugin',
                coordinator: ({ transform }) => {
                    // removes last item
                    transform('pickles:filter', async (pickles) => pickles.slice(0, pickles.length - 1));
                },
            }, {});
            await pluginManager.initCoordinator('runCucumber', {
                type: 'plugin',
                coordinator: ({ transform }) => {
                    // removes pickle 3 if present
                    transform('pickles:filter', (pickles) => pickles.filter(({ pickle }) => pickle.id !== 'pickle-3'));
                },
            }, {});
            const result = await pluginManager.transform('pickles:filter', filterablePickles);
            (0, chai_1.expect)(result).to.have.length(2);
        });
        it('should treat undefined as a noop', async () => {
            const pluginManager = new plugin_manager_1.PluginManager(usableEnvironment);
            await pluginManager.initCoordinator('runCucumber', {
                type: 'plugin',
                // bail, nothing to be done
                coordinator: ({ transform }) => transform('pickles:filter', () => undefined),
            }, {});
            const result = await pluginManager.transform('pickles:filter', filterablePickles);
            (0, chai_1.expect)(result).to.eq(filterablePickles);
        });
        it('wraps errors from custom plugin transformers', async () => {
            const pluginManager = new plugin_manager_1.PluginManager(usableEnvironment);
            const originalError = new Error('transformer failed');
            await pluginManager.initCoordinator('runCucumber', {
                type: 'plugin',
                coordinator: ({ transform }) => transform('pickles:filter', () => {
                    throw originalError;
                }),
            }, {}, './my-plugin.mjs');
            try {
                await pluginManager.transform('pickles:filter', filterablePickles);
                chai_1.expect.fail('Expected error to be thrown');
            }
            catch (error) {
                (0, chai_1.expect)(error.message).to.equal('Plugin "./my-plugin.mjs" errored when trying to do a "pickles:filter" transform');
                (0, chai_1.expect)(error.cause).to.equal(originalError);
            }
        });
        it('does not wrap errors from internal plugin transformers', async () => {
            const pluginManager = new plugin_manager_1.PluginManager(usableEnvironment);
            const originalError = new Error('transformer failed');
            await pluginManager.initCoordinator('runCucumber', {
                type: 'plugin',
                coordinator: ({ transform }) => transform('pickles:filter', () => {
                    throw originalError;
                }),
            }, {});
            try {
                await pluginManager.transform('pickles:filter', filterablePickles);
                chai_1.expect.fail('Expected error to be thrown');
            }
            catch (error) {
                (0, chai_1.expect)(error).to.equal(originalError);
            }
        });
    });
    describe('cleanup', () => {
        it('calls cleanup functions from all plugins', async () => {
            const pluginManager = new plugin_manager_1.PluginManager(usableEnvironment);
            const cleanup1 = sinon_1.default.fake();
            const cleanup2 = sinon_1.default.fake();
            await pluginManager.initCoordinator('runCucumber', {
                type: 'plugin',
                coordinator: () => cleanup1,
            }, {});
            await pluginManager.initCoordinator('runCucumber', {
                type: 'plugin',
                coordinator: () => cleanup2,
            }, {});
            await pluginManager.cleanup();
            (0, chai_1.expect)(cleanup1).to.have.been.calledOnce;
            (0, chai_1.expect)(cleanup2).to.have.been.calledOnce;
        });
        it('wraps errors from custom plugin cleanup functions', async () => {
            const pluginManager = new plugin_manager_1.PluginManager(usableEnvironment);
            const originalError = new Error('cleanup failed');
            await pluginManager.initCoordinator('runCucumber', {
                type: 'plugin',
                coordinator: () => () => {
                    throw originalError;
                },
            }, {}, './my-plugin.mjs');
            try {
                await pluginManager.cleanup();
                chai_1.expect.fail('Expected error to be thrown');
            }
            catch (error) {
                (0, chai_1.expect)(error.message).to.equal('Plugin "./my-plugin.mjs" errored when trying to cleanup');
                (0, chai_1.expect)(error.cause).to.equal(originalError);
            }
        });
        it('does not wrap errors from internal plugin cleanup functions', async () => {
            const pluginManager = new plugin_manager_1.PluginManager(usableEnvironment);
            const originalError = new Error('cleanup failed');
            await pluginManager.initCoordinator('runCucumber', {
                type: 'plugin',
                coordinator: () => () => {
                    throw originalError;
                },
            }, {});
            try {
                await pluginManager.cleanup();
                chai_1.expect.fail('Expected error to be thrown');
            }
            catch (error) {
                (0, chai_1.expect)(error).to.equal(originalError);
            }
        });
    });
});
//# sourceMappingURL=plugin_manager_spec.js.map