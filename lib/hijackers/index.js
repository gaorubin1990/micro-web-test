"use strict";
/**
 * @author Kuitos
 * @since 2019-04-11
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var historyListener_1 = tslib_1.__importDefault(require("./historyListener"));
var timer_1 = tslib_1.__importDefault(require("./timer"));
var windowListener_1 = tslib_1.__importDefault(require("./windowListener"));
function hijack() {
    return [
        timer_1.default(),
        windowListener_1.default(),
        historyListener_1.default(),
    ];
}
exports.hijack = hijack;
