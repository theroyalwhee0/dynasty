import { expect } from 'chai';
import { describe, it } from 'mocha';
import { buildGraph } from '../src/depends';
import { DepGraph } from 'dependency-graph';
import { DynastyContext } from '../src/context';
import { DynastyItem } from '../src/item';

describe('dynasty', () => {
  it('should be a function', () => {
    expect(buildGraph).to.be.a('function');
    expect(buildGraph.length).to.equal(1);
  });
  it('should be able to build an empty graph', () => {
    const context = new DynastyContext();
    const graph = buildGraph(context);
    expect(graph).to.be.an.instanceOf(DepGraph);
    expect(graph.size()).to.equal(0);
  });
  it('should be able to build a graph', () => {
    const context = new DynastyContext();
    // Build test items.
    const items: Record<string, Record<string, string[]>> = {
      'start': {
        'depends': ['app']
      },
      'app': {
        'attach': ['log'],
        'depends': ['reports'],
      },
      'log': {},
      'reports': {},
    };
    for (let key in items) {
      const item = context.item(key);
      const { depends, attach } = items[key];
      if (depends) {
        for (let name of depends) {
          item.depends.add(name);
        }
      }
      if (attach) {
        for (let name of attach) {
          item.attach.add(name);
        }
      }
    }
    const graph = buildGraph(context);
    expect(graph).to.be.an.instanceOf(DepGraph);
    expect(graph.size()).to.equal(4);
    console.log("@@ graph:", graph);
    expect(graph.hasNode('start')).that.be.true;
    expect(graph.hasNode('app')).that.be.true;
    expect(graph.hasNode('reports')).that.be.true;
    expect(graph.dependenciesOf('start')).to.be.eql(['reports', 'log', 'app']);
    expect(graph.dependenciesOf('app')).to.be.eql(['reports', 'log']);
    expect(graph.dependenciesOf('reports')).to.be.eql([]);
  });
});
