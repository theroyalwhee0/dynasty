/**
 * Dependency marker symbol.
 */
export const DEPENDENCY = Symbol('DEPENDENCY');
/**
 * Mark an unmaked dependency as a dependency.
 * @param dependency The unmarked dependency.
 * @typeParam R The return type of the dependency.
 * @returns A marked dependency.
 */
export function markDependency(dependency) {
    return Object.assign(dependency, { [DEPENDENCY]: true });
}
/**
 * Is the value a marked dependency? Type guard.
 * @param value The value to check.
 * @typeParam R The return type of the dependency.
 * @returns True if the value is a marked dependency.
 */
export function isDependency(value) {
    return typeof value === 'function' && DEPENDENCY in value && value[DEPENDENCY] === true;
}
/**
 * Resolve async dependencies to actual values.
 * @param dependencies The dependencies to resolve.
 * @typeParam T The types for the dependencies.
 * @returns The resolved dependencies.
 */
export async function resolveDependencies(dependencies) {
    // UNSAFE: Force type to Promise Tuple.
    const unresolved = dependencies.map(item => item());
    return Promise.all(unresolved);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwZW5kcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9kZXBlbmRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sVUFBVSxHQUFrQixNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7QUF1QjlEOzs7OztHQUtHO0FBQ0gsTUFBTSxVQUFVLGNBQWMsQ0FBVSxVQUFpQztJQUNyRSxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBSWhCLFVBQVUsRUFDVixFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQ3pCLENBQUM7QUFDTixDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxNQUFNLFVBQVUsWUFBWSxDQUFVLEtBQWdDO0lBQ2xFLE9BQU8sT0FBTyxLQUFLLEtBQUssVUFBVSxJQUFJLFVBQVUsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLElBQUksQ0FBQztBQUM1RixDQUFDO0FBbUNEOzs7OztHQUtHO0FBQ0gsTUFBTSxDQUFDLEtBQUssVUFBVSxtQkFBbUIsQ0FFdkMsWUFBNkI7SUFDM0IsdUNBQXVDO0lBQ3ZDLE1BQU0sVUFBVSxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBb0IsQ0FBQztJQUN2RSxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDbkMsQ0FBQyJ9