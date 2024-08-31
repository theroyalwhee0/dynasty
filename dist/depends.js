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
//# sourceMappingURL=depends.js.map