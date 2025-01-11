import {assertValidShape} from 'object-shape-tester';
import {prismaMapGeneratorConfigShape, type PrismaMapGeneratorConfig} from './prisma-map-config.js';

/**
 * Use this to define a type-safe config for the prisma-map Prisma generator.
 *
 * @category Generator Config
 * @example
 *
 * ```ts
 * import {definePrismaMapConfig} from 'prisma-map';
 *
 * export default definePrismaMapConfig({
 *     imports: [
 *         "import {UtcIsoString} from 'date-vir';",
 *     ],
 *     replacements: [
 *         {
 *             match: /\bDate\b/,
 *             replace: 'UtcIsoString',
 *         },
 *     ],
 * });
 * ```
 */
export function definePrismaMapConfig(config: PrismaMapGeneratorConfig) {
    assertValidShape(config, prismaMapGeneratorConfigShape);

    return config;
}
