import { DepGraph } from 'dependency-graph';
import { DynastyContext } from "./context";
import { DynastyItem } from './item';

/**
 * Build dependencies graph.
 * Configuration items are not included in the graph.
 * @param {DynastyContext} context Transform the context into a dependency graph.
 * @returns {DepGraph<DynastyItem>} The resulting dependency graph.
 */
export function buildGraph(context: DynastyContext): DepGraph<DynastyItem> {
  // NOTE: Object key is dependency name, object value is export name.
  const depGraph = new DepGraph<DynastyItem>();
  for (const [name, item] of context.items) {
    // NOTE: All items must be added to graph before the 
    // dependencies are added.
    depGraph.addNode(name, item);
  }
  for (const [name, item] of context.items) {
    const depends = new Set<string>([...item.depends, ...item.attach]);
    for (const key of depends) {
      depGraph.addDependency(name, key);
    }
  }
  depGraph.overallOrder(); // Error check early.
  return depGraph;
}; 