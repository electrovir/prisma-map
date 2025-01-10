# prisma-map

Map generated Prisma types and runtime field values however you like.

This has not been extensively tested or benchmarked, but I don't expect any major issues.

## Install

```sh
npm i prisma-map
```

## Usage

This package provides two exports which must both be used for best results:

1. A Prisma client extension for mapping runtime field values.
2. A Prisma generator for mapping Prisma client's TypeScript types.

Use the _client extension_ for modifying runtime values returned by your Prisma client. Use the _generator_ to fix Prisma's generated types (so they match your value modifications).

### Prisma Client Extension

The Prisma client extension can be added to your Prisma client either with `createPrismaMapExtension` (for super easy all-inclusive Prisma client extension) or `runPrismaMapExtension` (for including value mapping functionality into existing Prisma client extensions):

<!-- example-link: src/examples/extension.example.ts -->

```TypeScript
import {PrismaClient} from '@prisma/client';
import {createPrismaMapExtension, runPrismaMapExtension, type PrismaValueMapper} from 'prisma-map';

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
