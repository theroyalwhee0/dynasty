import { expect } from 'chai';
import { describe, it } from 'mocha';
import dynasty from '../src/index';

describe('dynasty', () => {
    it('should be a function', () => {
        expect(dynasty).to.be.a('function');
        expect(dynasty.length).to.equal(1);
    });
    it('should support adding depends', async () => {
        const promise = dynasty(({ name, once, depends, attach, entryPoint }) => {
            class Dependencies {
                @name("item0")
                @once
                @attach('item3')
                item1(): Number {
                    return 1;
                }

                @once
                @entryPoint
                @depends('item1')
                item2() {
                    return 222;
                }

                @once
                item3(): Number {
                    return 333;
                }
            };
            return Dependencies;
        });
        expect(promise).to.be.a('promise');
        const result = await promise;
        expect(result).to.be.undefined;
    });
});
