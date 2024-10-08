import once from 'lodash.once';
import { isDependency, markDependency, resolveDependencies } from './depends.js';
import { isPromise } from './helpers.js';
import { Configuration } from './config.js';
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
    static newable(factory) {
        return (...args) => new factory(...args);
    }
    /**
     * A singleton. Create a dependency that is resolved once.
     * @param factory The factory function.
     * @param dependencies The dependencies to pass to the factory function.
     * @typeParam TArgs The argument types for the FactoryFn. Generally inferred.
     * @typeParam R The return type. Generally inferred.
     * @returns The dependency. Resolved on use.
     */
    once(factory, dependencies) {
        return markDependency(once(async () => {
            return factory(...await resolveDependencies(dependencies));
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
    many(factory, dependencies) {
        return markDependency(async () => {
            return factory(...await resolveDependencies(dependencies));
        });
    }
    /**
     * Create a dependency that wraps a value.
     * @param value The value to wrap.
     * @typeParam T The type of the value.
     * @returns The dependency. Resolved on use.
     */
    value(value) {
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
    record(rec) {
        return markDependency(async () => {
            const result = {};
            for (const key in rec) {
                const value = rec[key];
                result[key] =
                    isPromise(value) ? await value
                        : isDependency(value) ? await value()
                            : value;
            }
            // UNSAFE: Force type on UnknownRecord.
            return result;
        });
    }
    /**
     * Configuration.
     * @param initial The initial configuration value.
     * @typeParam C The type of the configuration. Usually supplied.
     * @returns The configuration.
     */
    config(initial) {
        return new Configuration(this, initial);
    }
    /**
     * Resolve a list of dependencies.
     * @param dependencies A list of dependencies to resolve.
     * @typeParam R The return types of the dependencies. Generally inferred.
     * @returns The values of the resolved dependencies.
     */
    async start(...dependencies) {
        return resolveDependencies(dependencies);
    }
}
/**
 * Export static utility methods.
 */
export const { newable } = Dynasty;
//# sourceMappingURL=dynasty.js.map