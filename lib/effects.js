"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @author Kuitos
 * @since 2019-02-19
 */
var single_spa_1 = require("single-spa");
function runDefaultMountEffects(defaultAppLink) {
    window.addEventListener('single-spa:no-app-change', function () {
        var mountedApps = single_spa_1.getMountedApps();
        if (!mountedApps.length) {
            single_spa_1.navigateToUrl(defaultAppLink);
        }
    }, { once: true });
}
exports.runDefaultMountEffects = runDefaultMountEffects;
