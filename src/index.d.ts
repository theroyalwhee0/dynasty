declare module "@theroyalwhee0/dynasty" {
  type DynastyParamFn = () => unknown;
  type DynastyCreatorFn = () => unknown;
  /**
   * @param dyn - The function which returns the injected dependencies.
   * @template TDeps - Data structure for dependencies being returned from dyn().
   */
  type DynastyFactoryFn = (dyn?: <TDeps>() => TDeps) => unknown;
  type DynastyMemberFns = {
    /**
     * Adds a node to the dependency tree.
     * @param name - Unique name for the node.
     * @param creatorFn - A member creator function (call, once, value, etc.).
     * @param props - See other members for remaining parameters.
     * @returns A promise that doesn't need to be waited on.
     * ```
     * add('name1', once(myFactory));
     * ```
     */
    add: (
      name: string,
      creatorFn: Promise<DynastyCreatorFn>,
      ...props: Promise<DynastyParamFn>[]
    ) => Promise<void>;

    /**
     * Add arguments to be passed to the creator function.
     * @param argList - Arguments to be passed to the creator function. Multiple arguments are concatinated.
     * @returns A promise that resolves a parameter function.
     * ```
     * add('name1', once(myFactory), args(1, 'A', { }));
     * ```
     */
    args: (...argList: unknown[]) => Promise<DynastyParamFn>;

    /**
     * Specifiy dependencies by name for a node. Attached node values will be supplied to the creator once the dependency tree is resolved.
     * @param dependencies - The list of nodes that will be attached. Items passed as an object will be aliased to the value.
     * @returns A promise that resolves a parameter function.
     * ```
     * add('name1', once(myFactory), attach('item1', { 'item2': 'alias1' }));
     * ```
     */
    attach: (
      ...dependencies: (string | Record<string, string>)[]
    ) => Promise<DynastyParamFn>;

    /**
     * Calls a factory function to build the value for this node. The factory is supplied with the dependencies and arguments attached by other param functions.
     * @param builder - A factory function in which dependencies are passed into.
     * @returns A promise that resolves a creator function.
     * ```
     * function myFactory(dyn) {
     *   const { name2 } = dyn();
     *   typeof name2 === 'function' && name2();
     *   return Date.now();
     * }
     * add('name1', call(myFactory), depends('name2'));
     * ```
     */
    call: (builder: DynastyFactoryFn) => Promise<DynastyCreatorFn>;

    /**
     * Collects all of the nodes attached to the node into an object.That object is used as the nodes value.
     * @returns A promise that resolves a creator function.
     * ```
     * add('name1', collect(), attach('item1', 'item2'));
     * ```
     */
    collect: () => Promise<DynastyCreatorFn>;

    /**
     * Specify dependencies by name for a node.
     * This creates a dependecy but does not supply the node value to the creators once the dependency tree is resolved.
     * @param dependencies - The list of nodes that this node depends on.
     * @returns A promise that resolves a parameter function.
     * ```
     * add('name1', once(myFactory), depends('item1'));
     * ```
     */
    depends: (...dependencies: string[]) => Promise<DynastyParamFn>;

    /**
     * Specifiy the entry points that start the dependency tree. There may be multiple entry points.
     * @returns A promise that resolves a creator function.
     * ```
     * add('name1', entryPoint(), depends('item1'));
     * ```
     */
    entryPoint: () => Promise<DynastyCreatorFn>;

    /**
     * Makes the the values supplied directly available to the creator function. These values are not transformed or waited on.
     * @param props - An object that is passed on as an attached dependency.
     * @returns A promise that resolves a parameter function.
     * ```
     * add('name1', once(myFactory), extend({ config1: 'debug' }));
     * ```
     */
    extend: (props: Record<string, unknown>) => Promise<DynastyParamFn>;

    /**
     * Calls a factory function to build the value for this node on first call, returning that value for all following calls.
     * The factory is supplied with the dependencies and arguments attached by other param functions.
     * This is a singleton version of call.
     * @param builder - A factory function in which dependencies are passed into.
     * @returns A promise that resolves a creator function.
     * ```
     * function myFactory(dyn) {
     *  const { name2 } = dyn();
     *  typeof name2 === 'function' && name2();
     *  return Date.now();
     * }
     * add('name1', once(myFactory), depends('name2'));
     * ```
     */
    once: (builder: DynastyFactoryFn) => Promise<DynastyCreatorFn>;

    /**
     * Extracts a member of an object by name from an attached dependency.
     * @param name - Name of the attached dependency to pull from.
     * @param member - Member of the attached dependency to pull from.
     * @param options.bind - If the bind option is set to true and the value is a function it will bind the function to the parent object.
     * @returns A promise that resolves a parameter function.
     * ```
     * add('name1', pullMember('name2', 'doSomething'), attach('name2'));
     * add('name2', value({ doSomething: () => { console.log('Something...'); }}));
     * ```
     */
    pullMember: (
      name: string,
      member: string,
      options?: { bind: boolean }
    ) => Promise<DynastyParamFn>;

    /**
     * Uses the specified value as the value of the node.
     * The value is resolved if it is a promise, but otherwise is unchanged.
     * @param value - Value assigned to the node.
     * @returns A promise that resolves a creator function.
     * ```
     * add('name1', value(1234));
     * ```
     */
    value: (value: unknown) => Promise<DynastyCreatorFn>;
  };

  /**
   * An async function that builds a dependency tree and injects dependencies where they need to go.
   *
   * @param callback A callback function with dynasty member functions passed into it.
   * @returns A promise.
   */
  export function dynasty(
    callback: (members: DynastyMemberFns) => void
  ): Promise<void>;
}
