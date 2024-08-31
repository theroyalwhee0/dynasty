import { describe, it } from 'mocha';
import { expect } from 'chai';
import { Configuration, Config } from './config';
import { Dynasty } from './dynasty';

describe('Config', () => {
    it('should be a class', () => {
        expect(Configuration).to.be.a('function');
        expect(Configuration.prototype.constructor).to.equal(Configuration);
        expect(Configuration.prototype.constructor.length).to.equal(2);
    });
    it('should support an empty configuration', async () => {
        const dynasty = new Dynasty();
        type MyConfig = Record<string, string>;
        const empty: MyConfig = {};
        const cfg = new Configuration<MyConfig>(dynasty, empty);
        const all = cfg.all(); // 'all' is a Dependency<MyConfig>.
        expect(cfg).to.be.an.instanceOf(Configuration);
        expect(all).to.be.an('function');
        const data = await all(); // Resolve Dependency.
        expect(data).to.be.an('object');
        expect(data).to.eql({});
    });
    it('should implement the Configuration interface', () => {
        const dynasty = new Dynasty();
        type MyConfig = Record<string, string>;
        const empty: MyConfig = {};
        const cfg = new Configuration<MyConfig>(dynasty, empty);
        // Must be assignable to Configuration interface.
        const configuration: Config<MyConfig> = cfg;
        expect(configuration.isLocked).to.be.a('boolean');
        expect(configuration.lock).to.be.a('function');
    });
    it('should support a simple configuration', async () => {
        const dynasty = new Dynasty();
        type MyConfig = { foo: string };
        const cfg = new Configuration<MyConfig>(dynasty, { foo: 'bar' });
        const all = cfg.all(); // 'all' is a Dependency<MyConfig>.
        expect(cfg).to.be.an.instanceOf(Configuration);
        expect(all).to.be.an('function');
        const data = await all(); // Resolve Dependency.
        expect(data).to.be.an('object');
        expect(data).to.eql({ foo: 'bar' });
    });
    describe('get', () => {
        it('should be a method', () => {
            expect(Configuration.prototype.get).to.be.a('function');
            expect(Configuration.prototype.get.length).to.equal(1);
        });
        it('should get a value by key', async () => {
            const dynasty = new Dynasty();
            type MyConfig = { library: string };
            const cfg = new Configuration<MyConfig>(dynasty, { library: 'card' });
            const foo = cfg.get('library');
            expect(foo).to.be.an('function');
            const data = await foo(); // Resolve Dependency.
            expect(data).to.equal('card');
        });
    });
    describe('has', () => {
        it('should be a method', () => {
            expect(Configuration.prototype.has).to.be.a('function');
            expect(Configuration.prototype.has.length).to.equal(1);
        });
        it('should check if a key exists', async () => {
            const dynasty = new Dynasty();
            type MyConfig = { library: string };
            const cfg = new Configuration<MyConfig>(dynasty, { library: 'card' });
            expect(cfg.has('library')).to.be.equal(true);
            // @ts-expect-error 'foo' does not exist.
            expect(cfg.has('foo')).to.be.equal(false);
        });
    });
    describe('select', () => {
        it('should be a method', () => {
            expect(Configuration.prototype.select).to.be.a('function');
            expect(Configuration.prototype.select.length).to.equal(1);
        });
        it('should select a value by selector', async () => {
            const dynasty = new Dynasty();
            type MyConfig = { library: string };
            const cfg = new Configuration<MyConfig>(dynasty, { library: 'card' });
            const library = cfg.select((config) => config.library);
            expect(library).to.be.an('function');
            const data = await library(); // Resolve Dependency.
            expect(data).to.equal('card');
        });
    });
    describe('update', () => {
        it('should be a method', () => {
            expect(Configuration.prototype.update).to.be.a('function');
            expect(Configuration.prototype.update.length).to.equal(1);
        });
        it('should update a value by key', async () => {
            const dynasty = new Dynasty();
            type MyConfig = { library: string };
            const cfg = new Configuration<MyConfig>(dynasty, { library: 'card' });
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
            const cfg = new Configuration<MyConfig>(dynasty, { library: 'card' });
            cfg.lock();
            expect(() => cfg.update({ library: 'board' })).to.throw('The Dynasty configuration is locked.');
        });
    });
    describe('replace', () => {
        it('should be a method', () => {
            expect(Configuration.prototype.replace).to.be.a('function');
            expect(Configuration.prototype.replace.length).to.equal(1);
        });
        it('should replace the configuration', async () => {
            const dynasty = new Dynasty();
            type MyConfig = { library: string, light?: string };
            const cfg = new Configuration<MyConfig>(dynasty, { library: 'card', light: 'bulb' });
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
            const cfg = new Configuration<MyConfig>(dynasty, { library: 'card' });
            cfg.lock();
            expect(() => cfg.replace({ library: 'board' })).to.throw('The Dynasty configuration is locked.');
        });
    });
    describe('set', () => {
        it('should be a method', () => {
            expect(Configuration.prototype.set).to.be.a('function');
            expect(Configuration.prototype.set.length).to.equal(2);
        });
        it('should set a value by key', async () => {
            const dynasty = new Dynasty();
            type MyConfig = { library: string };
            const cfg = new Configuration<MyConfig>(dynasty, { library: 'card' });
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
            const cfg = new Configuration<MyConfig>(dynasty, { library: 'card' });
            cfg.lock();
            expect(() => cfg.set('library', 'board')).to.throw('The Dynasty configuration is locked.');
        });
    });
    describe('lock and unlock', () => {
        it('should be methods', () => {
            expect(Configuration.prototype.lock).to.be.a('function');
            expect(Configuration.prototype.lock.length).to.equal(0);
            expect(Configuration.prototype.unlock).to.be.a('function');
            expect(Configuration.prototype.unlock.length).to.equal(0);
        });
        it('should lock and unlock the configuration', () => {
            const dynasty = new Dynasty();
            type MyConfig = { library: string };
            const cfg = new Configuration<MyConfig>(dynasty, { library: 'card' });
            expect(cfg.isLocked).to.equal(false);
            cfg.lock();
            expect(cfg.isLocked).to.equal(true);
            expect(() => {
                cfg.set('library', 'board');
            }).to.throw('The Dynasty configuration is locked.');
            cfg.unlock();
            expect(cfg.isLocked).to.equal(false);
        });
    });
});
