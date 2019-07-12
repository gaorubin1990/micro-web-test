"use strict";
/**
 * @author Kuitos
 * @since 2019-05-15
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
function sleep(ms) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, ms); })];
        });
    });
}
exports.sleep = sleep;
function isConstructable(fn) {
    var constructableFunctionRegex = /^function\b\s[A-Z].*/;
    var classRegex = /^class\b/;
    // 有 prototype 并且 prototype 上有定义一系列非 constructor 属性，则可以认为是一个构造函数
    return fn.prototype
        && Object.getOwnPropertyNames(fn.prototype).filter(function (k) { return k !== 'constructor'; }).length
        || constructableFunctionRegex.test(fn.toString())
        || classRegex.test(fn.toString());
}
exports.isConstructable = isConstructable;
