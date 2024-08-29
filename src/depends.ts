import type { PromiseTuple, UnknownRecord } from './helpers';

/**
 * Dependency marker symbol.
 */
export const DEPENDENCY: unique symbol = Symbol('DEPENDENCY');

/**
 * A Dependency that does not have the marker.
 */
export type UnmarkedDependency<T> = () => Promise<T>;

/**
 * A Dependency marker object.
 */
export interface DependencyMarker {
    readonly [DEPENDENCY]: true
}

/**
 * A async Dependency that can be resolved to a value.
 */
export interface Dependency<T> extends DependencyMarker {
    (): Promise<T>
}

/**
 * Mark an unmaked dependency as a dependency.
 * @param dependency The unmarked dependency.
 * @returns A marked dependency.
 */
export function markDependency<const T>(dependency: UnmarkedDependency<T>): Dependency<T> {
    return Object.assign<
        UnmarkedDependency<T>,
        DependencyMarker
    >(
        dependency,
        { [DEPENDENCY]: true }
    );
}

/**
 * Is the value a marked dependency? Type guard.
 * @param value The value to check.
 * @returns True if the value is a marked dependency.
 */
export function isDependency<const T>(value: UnmarkedDependency<T> | T): value is Dependency<T> {
    return typeof value === 'function' && DEPENDENCY in value && value[DEPENDENCY] === true;
}

/**
 * A tuple of async Dependencies that can be resolved to values.
 */
export type Dependencies<TArgs extends readonly unknown[]> = {
    readonly [P in keyof TArgs]: Dependency<TArgs[P]>;
};

/**
 * A record of resolvable values.
 * The values may be Promises, Dependencies, or plain values.
 */
export type ResolvableRecord<R extends UnknownRecord> = {
    readonly [P in keyof R]: (
        Promise<R[P]> |
        Dependency<R[P]> |
        R[P]
    )
};

/**
 * Dependency Record.
 * Builds an resolved Record type from a ResolvableRecord.
 */
export type DependencyRecord<T extends ResolvableRecord<R>, R extends UnknownRecord = UnknownRecord> = {
    readonly [K in keyof T]: (
        T[K] extends Dependency<infer U> ? U : T[K]
    );
};

/**
 * Resolve async dependencies to actual values.
 * @param dependencies The dependencies to resolve.
 * @returns The resolved dependencies.
 */
export async function resolveDependencies<
    const T extends readonly unknown[],
>(dependencies: Dependencies<T>): Promise<T> {
    // UNSAFE: Force type to Promise Tuple.
    const unresolved = dependencies.map(item => item()) as PromiseTuple<T>;
    return Promise.all(unresolved);
}
