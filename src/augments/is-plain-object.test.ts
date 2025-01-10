import {describe, itCases} from '@augment-vir/test';
import {Prisma} from '@prisma/client';
import {isPlainObject} from './is-plain-object.js';

describe(isPlainObject.name, () => {
    itCases(isPlainObject, [
        {
            it: 'accepts an empty object',
            input: {},
            expect: true,
        },
        {
            it: 'accepts an object with values',
            input: {
                a: 'b',
                c: 'd',
            },
            expect: true,
        },
        {
            it: 'cannot reject a proxy',
            input: new Proxy({}, {}),
            expect: true,
        },
        {
            it: 'rejects a Decimal instance',
            input: new Prisma.Decimal(24.454_545),
            expect: false,
        },
        {
            it: 'rejects a Date instance',
            input: new Date(),
            expect: false,
        },
        {
            it: 'rejects a number',
            input: 5,
            expect: false,
        },
        {
            it: 'rejects an empty array',
            input: [],
            expect: false,
        },
        {
            it: 'rejects an array with values',
            input: [
                'a',
                'b',
            ],
            expect: false,
        },
        {
            it: 'rejects SharedArrayBuffer',
            input: new SharedArrayBuffer(1024),
            expect: false,
        },
    ]);
});
