import { expect } from "chai";
import { Config } from "./config";
import { Dynasty } from "./dynasty";
import exp from "constants";

describe('Config', () => {
    it('should be a class', () => {
        expect(Config).to.be.a('function');
        expect(Config.prototype.constructor).to.equal(Config);
        expect(Config.prototype.constructor.length).to.equal(2);
    });
    it('should support an empty configuration', async () => {
        const dynasty = new Dynasty();
        type MyConfig = {};
        const cfg = new Config<MyConfig>(dynasty, {});
        const all = await cfg.all(); // 'all' is a Dependency<MyConfig>.
        expect(cfg).to.be.an.instanceOf(Config);
        expect(all).to.be.an('function');
        const data = await all(); // Resolve Dependency.
        expect(data).to.be.an('object');
        expect(data).to.eql({});
    });
    it('should support a simple configuration', async () => {
        const dynasty = new Dynasty();
        type MyConfig = { foo: string };
        const cfg = new Config<MyConfig>(dynasty, { foo: 'bar' });
        const all = await cfg.all(); // 'all' is a Dependency<MyConfig>.
        expect(cfg).to.be.an.instanceOf(Config);
        expect(all).to.be.an('function');
        const data = await all(); // Resolve Dependency.
        expect(data).to.be.an('object');
        expect(data).to.eql({ foo: 'bar' });
    });
});
