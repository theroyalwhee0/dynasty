/**
 * Promise Tuple.
 */
export type PromiseTuple<T extends readonly unknown[]> = {
    readonly [P in keyof T]: Promise<T[P]>
};

/**
 * Unknown Record.
 */
export type UnknownRecord = Record<string | number | symbol, unknown>;

/**
 * Is Promise?
 */
export function isPromise<T = unknown>(value: unknown): value is Promise<T> {
    return value instanceof Promise;
}
