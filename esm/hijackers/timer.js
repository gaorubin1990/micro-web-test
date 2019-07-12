/**
 * @author Kuitos
 * @since 2019-04-11
 */
import * as tslib_1 from "tslib";
import { noop } from 'lodash';
import { sleep } from '../utils';
export default function hijack() {
    var rawWindowInterval = window.setInterval.bind(window);
    var rawWindowTimeout = window.setTimeout.bind(window);
    var timerIds = [];
    var intervalIds = [];
    window.setInterval = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        // @ts-ignore
        var intervalId = rawWindowInterval.apply(void 0, tslib_1.__spread(args));
        intervalIds.push(intervalId);
        return intervalId;
    };
    window.setTimeout = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        // @ts-ignore
        var timerId = rawWindowTimeout.apply(void 0, tslib_1.__spread(args));
        timerIds.push(timerId);
        return timerId;
    };
    return function free() {
        var _this = this;
        window.setInterval = rawWindowInterval;
        window.setTimeout = rawWindowTimeout;
        timerIds.forEach(function (id) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // 延迟 timeout 的清理，因为可能会有动画还没完成
                    return [4 /*yield*/, sleep(500)];
                    case 1:
                        // 延迟 timeout 的清理，因为可能会有动画还没完成
                        _a.sent();
                        window.clearTimeout(id);
                        return [2 /*return*/];
                }
            });
        }); });
        intervalIds.forEach(function (id) {
            window.clearInterval(id);
        });
        return noop;
    };
}
