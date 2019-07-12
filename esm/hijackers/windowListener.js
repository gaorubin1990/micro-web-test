/**
 * @author Kuitos
 * @since 2019-04-11
 */
import * as tslib_1 from "tslib";
import { noop } from 'lodash';
export default function hijack() {
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
        return noop;
    };
}
