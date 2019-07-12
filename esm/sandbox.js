import * as tslib_1 from "tslib";
/**
 * @author Kuitos
 * @since 2019-04-11
 */
import { isFunction } from 'lodash';
import { hijack } from './hijackers';
import { isConstructable } from './utils';
function snapshot(updatedPropsValueMap) {
    /*
     浅克隆一把
     这里是有问题的，理论上应该深克隆，但是深克隆因为不会共用引用，在某些代码里就跪了。。
     @see https://github.com/dvajs/dva/blob/master/packages/dva/src/index.js#L33-L78
     */
    var copyMap = new Map();
    updatedPropsValueMap.forEach(function (v, k) { return copyMap.set(k, v); });
    return copyMap;
}
function isPropConfigurable(target, prop) {
    var descriptor = Object.getOwnPropertyDescriptor(target, prop);
    return descriptor ? descriptor.configurable : true;
}
function setWindowProp(prop, value, toDelete) {
    if (value === undefined && toDelete) {
        delete window[prop];
    }
    else {
        if (isPropConfigurable(window, prop) && typeof prop !== 'symbol') {
            Object.defineProperty(window, prop, { writable: true, configurable: true });
            window[prop] = value;
        }
    }
}
/**
 * 生成应用运行时沙箱
 *
 * 沙箱分两个类型：
 * 1. app 环境沙箱
 *  app 环境沙箱是指应用初始化过之后，应用会在什么样的上下文环境运行。每个应用的环境沙箱只会初始化一次，因为子应用只会触发一次 bootstrap 。
 *  one-console 子应用在切换时，实际上切换的是 app 环境沙箱。
 * 2. render 沙箱
 *  子应用在 app mount 开始时生成的沙箱。每次子应用切换过后，render 沙箱都会重现初始化。
 *
 * 这么设计的目的是为了保证每个子应用切换回来之后，还能运行在应用 bootstrap 之后的环境下。
 *
 * @param appName
 */
export function genSandbox(appName) {
    // 沙箱期间新增的全局变量
    var addedPropsMapInSandbox = new Map();
    // 沙箱期间更新的全局变量
    var modifiedPropsOriginalValueMapInSandbox = new Map();
    // 持续记录更新的(新增和修改的)全局变量的 map，用于在任意时刻做 snapshot
    var currentUpdatedPropsValueMapForSnapshot = new Map();
    var freers = [];
    var sideEffectsRebuilders = [];
    // render 沙箱的上下文快照
    var renderSandboxSnapshot = null;
    var inAppSandbox = true;
    var sandbox = new Proxy(window, {
        set: function (target, p, value) {
            if (inAppSandbox) {
                if (!target.hasOwnProperty(p)) {
                    addedPropsMapInSandbox.set(p, value);
                }
                else if (!modifiedPropsOriginalValueMapInSandbox.has(p)) {
                    // 如果当前 window 对象存在该属性，且 record map 中未记录过，则记录该属性初始值
                    var originalValue = target[p];
                    modifiedPropsOriginalValueMapInSandbox.set(p, originalValue);
                }
                currentUpdatedPropsValueMapForSnapshot.set(p, value);
                // 必须重新设置 window 对象保证下次 get 时能拿到已更新的数据
                target[p] = value;
                return true;
            }
            if (process.env.NODE_ENV === 'development') {
                console.warn("Try to set window." + p.toString() + " while js sandbox destroyed or not active in " + appName + "!");
            }
            return false;
        },
        get: function (target, p) {
            var value = target[p];
            /*
            仅绑定 !isConstructable && isCallable 的函数对象，如 window.console、window.atob 这类。目前没有完美的检测方式，这里通过 prototype 中是否还有可枚举的拓展方法的方式来判断
             */
            if (isFunction(value) && !isConstructable(value)) {
                return value.bind(target);
            }
            return value;
        },
    });
    return {
        sandbox: sandbox,
        /**
         * 沙箱被 mount
         * 可能是从 bootstrap 状态进入的 mount
         * 也可能是从 unmount 之后再次唤醒进入 mount
         */
        mount: function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    /* ------------------------------------------ 因为有上下文依赖（window），以下代码执行顺序不能变 ------------------------------------------ */
                    /* ------------------------------------------ 1. 启动/恢复 快照 ------------------------------------------ */
                    // 如果沙箱已启动，表明当前方法执行上下文是在沙箱生成之后，此时对应用的状态做 snapshot，以便下次唤醒应用时直接从 snapshot 中恢复沙箱上下文
                    if (inAppSandbox) {
                        renderSandboxSnapshot = snapshot(currentUpdatedPropsValueMapForSnapshot);
                    }
                    else if (renderSandboxSnapshot) {
                        // 从 snapshot 中恢复沙箱上下文
                        renderSandboxSnapshot.forEach(function (v, p) { return setWindowProp(p, v); });
                    }
                    /* ------------------------------------------ 2. 开启全局变量补丁 ------------------------------------------*/
                    // render 沙箱启动时开始劫持各类全局监听，这就要求应用初始化阶段不应该有 事件监听/定时器 等副作用
                    freers.push.apply(freers, tslib_1.__spread(hijack()));
                    /* ------------------------------------------ 3. 重置一些初始化时的副作用 ------------------------------------------*/
                    // 存在 rebuilder 则表明有些副作用需要重建
                    if (sideEffectsRebuilders.length) {
                        sideEffectsRebuilders.forEach(function (rebuild) { return rebuild(); });
                        sideEffectsRebuilders = [];
                    }
                    inAppSandbox = true;
                    return [2 /*return*/];
                });
            });
        },
        /**
         * 恢复 global 状态，使其能回到应用加载之前的状态
         */
        unmount: function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    if (process.env.NODE_ENV === 'development') {
                        console.info(appName + " modified global properties will be restore", tslib_1.__spread(addedPropsMapInSandbox.keys(), modifiedPropsOriginalValueMapInSandbox.keys()));
                    }
                    // record the rebuilders of window side effects (event listeners or timers)
                    freers.forEach(function (free) { return sideEffectsRebuilders.push(free()); });
                    freers = [];
                    // renderSandboxSnapshot = snapshot(currentUpdatedPropsValueMapForSnapshot);
                    // restore global props to initial snapshot
                    addedPropsMapInSandbox.forEach(function (_, p) { return setWindowProp(p, undefined, true); });
                    modifiedPropsOriginalValueMapInSandbox.forEach(function (v, p) { return setWindowProp(p, v); });
                    inAppSandbox = false;
                    return [2 /*return*/];
                });
            });
        },
    };
}
