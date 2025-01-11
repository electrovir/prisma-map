import {describe, itCases} from '@augment-vir/test';
import {ShapeMismatchError} from 'object-shape-tester';
import {definePrismaMapConfig} from './define-config.js';

describe(definePrismaMapConfig.name, () => {
    itCases(definePrismaMapConfig, [
        {
            it: 'works',
            input: {
                imports: [
                    'something',
                ],
                replacements: [
                    {
                        match: 'hi',
                        replace: 'bye',
                    },
                ],
            },
            throws: undefined,
        },
        {
            it: 'works',
            input: {
                imports: [
                    'something',
                ],
                replacements: [
                    // @ts-expect-error: intentionally incorrect input
                    {
                        match: 'hi',
                    },
                ],
            },
            throws: {
                matchConstructor: ShapeMismatchError,
            },
        },
    ]);
});
