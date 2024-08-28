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
        const all = cfg.all(); // 'all' is a Dependency<MyConfig>.
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
        const all = cfg.all(); // 'all' is a Dependency<MyConfig>.
        expect(cfg).to.be.an.instanceOf(Config);
        expect(all).to.be.an('function');
        const data = await all(); // Resolve Dependency.
        expect(data).to.be.an('object');
        expect(data).to.eql({ foo: 'bar' });
    });
    describe('get', () => {
        it('should be a method', () => {
            expect(Config.prototype.get).to.be.a('function');
            expect(Config.prototype.get.length).to.equal(1);
        });
        it('should get a value by key', async () => {
            const dynasty = new Dynasty();
            type MyConfig = { library: string };
            const cfg = new Config<MyConfig>(dynasty, { library: 'card' });
            const foo = cfg.get('library');
            expect(foo).to.be.an('function');
            const data = await foo(); // Resolve Dependency.
            expect(data).to.equal('card');
        });
    });
    describe('has', () => {
        it('should be a method', () => {
            expect(Config.prototype.has).to.be.a('function');
            expect(Config.prototype.has.length).to.equal(1);
        });
        it('should check if a key exists', async () => {
            const dynasty = new Dynasty();
            type MyConfig = { library: string };
            const cfg = new Config<MyConfig>(dynasty, { library: 'card' });
            expect(cfg.has('library')).to.be.true;
            // @ts-expect-error 'foo' does not exist.
            expect(cfg.has('foo')).to.be.false;
        });
    });
    describe('select', () => {
        it('should be a method', () => {
            expect(Config.prototype.select).to.be.a('function');
            expect(Config.prototype.select.length).to.equal(1);
        });
        it('should select a value by selector', async () => {
            const dynasty = new Dynasty();
            type MyConfig = { library: string };
            const cfg = new Config<MyConfig>(dynasty, { library: 'card' });
            const library = cfg.select((config) => config.library);
            expect(library).to.be.an('function');
            const data = await library(); // Resolve Dependency.
            expect(data).to.equal('card');
        });
    });
    describe('update', () => {
        it('should be a method', () => {
            expect(Config.prototype.update).to.be.a('function');
            expect(Config.prototype.update.length).to.equal(1);
        });
        it('should update a value by key', async () => {
            const dynasty = new Dynasty();
            type MyConfig = { library: string };
            const cfg = new Config<MyConfig>(dynasty, { library: 'card' });
            const library = cfg.get('library');
            expect(library).to.be.an('function');
            const data = await library(); // Resolve Dependency.
            expect(data).to.equal('card');
            cfg.update({ library: 'board' });
            const newData = await library(); // Resolve Dependency again.
            expect(newData).to.equal('board');
        });
        it('should fail if the configuration is read-only', () => {
            const dynasty = new Dynasty();
            type MyConfig = { library: string };
            const cfg = new Config<MyConfig>(dynasty, { library: 'card' });
            cfg.readOnly();
            expect(() => cfg.update({ library: 'board' })).to.throw('Unable to modify Dynasty configuration. It has been marked read-only');
        });
    });
    describe('replace', () => {
        it('should be a method', () => {
            expect(Config.prototype.replace).to.be.a('function');
            expect(Config.prototype.replace.length).to.equal(1);
        });
        it('should replace the configuration', async () => {
            const dynasty = new Dynasty();
            type MyConfig = { library: string, light?: string };
            const cfg = new Config<MyConfig>(dynasty, { library: 'card', light: 'bulb' });
            const library = cfg.get('library');
            expect(library).to.be.an('function');
            const data = await library(); // Resolve Dependency.
            expect(data).to.equal('card');
            cfg.replace({ library: 'board' });
            const newData = await library(); // Resolve Dependency again.
            expect(newData).to.equal('board');
        });
        it('should fail if the configuration is read-only', () => {
            const dynasty = new Dynasty();
            type MyConfig = { library: string };
            const cfg = new Config<MyConfig>(dynasty, { library: 'card' });
            cfg.readOnly();
            expect(() => cfg.replace({ library: 'board' })).to.throw('Unable to modify Dynasty configuration. It has been marked read-only');
        });
    });
    describe('set', () => {
        it('should be a method', () => {
            expect(Config.prototype.set).to.be.a('function');
            expect(Config.prototype.set.length).to.equal(2);
        });
        it('should set a value by key', async () => {
            const dynasty = new Dynasty();
            type MyConfig = { library: string };
            const cfg = new Config<MyConfig>(dynasty, { library: 'card' });
            const library = cfg.get('library');
            expect(library).to.be.an('function');
            const data = await library(); // Resolve Dependency.
            expect(data).to.equal('card');
            cfg.set('library', 'board');
            const newData = await library(); // Resolve Dependency again.
            expect(newData).to.equal('board');
        });
        it('should fail if the configuration is read-only', () => {
            const dynasty = new Dynasty();
            type MyConfig = { library: string };
            const cfg = new Config<MyConfig>(dynasty, { library: 'card' });
            cfg.readOnly();
            expect(() => cfg.set('library', 'board')).to.throw('Unable to modify Dynasty configuration. It has been marked read-only');
        });
    });
});
