import {check} from '@augment-vir/assert';
import {toPosixPath} from '@augment-vir/node';
import {existsSync} from 'node:fs';
import {dirname, relative, resolve} from 'node:path';
import {assertValidShape} from 'object-shape-tester';
import {
    prismaMapGeneratorConfigShape,
    type PrismaMapGeneratorConfig,
} from '../generator-config/prisma-map-config.js';

/**
 * Reads all generator options passed by the Prisma schema.
 *
 * @category Internal
 */
export async function readPrismaMapGeneratorOptions(
    schemaPath: string,
    generator: Readonly<{config: Record<string, string | string[] | undefined>}>,
): Promise<PrismaMapGeneratorConfig> {
    const configPath = generator.config.config;

    if (!configPath) {
        throw new Error('The prisma-map generator is missing a config path input.');
    } else if (!check.isString(configPath)) {
        throw new TypeError('The prisma-map generator config input is not a string.');
    }

    const fullConfigPath = resolve(dirname(schemaPath), configPath);
    const importPath = toPosixPath(relative(import.meta.dirname, fullConfigPath));

    if (!existsSync(fullConfigPath)) {
        throw new Error(
            `Failed to find prisma-map generator config file at '${fullConfigPath}' (imported with '${importPath}')`,
        );
    }

    const {default: config} = await import(importPath);

    assertValidShape(
        config,
        prismaMapGeneratorConfigShape,
        undefined,
        'Invalid prisma-map config received.',
    );

    return config;
}
