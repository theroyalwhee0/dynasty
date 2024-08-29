import once from 'lodash.once';
import { Dependencies, Dependency, DependencyRecord, isDependency, markDependency, ResolvableRecord, resolveDependencies } from './depends.js';
import { isPromise, UnknownRecord } from './helpers.js';
import { Config } from './config.js';

/**
 * A factory function that creates a value with a list of arguments.
 */
export type FactoryFn<TArgs extends readonly unknown[], T> = (...args: TArgs) => T | Promise<T>;

/**
 * A factory function that creates an instance of a class with a list of arguments.
 */
export type FactoryClass<TArgs extends readonly unknown[], T> = new (...args: TArgs) => T;

/**
 * Dynasty is a simple Dependency Injection container.
 */
export class Dynasty {
    /**
     * Create a new Dynasty container.
     * @returns A new Dynasty container.
     */
    static create() {
        return new Dynasty();
    }

    /**
     * Wrap a newable class/function in a factory function.
     * @param factory The newable class/function.
     * @returns A factory function.
     */
    static newable<const TArgs extends readonly unknown[], const T>(
        factory: FactoryClass<TArgs, T>
    ): FactoryFn<TArgs, T> {
        return (...args: TArgs) => new factory(...args);
    }

    /**
     * A singleton. Create a dependency that is resolved once.
     * @param factory The factory function.
     * @param dependencies The dependencies to pass to the factory function.
     * @returns The dependency. Resolved on use.
     */
    once<TArgs extends readonly unknown[], const T>
        (factory: FactoryFn<TArgs, T>, dependencies: Dependencies<TArgs>): Dependency<T> {
        return markDependency(once(async () => {
            return factory(...await resolveDependencies<TArgs>(dependencies));
        }));
    }

    /**
     * Create a dependency that is resolved every time it is used.
     * @param factory The factory function.
     * @param dependencies The dependencies to pass to the factory function.
     * @returns The dependency. Resolved on use.
     */
    many<TArgs extends readonly unknown[], const T>
        (factory: FactoryFn<TArgs, T>, dependencies: Dependencies<TArgs>): Dependency<T> {
        return markDependency(async () => {
            return factory(...await resolveDependencies<TArgs>(dependencies));
        });
    }

    /**
     * Create a dependency that wraps a value.
     * @param value The value to wrap.
     * @returns The dependency. Resolved on use.
     */
    value<const T>(value: T): Dependency<T> {
        return markDependency(() => Promise.resolve(value));
    }

    /**
     * Record dependency.
     * Create a dependency from a record that has resolvable values.
     * The record can contain promises, dependencies, or plain values.
     * @param rec The record to use.
     * @returns The record dependency.
     */
    record<const T extends Readonly<UnknownRecord>>(
        rec: ResolvableRecord<T>
    ): Dependency<DependencyRecord<T>> {
        return markDependency(async () => {
            const result: UnknownRecord = {};
            for (const key in rec) {
                const value = rec[key];
                result[key] =
                    isPromise(value) ? await value
                        : isDependency(value) ? await value()
                            : value;
            }
            // UNSAFE: Force type on UnknownRecord.
            return result as DependencyRecord<T>;
        });
    }

    /**
     * Configuration.
     * @param initial The initial configuration value.
     * @returns The configuration.
     */
    config<const C extends UnknownRecord>(initial: Readonly<C>): Config<C> {
        return new Config<C>(this, initial);
    }

    /**
     * Resolve a list of dependencies.
     * @param dependencies A list of dependencies to resolve.
     * @returns The values of the resolved dependencies.
     */
    async start<const T extends readonly unknown[]>(
        ...dependencies: Dependencies<T>
    ): Promise<T> {
        return resolveDependencies<T>(dependencies);
    }
}

/**
 * Export static utility methods.
 */
export const { newable } = Dynasty;
