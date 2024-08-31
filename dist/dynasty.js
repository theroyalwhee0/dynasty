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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYXN0eS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9keW5hc3R5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sSUFBSSxNQUFNLGFBQWEsQ0FBQztBQUMvQixPQUFPLEVBQThDLFlBQVksRUFBRSxjQUFjLEVBQW9CLG1CQUFtQixFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQy9JLE9BQU8sRUFBRSxTQUFTLEVBQWlCLE1BQU0sY0FBYyxDQUFDO0FBQ3hELE9BQU8sRUFBVSxhQUFhLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFnQnBEOzs7R0FHRztBQUNILE1BQU0sT0FBTyxPQUFPO0lBQ2hCOzs7T0FHRztJQUNILE1BQU0sQ0FBQyxNQUFNO1FBQ1QsT0FBTyxJQUFJLE9BQU8sRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxNQUFNLENBQUMsT0FBTyxDQUNWLE9BQStCO1FBRS9CLE9BQU8sQ0FBQyxHQUFHLElBQVcsRUFBRSxFQUFFLENBQUMsSUFBSSxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILElBQUksQ0FDQyxPQUE0QixFQUFFLFlBQWlDO1FBQ2hFLE9BQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRTtZQUNsQyxPQUFPLE9BQU8sQ0FBQyxHQUFHLE1BQU0sbUJBQW1CLENBQVEsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUN0RSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1IsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxJQUFJLENBQ0MsT0FBNEIsRUFBRSxZQUFpQztRQUNoRSxPQUFPLGNBQWMsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUM3QixPQUFPLE9BQU8sQ0FBQyxHQUFHLE1BQU0sbUJBQW1CLENBQVEsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUN0RSxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILEtBQUssQ0FBVSxLQUFRO1FBQ25CLE9BQU8sY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILE1BQU0sQ0FDRixHQUF3QjtRQUV4QixPQUFPLGNBQWMsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUM3QixNQUFNLE1BQU0sR0FBa0IsRUFBRSxDQUFDO1lBQ2pDLEtBQUssTUFBTSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7Z0JBQ3BCLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDdkIsTUFBTSxDQUFDLEdBQUcsQ0FBQztvQkFDUCxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSzt3QkFDMUIsQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLEVBQUU7NEJBQ2pDLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDeEIsQ0FBQztZQUNELHVDQUF1QztZQUN2QyxPQUFPLE1BQTZCLENBQUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxNQUFNLENBQWdDLE9BQW9CO1FBQ3RELE9BQU8sSUFBSSxhQUFhLENBQUksSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILEtBQUssQ0FBQyxLQUFLLENBQ1AsR0FBRyxZQUE2QjtRQUVoQyxPQUFPLG1CQUFtQixDQUFJLFlBQVksQ0FBQyxDQUFDO0lBQ2hELENBQUM7Q0FDSjtBQUVEOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxPQUFPLENBQUMifQ==