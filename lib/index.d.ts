/**
 * @author Kuitos
 * @since 2019-04-25
 */
import { RegistrableApp, StartOpts } from './interfaces';
declare type Lifecycle<T extends object> = (app: RegistrableApp<T>) => Promise<any>;
declare type LifeCycles<T extends object> = {
    beforeLoad?: Lifecycle<T> | Array<Lifecycle<T>>;
    beforeMount?: Lifecycle<T> | Array<Lifecycle<T>>;
    afterMount?: Lifecycle<T> | Array<Lifecycle<T>>;
    afterUnmount?: Lifecycle<T> | Array<Lifecycle<T>>;
};
export declare function registerMicroApps<T extends object = {}>(apps: Array<RegistrableApp<T>>, lifeCycles?: LifeCycles<T>): void;
export * from './effects';
export declare function start(opts?: StartOpts): void;
