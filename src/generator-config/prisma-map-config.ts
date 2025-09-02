import {classShape, defineShape, optionalShape, unionShape} from 'object-shape-tester';

/**
 * Shape definition for an individual replacement.
 *
 * @category Internal
 */
export const replacementShape = defineShape({
    match: unionShape(classShape(RegExp), ''),
    replace: '',
});

/**
 * Type for an individual replacement.
 *
 * @category Internal
 */
export type Replacement = typeof replacementShape.runtimeType;

/**
 * Shape definition for the prisma-map Prisma generator's config file.
 *
 * @category Internal
 */
export const prismaMapGeneratorConfigShape = defineShape({
    imports: optionalShape(['']),
    replacements: optionalShape({
        /** Modify Prisma query input field types. */
        inputs: optionalShape([
            replacementShape,
        ]),
        /** Modify Prisma query output field types. */
        outputs: optionalShape([
            replacementShape,
        ]),
    }),
});

/**
 * Type for the prisma-map Prisma generator's config file's default export.
 *
 * @category Internal
 */
export type PrismaMapGeneratorConfig = typeof prismaMapGeneratorConfigShape.runtimeType;
