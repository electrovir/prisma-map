# prisma-map

Map generated Prisma types and runtime field values however you like.

## Install

```sh
npm i prisma-map
```

## Usage

This package provides a Prisma client extension for mapping runtime field values. This can be added to your Prisma client either with `createPrismaMapExtension` (for super easy all-inclusive Prisma client extension) or `runPrismaMapExtension` (for including value mapping functionality into existing Prisma client extensions):

<!-- example-link: src/examples/extension.example.ts -->

```TypeScript
import {createPrismaMapExtension, runPrismaMapExtension, type PrismaValueMapper} from 'prisma-map';
import {PrismaClient} from '../setup/prisma.mock.js';

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
```
