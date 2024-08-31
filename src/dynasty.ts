import once from 'lodash.once';
import { Dependencies, Dependency, DependencyRecord, isDependency, markDependency, ResolvableRecord, resolveDependencies } from './depends.js';
import { isPromise, UnknownRecord } from './helpers.js';
import { Config, Configuration } from './config.js';

/**
 * A factory function that creates a value with a list of arguments.
 * @typeParam TArgs The argument types for the FactoryFn.
 * @typeParam R The return type.
 */
export type FactoryFn<TArgs extends readonly unknown[], R> = (...args: TArgs) => R | Promise<R>;

/**
 * A factory function that creates an instance of a class with a list of arguments.
 * @typeParam TArgs The argument types for the FactoryClass.
 * @typeParam R The return type.
 */
export type FactoryClass<TArgs extends readonly unknown[], R> = new (...args: TArgs) => R;

/**
 * Dynasty is a simple Dependency Injection container.
 * This is the primary class for creating and managing dependencies.
 */
export class Dynasty {
    /**
     * Create a new Dynast instance.
     * @returns A new Dynasty instance.
     */
    static create() {
        return new Dynasty();
    }

    /**
     * Wrap a newable class/function in a factory function.
     * @param factory The newable class/function.
     * @typeParam TArgs The argument types for the FactoryClass. Generally inferred.
     * @typeParam R The return type. Generally inferred.
     * @returns A callable factory function.
     */
    static newable<const TArgs extends readonly unknown[], const R>(
        factory: FactoryClass<TArgs, R>
    ): FactoryFn<TArgs, R> {
        return (...args: TArgs) => new factory(...args);
    }

    /**
     * A singleton. Create a dependency that is resolved once.
     * @param factory The factory function.
     * @param dependencies The dependencies to pass to the factory function.
     * @typeParam TArgs The argument types for the FactoryFn. Generally inferred.
     * @typeParam R The return type. Generally inferred.
     * @returns The dependency. Resolved on use.
     */
    once<TArgs extends readonly unknown[], const R>
        (factory: FactoryFn<TArgs, R>, dependencies: Dependencies<TArgs>): Dependency<R> {
        return markDependency(once(async () => {
            return factory(...await resolveDependencies<TArgs>(dependencies));
        }));
    }

    /**
     * Create a dependency that is resolved every time it is used.
     * @param factory The factory function.
     * @param dependencies The dependencies to pass to the factory function.
     * @typeParam TArgs The argument types for the FactoryFn. Generally inferred.
     * @typeParam R The return type. Generally inferred.
     * @returns The dependency. Resolved on use.
     */
    many<TArgs extends readonly unknown[], const R>
        (factory: FactoryFn<TArgs, R>, dependencies: Dependencies<TArgs>): Dependency<R> {
        return markDependency(async () => {
            return factory(...await resolveDependencies<TArgs>(dependencies));
        });
    }

    /**
     * Create a dependency that wraps a value.
     * @param value The value to wrap.
     * @typeParam T The type of the value.
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
     * @typeParam T The type of the record. Generally inferred.
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
     * @typeParam C The type of the configuration. Usually supplied.
     * @returns The configuration.
     */
    config<const C extends UnknownRecord>(initial: Readonly<C>): Config<C> {
        return new Configuration<C>(this, initial);
    }

    /**
     * Resolve a list of dependencies.
     * @param dependencies A list of dependencies to resolve.
     * @typeParam R The return types of the dependencies. Generally inferred.
     * @returns The values of the resolved dependencies.
     */
    async start<const R extends readonly unknown[]>(
        ...dependencies: Dependencies<R>
    ): Promise<R> {
        return resolveDependencies<R>(dependencies);
    }
}

/**
 * Export static utility methods.
 */
export const { newable } = Dynasty;
