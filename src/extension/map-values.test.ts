import {describe, itCases} from '@augment-vir/test';
import {mapPrismaValues, type PrismaValueMapper} from './map-values.js';
import {mapToFakeDate} from './mappers.mock.js';

describe(mapPrismaValues.name, () => {
    async function testMapPrismaValues(
        input: unknown,
        mappers: ReadonlyArray<PrismaValueMapper>,
    ): Promise<unknown> {
        await mapPrismaValues(input, mappers);

        return input;
    }

    itCases(testMapPrismaValues, [
        {
            it: 'maps an array',
            inputs: [
                [
                    'a',
                    new Date(),
                ],
                [
                    mapToFakeDate,
                ],
            ],
            expect: [
                'a',
                'fake date',
            ],
        },
        {
            it: 'maps multiple nested object',
            inputs: [
                {
                    user: {
                        name: 'person',
                        someDate: new Date(),
                    },
                    author: {
                        name: 'up',
                        anotherDate: new Date(),
                    },
                    name: 'george',
                },
                [
                    mapToFakeDate,
                ],
            ],
            expect: {
                user: {
                    name: 'person',
                    someDate: 'fake date',
                },
                author: {
                    name: 'up',
                    anotherDate: 'fake date',
                },
                name: 'george',
            },
        },
    ]);
});
