import { expect } from 'chai';
import { Dynasty, newable } from './dynasty';
import { Dependency, isDependency } from './depends';
import { Config } from './config';

/**
 * Counter factory.
 * @param initial The initial value.
 * @param amount The amount to increment.
 * @returns A counter function.
 */
function counterFactory(initial = 0, amount = 1): () => number {
    let value = initial;
    return () => {
        value += amount
        return value;
    };
}

/**
 * Counter factory without default values.
 * @param initial The initial value.
 * @param amount The amount to increment.
 * @returns A counter function.
 */
function noDefaultCounterFactory(initial: number, amount: number): () => number {
    return counterFactory(initial, amount);
}

/**
 * Test class.
 */
class Counter {
    constructor(public value = 0, public readonly amount = 1) {
    }

    next() {
        this.value += this.amount;
        return this.value;
    }
}

describe('Dynasty', () => {
    it('should be a function', () => {
        expect(Dynasty).to.be.a('function');
        expect(Dynasty.length).to.equal(0);
    });
    it('should create a new Dynasty instance', () => {
        const dyn = new Dynasty();
        expect(dyn).to.be.instanceOf(Dynasty);
    });
    it('should have a static create method', () => {
        expect(Dynasty.create).to.be.a('function');
        expect(Dynasty.create.length).to.equal(0);
        const dyn = Dynasty.create();
        expect(dyn).to.be.instanceOf(Dynasty);
    });
    describe('once', () => {
        it('should be a method', () => {
            expect(Dynasty.prototype.once).to.be.a('function');
            expect(Dynasty.prototype.once.length).to.equal(2);
        });
        it('should create a once dependency', async () => {
            const dyn = new Dynasty();
            const dependency: Dependency<() => number> = dyn.once(counterFactory, []);
            expect(dependency).to.be.a('function');
            expect(isDependency(dependency)).to.equal(true);
            const promise = dependency();
            expect(promise).to.be.a('promise');
            const counter = await promise;
            const result = counter();
            expect(result).to.equal(1);
            const again = counter();
            expect(again).to.equal(2);
        });
        it('should create a once dependency with arguments', async () => {
            const dyn = new Dynasty();
            const eight = dyn.value(8);
            const two = dyn.value(2);
            const dependency = dyn.once(counterFactory, [eight, two]);
            expect(dependency).to.be.a('function');
            const promise = dependency();
            expect(promise).to.be.a('promise');
            const counter = await promise;
            const result = counter();
            expect(result).to.equal(10);
            const again = counter();
            expect(again).to.equal(12);
        });
        it('should require all arguments', async () => {
            const dyn = new Dynasty();
            const eight = dyn.value(8);
            const _two = dyn.value(2);
            // @ts-expect-error This should be missing an argument.
            const dependency = dyn.once(noDefaultCounterFactory, [eight] as const);
            // NOTE: This works without the arguments because noDefaultCounterFactory 
            // calls counterFactory which has default values of it's own.
            expect(dependency).to.be.a('function');
            const promise = dependency();
            expect(promise).to.be.a('promise');
            const counter = await promise;
            const result = counter();
            expect(result).to.equal(9);
            const again = counter();
            expect(again).to.equal(10);
        });
    });
    describe('many', () => {
        it('should be a method', () => {
            expect(Dynasty.prototype.many).to.be.a('function');
            expect(Dynasty.prototype.many.length).to.equal(2);
        });
        it('should create a many dependency', async () => {
            const dyn = new Dynasty();
            const dependency: Dependency<() => number> = dyn.many(counterFactory, []);
            expect(dependency).to.be.a('function');
            expect(isDependency(dependency)).to.equal(true);
            const promise = dependency();
            expect(promise).to.be.a('promise');
            const counter = await promise;
            const result = counter();
            expect(result).to.equal(1);
            const again = counter();
            expect(again).to.equal(2);
        });
    });
    describe('value', () => {
        it('should be a method', () => {
            expect(Dynasty.prototype.value).to.be.a('function');
            expect(Dynasty.prototype.value.length).to.equal(1);
        });
        it('should create a value dependency', async () => {
            const dyn = new Dynasty();
            const dependency: Dependency<boolean> = dyn.value(true);
            expect(dependency).to.be.a('function');
            expect(isDependency(dependency)).to.equal(true);
            const promise = dependency();
            expect(promise).to.be.a('promise');
            const result = await promise;
            expect(result).to.equal(true);
            const again = await dependency();
            expect(again).to.equal(true);
        });
    });
    describe('start', () => {
        it('should be a method', () => {
            expect(Dynasty.prototype.start).to.be.a('function');
            // NOTE: Rest parameters are not counted
            expect(Dynasty.prototype.start.length).to.equal(0);
        });
        it('should resolve empty dependencies', async () => {
            const dyn = new Dynasty();
            const promise = dyn.start();
            expect(promise).to.be.a('promise');
            const result = await promise;
            expect(result).to.be.an('array');
            expect(result.length).to.equal(0);
        });
        it('should resolve dependencies', async () => {
            const dyn = new Dynasty();
            const counter: Dependency<number> = dyn.many(counterFactory(), []);
            const isOk: Dependency<boolean> = dyn.value(true);
            const lookup = dyn.once(() => ({ a: 'Ape', b: 'Bee', c: 'Cat' }), []);
            const promise = dyn.start(isOk, counter, lookup);
            expect(promise).to.be.a('promise');
            const result = await promise;
            expect(result).to.be.an('array');
            expect(result.length).to.equal(3);
            expect(result[0]).to.equal(true);
            expect(result[1]).to.equal(1);
            expect(result[2]).to.deep.equal({ a: 'Ape', b: 'Bee', c: 'Cat' });
        });
    });
    describe('newable', () => {
        it('should be a function', () => {
            expect(Dynasty.newable).to.be.a('function');
            expect(Dynasty.newable.length).to.equal(1);
        });
        it('should be exported as a standalone function', () => {
            expect(newable).to.be.a('function');
            expect(newable).to.equal(Dynasty.newable);
        });
        it('should wrap a class in a Dynasty.newable', async () => {
            const dyn = new Dynasty();
            const factory = Dynasty.newable(Counter);
            expect(factory).to.be.a('function');
            expect(factory.length).to.equal(0);
            const counter = dyn.once(factory, []);
            expect(counter).to.be.a('function');
            expect(counter.length).to.equal(0);
            const instance = await counter();
            expect(instance).to.be.instanceOf(Counter);
            expect(instance.next()).to.equal(1);
            expect(instance.next()).to.equal(2);
        });
        it('should wrap a class in a newable', async () => {
            const dyn = new Dynasty();
            const factory = newable(Counter);
            expect(factory).to.be.a('function');
            expect(factory.length).to.equal(0);
            const counter = dyn.once(factory, []);
            expect(counter).to.be.a('function');
            expect(counter.length).to.equal(0);
            const instance = await counter();
            expect(instance).to.be.instanceOf(Counter);
            expect(instance.next()).to.equal(1);
            expect(instance.next()).to.equal(2);
        });
    });
    describe('record', () => {
        it('should be a method', () => {
            expect(Dynasty.prototype.record).to.be.a('function');
            expect(Dynasty.prototype.record.length).to.equal(1);
        });
        it('should pass though an empty object', async () => {
            const dyn = new Dynasty();
            const record = dyn.record({});
            expect(record).to.be.a('function');
            expect(isDependency(record)).to.equal(true);
            const promise = record();
            expect(promise).to.be.a('promise');
            const result = await promise;
            expect(result).to.eql({});
        });
        it('should support a plain object', async () => {
            const dyn = new Dynasty();
            const record = dyn.record({ a: 1, b: 2, c: 3 });
            expect(record).to.be.a('function');
            const promise = record();
            expect(promise).to.be.a('promise');
            const result = await promise;
            expect(result).to.eql({ a: 1, b: 2, c: 3 });
        });
        it('should support a record with promises', async () => {
            const dyn = new Dynasty();
            const record = dyn.record({
                a: Promise.resolve(1),
                b: Promise.resolve(2),
                c: Promise.resolve(3),
            });
            expect(record).to.be.a('function');
            const promise = record();
            expect(promise).to.be.a('promise');
            const result = await promise;
            expect(result).to.eql({ a: 1, b: 2, c: 3 });
        });
        it('should support a record with dependencies', async () => {
            const dyn = new Dynasty();
            const a = dyn.value(5);
            const b = dyn.once(() => 7, []);
            const c = dyn.many(() => 11, []);
            const record = dyn.record({ a, b, c });
            expect(record).to.be.a('function');
            const promise = record();
            expect(promise).to.be.a('promise');
            const result = await promise;
            expect(result).to.eql({ a: 5, b: 7, c: 11 });
        });
        it('should support a record with a mix of resolvable values', async () => {
            const dyn = new Dynasty();
            const d = dyn.value(5);
            const e = Promise.resolve('7');
            const f = true;
            type MixedType = {
                d: number;
                e: string;
                f: boolean;
            }
            const record = dyn.record<MixedType>({ d, e, f });
            expect(record).to.be.a('function');
            const promise = record();
            expect(promise).to.be.a('promise');
            const result = await promise;
            expect(result).to.eql({ d: 5, e: '7', f: true });
        });
    });
    describe('config', () => {
        // NOTE: See src/config.test.ts for tests of the Config class.
        it('should be a method', () => {
            expect(Dynasty.prototype.config).to.be.a('function');
            expect(Dynasty.prototype.config.length).to.equal(1);
        });
        it('should support an empty configuration', async () => {
            const dyn = new Dynasty();
            type MyConfig = Record<string, string>
            const empty: MyConfig = {};
            const cfg = dyn.config<MyConfig>(empty);
            expect(cfg).to.be.an.instanceOf(Config);
            const all = await cfg.all(); // 'all' is a Dependency<MyConfig>.
            expect(all).to.be.an('function');
            const results = await dyn.start(all)
            expect(results).to.be.an('array');
            expect(results.length).to.equal(1);
            const [data] = results;
            expect(data).to.eql(empty);
        });
    });
});
