"use strict";
/**
 * @author Kuitos
 * @since 2019-04-11
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var lodash_1 = require("lodash");
function hijack() {
    var listenerMap = new Map();
    var rawAddEventListener = window.addEventListener;
    var rawRemoveEventListener = window.removeEventListener;
    window.addEventListener =
        function (type, listener, options) {
            var listeners = listenerMap.get(type) || [];
            listenerMap.set(type, tslib_1.__spread(listeners, [listener]));
            return rawAddEventListener.call(window, type, listener, options);
        };
    window.removeEventListener =
        function (type, listener, options) {
            var storedTypeListeners = listenerMap.get(type);
            if (storedTypeListeners && storedTypeListeners.length && storedTypeListeners.indexOf(listener) !== -1) {
                storedTypeListeners.splice(storedTypeListeners.indexOf(listener), 1);
            }
            return rawRemoveEventListener.call(window, type, listener, options);
        };
    return function free() {
        listenerMap.forEach(function (listeners, type) { return listeners.forEach(function (listener) { return window.removeEventListener(type, listener); }); });
        window.addEventListener = rawAddEventListener.bind(window);
        window.removeEventListener = rawRemoveEventListener.bind(window);
        return lodash_1.noop;
    };
}
exports.default = hijack;
