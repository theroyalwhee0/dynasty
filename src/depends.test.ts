import { expect } from "chai";
import { DEPENDENCY, isDependency, markDependency, resolveDependencies } from "./depends";
import type { Dependencies, UnmarkedDependency } from "./depends";

describe('markDependency', () => {
    it('should be a function', () => {
        expect(markDependency).to.be.a('function');
        expect(markDependency.length).to.equal(1);
    });
    it('should mark a dependency', async () => {
        const unmarked: UnmarkedDependency<string> = async () => "rubber duck";
        const dependency = markDependency(unmarked);
        expect(dependency).to.be.a('function');
        expect(dependency.length).to.equal(0);
        expect(dependency[DEPENDENCY]).to.equal(true);
        const promise = dependency();
        expect(promise).to.be.a('promise');
        const result = await promise;
        expect(result).to.equal("rubber duck");
    });
});

describe('resolveDependencies', () => {
    it('should be a function', () => {
        expect(resolveDependencies).to.be.a('function');
        expect(resolveDependencies.length).to.equal(1);
    });
    it('should resolve empty dependencies', async () => {
        const dependencies: Dependencies<[]> = [];
        const promise = resolveDependencies(dependencies);
        expect(promise).to.be.a('promise');
        const result = await promise;
        expect(result).to.be.an('array');
        expect(result.length).to.equal(0);
    });
    it('should resolve a single dependency', async () => {
        const dependencies: Dependencies<[number]> = [
            markDependency(() => Promise.resolve(42))
        ];
        const promise = resolveDependencies(dependencies);
        expect(promise).to.be.a('promise');
        const result = await promise;
        expect(result).to.be.an('array');
        expect(result.length).to.equal(1);
        expect(result[0]).to.equal(42);
    });
    it('should resolve multiple dependencies', async () => {
        const dependencies: Dependencies<[number, string, { a: boolean }]> = [
            markDependency(() => Promise.resolve(-7)),
            markDependency(() => Promise.resolve('foo')),
            markDependency(() => Promise.resolve({ a: true }))
        ];
        const promise = resolveDependencies(dependencies);
        expect(promise).to.be.a('promise');
        const result = await promise;
        expect(result).to.be.an('array');
        expect(result.length).to.equal(3);
        expect(result[0]).to.equal(-7);
        expect(result[1]).to.equal('foo');
        expect(result[2]).to.deep.equal({ a: true });
    });
});

describe('isMarkedDependency', () => {
    it('should be a function', () => {
        expect(isDependency).to.be.a('function');
        expect(isDependency.length).to.equal(1);
    });
    it('should be true for a marked dependency', () => {
        const dependency = markDependency(() => Promise.resolve(42));
        expect(isDependency(dependency)).to.equal(true);
    });
    it('should be false for an unmarked dependency', () => {
        const dependency = async () => 42;
        expect(isDependency(dependency)).to.equal(false);
    });
    it('should be false for an value that is not a dependency', () => {
        expect(isDependency(1)).to.equal(false);
    });
});