import {describe, itCases} from '@augment-vir/test';
import {ShapeMismatchError} from 'object-shape-tester';
import {definePrismaMapConfig} from './define-config.js';

describe(definePrismaMapConfig.name, () => {
    itCases(definePrismaMapConfig, [
        {
            it: 'supports both inputs and outputs',
            input: {
                imports: [
                    'something',
                ],
                replacements: {
                    inputs: [
                        {
                            match: 'hi',
                            replace: 'bye',
                        },
                    ],
                    outputs: [
                        {
                            match: 'hi',
                            replace: 'bye',
                        },
                    ],
                },
            },
            throws: undefined,
        },
        {
            it: 'works with just inputs',
            input: {
                imports: [
                    'something',
                ],
                replacements: {
                    inputs: [
                        {
                            match: 'hi',
                            replace: 'bye',
                        },
                    ],
                },
            },
            throws: undefined,
        },
        {
            it: 'works with just outputs',
            input: {
                imports: [
                    'something',
                ],
                replacements: {
                    outputs: [
                        {
                            match: 'hi',
                            replace: 'bye',
                        },
                    ],
                },
            },
            throws: undefined,
        },
        {
            it: 'rejects a shape mismatch',
            input: {
                imports: [
                    'something',
                ],
                replacements: {
                    inputs: [
                        // @ts-expect-error: intentionally incorrect input
                        {
                            match: 'hi',
                        },
                    ],
                },
            },
            throws: {
                matchConstructor: ShapeMismatchError,
            },
        },
    ]);
});
