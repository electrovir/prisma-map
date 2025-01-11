import {classShape, defineShape, optional, or} from 'object-shape-tester';

/**
 * Shape definition for the prisma-map Prisma generator's config file.
 *
 * @category Internal
 */
export const prismaMapGeneratorConfigShape = defineShape({
    imports: optional(['']),
    replacements: optional([
        {
            match: or(classShape(RegExp), ''),
            replace: '',
        },
    ]),
});

/**
 * Type for the prisma-map Prisma generator's config file's default export.
 *
 * @category Internal
 */
export type PrismaMapGeneratorConfig = typeof prismaMapGeneratorConfigShape.runtimeType;
