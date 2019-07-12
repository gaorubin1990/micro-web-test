"use strict";
/**
 * @author Kuitos
 * @since 2019-02-26
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var import_html_entry_1 = require("import-html-entry");
var lodash_1 = require("lodash");
var single_spa_1 = require("single-spa");
/**
 * 预加载静态资源，不兼容 requestIdleCallback 的浏览器不做任何动作
 * @param entry
 */
function prefetch(entry) {
    var _this = this;
    var requestIdleCallback = window.requestIdleCallback || lodash_1.noop;
    requestIdleCallback(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, getExternalScripts, getExternalStyleSheets;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, import_html_entry_1.importEntry(entry)];
                case 1:
                    _a = _b.sent(), getExternalScripts = _a.getExternalScripts, getExternalStyleSheets = _a.getExternalStyleSheets;
                    requestIdleCallback(getExternalStyleSheets);
                    requestIdleCallback(getExternalScripts);
                    return [2 /*return*/];
            }
        });
    }); });
}
exports.prefetch = prefetch;
function prefetchAfterFirstMounted(apps) {
    window.addEventListener('single-spa:first-mount', function () {
        var mountedApps = single_spa_1.getMountedApps();
        var notMountedApps = apps.filter(function (app) { return mountedApps.indexOf(app.name) === -1; });
        if (process.env.NODE_ENV === 'development') {
            console.log('prefetch starting...', notMountedApps);
        }
        notMountedApps.forEach(function (app) { return prefetch(app.entry); });
    }, { once: true });
}
exports.prefetchAfterFirstMounted = prefetchAfterFirstMounted;
