import {PrismaClient} from '@prisma/client';
import {createPrismaMapExtension, runPrismaMapExtension, type PrismaValueMapper} from '../index.js';

/** This function maps Date values to their corresponding ISO strings and will result in all */
function dateToString(value: unknown) {
    if (!(value instanceof Date)) {
        /** Return `undefined` inside a mapper to skip modifying the field value. */
        return undefined;
    }

    /** Return a replacement value inside of an object like this: */
    return {
        replacement: value.toISOString(),
    };
}

/** Create a list of mappers for the Prisma client extension. */
const mappers: PrismaValueMapper[] = [dateToString];

/** For a convenient one-shot extension, use `createPrismaMapExtension`. */
const prismaClient = new PrismaClient().$extends(createPrismaMapExtension(mappers));

/**
 * If you already have Prisma extensions, you can alternatively utilize runPrismaMapExtension for
 * the same results.
 */
const prismaClient2 = new PrismaClient().$extends({
    query: {
        async $allOperations({args, query}) {
            return await runPrismaMapExtension(mappers, {args, query});
        },
    },
});
