import { DepGraph } from 'dependency-graph';
import { DynastyContext } from "./context";

/**
 * Build dependencies graph.
 * Configuration items are not included in the graph.
 * @param {object} items Transform the itemsinto a dependency graph.
 * @returns {DepGraph} The resulting dependency graph.
 *
 */
export function buildGraph(context:DynastyContext) {
  // NOTE: Object key is dependency name, object value is export name.
  const depGraph = new DepGraph();
  for(const name in context.items) {
    // NOTE: All items must be added to graph before the dependencies are added.
    const item = context.items.get(name);
    depGraph.addNode(name, item);
  }
  for(const name in context.items) {
    const item = context.items.get(name);
    const deps = Object.assign({ }, item && item.depends, item && item.attach);
    for(const key of Object.keys(deps)) {
      depGraph.addDependency(name, key);
    }
  }
  depGraph.overallOrder(); // Error check early.
  return depGraph;
};