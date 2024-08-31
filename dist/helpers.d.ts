/**
 * Unknown Record.
 */
export type UnknownRecord = Record<string | number | symbol, unknown>;
/**
 * A Tuple where each element is a promise.
 * @typeParam T The tuple types.
 */
export type PromiseTuple<T extends readonly unknown[]> = {
    readonly [P in keyof T]: Promise<T[P]>;
};
/**
 * Is Promise?
 * @param value Value to check.
 * @typeParam T The type of the promise.
 * @returns Returns true if value is a promise, false otherwise.
 */
export declare function isPromise<T = unknown>(value: unknown): value is Promise<T>;
