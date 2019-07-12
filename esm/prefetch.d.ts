/**
 * @author Kuitos
 * @since 2019-02-26
 */
import { Entry } from 'import-html-entry';
import { RegistrableApp } from './interfaces';
/**
 * 预加载静态资源，不兼容 requestIdleCallback 的浏览器不做任何动作
 * @param entry
 */
export declare function prefetch(entry: Entry): void;
export declare function prefetchAfterFirstMounted(apps: RegistrableApp[]): void;
