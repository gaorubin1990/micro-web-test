/**
 * @author Kuitos
 * @since 2019-04-25
 */
import * as tslib_1 from "tslib";
import { importEntry } from 'import-html-entry';
import { isFunction } from 'lodash';
import { registerApplication, start as startSpa } from 'single-spa';
import { prefetchAfterFirstMounted } from './prefetch';
import { genSandbox } from './sandbox';
var microApps = [];
function toArray(array) {
    return Array.isArray(array) ? array : [array];
}
export function registerMicroApps(apps, lifeCycles) {
    var _this = this;
    if (lifeCycles === void 0) { lifeCycles = {}; }
    var beforeLoad = toArray(lifeCycles.beforeLoad || []);
    var beforeMount = toArray(lifeCycles.beforeMount || []);
    var afterMount = toArray(lifeCycles.afterMount || []);
    var afterUnmount = toArray(lifeCycles.afterUnmount || []);
    microApps = tslib_1.__spread(microApps, apps);
    apps.forEach(function (app) {
        var name = app.name, entry = app.entry, render = app.render, activeRule = app.activeRule, _a = app.props, props = _a === void 0 ? {} : _a;
        registerApplication(name, function (_a) {
            var appName = _a.name;
            return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _b, appContent, execScripts, jsSandbox, mountSandbox, unmountSandbox, sandbox, _c, bootstrapApp, mount, unmount;
                var _this = this;
                return tslib_1.__generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, importEntry(entry)];
                        case 1:
                            _b = _d.sent(), appContent = _b.template, execScripts = _b.execScripts;
                            // 第一次加载设置应用可见区域 dom 结构
                            // 确保每次应用加载前容器 dom 结构已经设置完毕
                            render({ appContent: appContent, loading: true });
                            jsSandbox = window;
                            mountSandbox = function () { return Promise.resolve(); };
                            unmountSandbox = function () { return Promise.resolve(); };
                            if (useJsSandbox) {
                                sandbox = genSandbox(appName);
                                jsSandbox = sandbox.sandbox;
                                mountSandbox = sandbox.mount;
                                unmountSandbox = sandbox.unmount;
                            }
                            if (!beforeLoad.length) return [3 /*break*/, 3];
                            return [4 /*yield*/, Promise.all(beforeLoad.map(function (hook) { return hook(app); }))];
                        case 2:
                            _d.sent();
                            _d.label = 3;
                        case 3: return [4 /*yield*/, execScripts(jsSandbox)];
                        case 4:
                            _c = _d.sent(), bootstrapApp = _c.bootstrap, mount = _c.mount, unmount = _c.unmount;
                            if (!isFunction(bootstrapApp) || !isFunction(mount) || !isFunction(unmount)) {
                                throw new Error("You need to export the functional lifecycles in " + appName + " entry");
                            }
                            return [2 /*return*/, {
                                    bootstrap: [
                                        bootstrapApp,
                                    ],
                                    mount: [
                                        function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                            return tslib_1.__generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        if (!beforeMount.length) return [3 /*break*/, 2];
                                                        return [4 /*yield*/, Promise.all(beforeMount.map(function (hook) { return hook(app); }))];
                                                    case 1:
                                                        _a.sent();
                                                        _a.label = 2;
                                                    case 2: return [2 /*return*/];
                                                }
                                            });
                                        }); },
                                        mountSandbox,
                                        // 添加 mount hook, 确保每次应用加载前容器 dom 结构已经设置完毕
                                        function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                                            return [2 /*return*/, render({ appContent: appContent, loading: false })];
                                        }); }); },
                                        mount,
                                        function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                            return tslib_1.__generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        if (!afterMount.length) return [3 /*break*/, 2];
                                                        return [4 /*yield*/, Promise.all(afterMount.map(function (hook) { return hook(app); }))];
                                                    case 1:
                                                        _a.sent();
                                                        _a.label = 2;
                                                    case 2: return [2 /*return*/];
                                                }
                                            });
                                        }); },
                                    ],
                                    unmount: [
                                        unmount,
                                        unmountSandbox,
                                        function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                            return tslib_1.__generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        if (!afterUnmount.length) return [3 /*break*/, 2];
                                                        return [4 /*yield*/, Promise.all(afterUnmount.map(function (hook) { return hook(app); }))];
                                                    case 1:
                                                        _a.sent();
                                                        _a.label = 2;
                                                    case 2: return [2 /*return*/];
                                                }
                                            });
                                        }); },
                                    ],
                                }];
                    }
                });
            });
        }, activeRule, props);
    });
}
export * from './effects';
var useJsSandbox = true;
export function start(opts) {
    if (opts === void 0) { opts = {}; }
    var _a = opts.prefetch, prefetch = _a === void 0 ? true : _a, _b = opts.jsSandbox, jsSandbox = _b === void 0 ? true : _b;
    if (prefetch) {
        prefetchAfterFirstMounted(microApps);
    }
    if (jsSandbox) {
        useJsSandbox = jsSandbox;
    }
    startSpa();
}
