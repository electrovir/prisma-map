import {definePrismaMapConfig} from '../index.js';

export default definePrismaMapConfig({
    /** An optional list of import strings which will be prepended to the generated Prisma types. */
    imports: [
        "import {UtcIsoString} from 'date-vir';",
    ],
    /** An optional list of replacements that will be performed on Prisma's generated types file. */
    replacements: [
        {
            /** `match` can be a RegExp instance or a string. */
            match: /\bDate\b/,
            /**
             * Replace is always a string. Note that you can use RegExp capture groups here (like
             * `'$1'`).
             */
            replace: 'UtcIsoString',
        },
    ],
});
