import type { PromiseTuple, UnknownRecord } from './helpers';

/**
 * Dependency marker symbol.
 */
export const DEPENDENCY: unique symbol = Symbol('DEPENDENCY');

/**
 * A Dependency that does not have the marker.
 * @typeParam R The return type of the dependency.
 */
export type UnmarkedDependency<R> = () => Promise<R>;

/**
 * A Dependency marker object.
 */
export interface DependencyMarker {
    readonly [DEPENDENCY]: true
}

/**
 * A async Dependency that can be resolved to a value.
 * @typeParam R The return type of the dependency.
 */
export interface Dependency<R> extends DependencyMarker {
    (): Promise<R>
}

/**
 * Mark an unmaked dependency as a dependency.
 * @param dependency The unmarked dependency.
 * @typeParam R The return type of the dependency.
 * @returns A marked dependency.
 */
export function markDependency<const R>(dependency: UnmarkedDependency<R>): Dependency<R> {
    return Object.assign<
        UnmarkedDependency<R>,
        DependencyMarker
    >(
        dependency,
        { [DEPENDENCY]: true }
    );
}

/**
 * Is the value a marked dependency? Type guard.
 * @param value The value to check.
 * @typeParam R The return type of the dependency.
 * @returns True if the value is a marked dependency.
 */
export function isDependency<const R>(value: UnmarkedDependency<R> | R): value is Dependency<R> {
    return typeof value === 'function' && DEPENDENCY in value && value[DEPENDENCY] === true;
}

/**
 * A tuple of async Dependencies that can be resolved to values.
 * @typeParam TArgs The argument types supplied to the dependency.
 */
export type Dependencies<TArgs extends readonly unknown[]> = {
    readonly [P in keyof TArgs]: Dependency<TArgs[P]>;
};

/**
 * A record of resolvable values.
 * The values may be Promises, Dependencies, or plain values.
 * @typeParam R The record type.
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
 * The result of transforming a ResolvableRecord to a Dependency.
 * @typeParam T The ResolvableRecord type.
 * @typeParam R The record type.
 */
export type DependencyRecord<T extends ResolvableRecord<R>, R extends UnknownRecord = UnknownRecord> = {
    readonly [K in keyof T]: (
        T[K] extends Dependency<infer U> ? U : T[K]
    );
};

/**
 * Resolve async dependencies to actual values.
 * @param dependencies The dependencies to resolve.
 * @typeParam T The types for the dependencies.
 * @returns The resolved dependencies.
 */
export async function resolveDependencies<
    const T extends readonly unknown[],
>(dependencies: Dependencies<T>): Promise<T> {
    // UNSAFE: Force type to Promise Tuple.
    const unresolved = dependencies.map(item => item()) as PromiseTuple<T>;
    return Promise.all(unresolved);
}
