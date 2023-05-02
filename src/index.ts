import { DynastyConfigurator, DynastyConfiguratorCallback } from "./configurator";
import { DynastyContext } from "./context";
import { buildGraph } from "./depends";

/**
 * Dynasty.
 * @public
 * @param {function} callback The configurator callback were everything is setup.
 * @returns {promise} No results.
 */
export async function dynasty(callback: DynastyConfiguratorCallback): Promise<void> {
  const context = new DynastyContext();
  const configurator = new DynastyConfigurator(context);
  await callback(configurator)
  console.log("@@", context.toString('\t'));
  const depends = buildGraph(context);
  const entryPoints = context.getEntryPoints();
  if(entryPoints.length === 0) {
    throw new Error(`There must be at least one entry point. None found.`);
  }
  console.log("@@ depends" ,depends)
  for(const entryPoint of entryPoints) {
    console.log("@@ entryPoint", entryPoint);
  }
}

export default dynasty;
