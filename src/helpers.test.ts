import { expect } from 'chai';
import { isPromise } from '../src/helpers';

describe('isPromise', () => {
    it('should be a function', () => {
        expect(isPromise).to.be.a('function');
        expect(isPromise.length).to.equal(1);
    });

    it('should return true for a Promise', () => {
        expect(isPromise(new Promise<void>((resolve) => resolve()))).to.equal(true);
        expect(isPromise(Promise.resolve())).to.equal(true);
        expect(isPromise(Promise.reject())).to.equal(true);
    });

    it('should return false for a non-Promise value', () => {
        expect(isPromise('not a promise')).to.equal(false);
        expect(isPromise(123)).to.equal(false);
        expect(isPromise({})).to.equal(false);
        expect(isPromise(null)).to.equal(false);
        expect(isPromise(undefined)).to.equal(false);
    });
});
