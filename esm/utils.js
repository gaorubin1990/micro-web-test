/**
 * @author Kuitos
 * @since 2019-05-15
 */
import * as tslib_1 from "tslib";
export function sleep(ms) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, ms); })];
        });
    });
}
export function isConstructable(fn) {
    var constructableFunctionRegex = /^function\b\s[A-Z].*/;
    var classRegex = /^class\b/;
    // 有 prototype 并且 prototype 上有定义一系列非 constructor 属性，则可以认为是一个构造函数
    return fn.prototype
        && Object.getOwnPropertyNames(fn.prototype).filter(function (k) { return k !== 'constructor'; }).length
        || constructableFunctionRegex.test(fn.toString())
        || classRegex.test(fn.toString());
}
