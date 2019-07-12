/**
 * @author Kuitos
 * @since 2019-02-19
 */
import { getMountedApps, navigateToUrl } from 'single-spa';
export function runDefaultMountEffects(defaultAppLink) {
    window.addEventListener('single-spa:no-app-change', function () {
        var mountedApps = getMountedApps();
        if (!mountedApps.length) {
            navigateToUrl(defaultAppLink);
        }
    }, { once: true });
}
