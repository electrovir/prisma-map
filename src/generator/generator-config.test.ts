import {describe, itCases} from '@augment-vir/test';
import {readPrismaMapGeneratorOptions} from './generator-config.js';

describe(readPrismaMapGeneratorOptions.name, () => {
    itCases(readPrismaMapGeneratorOptions, [
        {
            it: 'fails if config path is missing',
            inputs: [
                '',
                {
                    config: {},
                },
            ],
            throws: {
                matchMessage: 'missing a config path input',
            },
        },
        {
            it: 'fails if config path is missing',
            inputs: [
                '',
                {
                    config: {
                        config: [],
                    },
                },
            ],
            throws: {
                matchMessage: 'config input is not a string',
            },
        },
        {
            it: 'fails if config path does not exist',
            inputs: [
                '',
                {
                    config: {
                        config: 'config.ts',
                    },
                },
            ],
            throws: {
                matchMessage: 'Failed to find prisma-map generator config file',
            },
        },
    ]);
});
