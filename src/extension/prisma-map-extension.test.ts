import {assert} from '@augment-vir/assert';
import type {MaybePromise} from '@augment-vir/common';
import {describe, it, type UniversalTestContext} from '@augment-vir/test';
import {PrismaClient} from '@prisma/client';
import type {PrismaValueMapper} from './map-values.js';
import {mapDates} from './mappers.mock.js';
import {createPrismaMapExtension} from './prisma-map-extension.js';

function withPrismaClient(
    mappers: ReadonlyArray<PrismaValueMapper>,
    callback: (params: {
        testContext: UniversalTestContext;
        prismaClient: PrismaClient;
    }) => MaybePromise<void>,
) {
    return async (testContext: UniversalTestContext) => {
        const prismaClient = new PrismaClient().$extends(createPrismaMapExtension(mappers));

        await callback({
            prismaClient: prismaClient as PrismaClient,
            testContext,
        });

        await prismaClient.$disconnect();
    };
}

describe(withPrismaClient.name, () => {
    it(
        'creates a functional Prisma client',
        withPrismaClient([], async ({prismaClient}) => {
            await prismaClient.user.create({
                data: {
                    email: 'fake@example.com',
                    // eslint-disable-next-line sonarjs/no-hardcoded-passwords
                    password: 'fake password',
                },
                select: {
                    id: true,
                },
            });
            assert.deepEquals(
                await prismaClient.user.findFirst({
                    select: {
                        email: true,
                        password: true,
                    },
                }),
                {
                    email: 'fake@example.com',
                    // eslint-disable-next-line sonarjs/no-hardcoded-passwords
                    password: 'fake password',
                },
            );
        }),
    );
});

describe('value overwrites extension', () => {
    it(
        'overwrites a Date object',
        withPrismaClient(
            [
                mapDates,
            ],
            async ({prismaClient}) => {
                const newUser = await prismaClient.user.create({
                    data: {
                        email: 'fake@example.com',
                        // eslint-disable-next-line sonarjs/no-hardcoded-passwords
                        password: 'fake password',
                    },
                    select: {
                        email: true,
                        createdAt: true,
                    },
                });
                assert.isDefined(newUser);
                assert.strictEquals(newUser.email, 'fake@example.com');
                assert.isString(newUser.createdAt);
            },
        ),
    );
});
