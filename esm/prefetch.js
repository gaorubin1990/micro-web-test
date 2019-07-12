/**
 * @author Kuitos
 * @since 2019-02-26
 */
import * as tslib_1 from "tslib";
import { importEntry } from 'import-html-entry';
import { noop } from 'lodash';
import { getMountedApps } from 'single-spa';
/**
 * 预加载静态资源，不兼容 requestIdleCallback 的浏览器不做任何动作
 * @param entry
 */
export function prefetch(entry) {
    var _this = this;
    var requestIdleCallback = window.requestIdleCallback || noop;
    requestIdleCallback(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, getExternalScripts, getExternalStyleSheets;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, importEntry(entry)];
                case 1:
                    _a = _b.sent(), getExternalScripts = _a.getExternalScripts, getExternalStyleSheets = _a.getExternalStyleSheets;
                    requestIdleCallback(getExternalStyleSheets);
                    requestIdleCallback(getExternalScripts);
                    return [2 /*return*/];
            }
        });
    }); });
}
export function prefetchAfterFirstMounted(apps) {
    window.addEventListener('single-spa:first-mount', function () {
        var mountedApps = getMountedApps();
        var notMountedApps = apps.filter(function (app) { return mountedApps.indexOf(app.name) === -1; });
        if (process.env.NODE_ENV === 'development') {
            // console.log('prefetch starting...', notMountedApps);
        }
        notMountedApps.forEach(function (app) { return prefetch(app.entry); });
    }, { once: true });
}
