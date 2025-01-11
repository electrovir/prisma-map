import {check, waitUntil} from '@augment-vir/assert';
import {collapseWhiteSpace} from '@augment-vir/common';
import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import {join, resolve} from 'node:path';
import {parentPrismaClientDir, siblingPrismaClientDir} from '../file-paths.js';

function getPrismaClientDir(prismaOutputDir: string): string {
    const directoriesToTry = [
        prismaOutputDir,
        resolve(prismaOutputDir, '..', '..', '.prisma', 'client'),
        parentPrismaClientDir,
        siblingPrismaClientDir,
        /* node:coverage ignore next 3: only one branch of the ternary can trigger in dev */
        'resolve' in import.meta
            ? resolve(import.meta.resolve('@prisma/client'), '..', '..', '.prisma', 'client')
            : '',
    ].filter(check.isTruthy);

    const validDirectory = directoriesToTry.find((dir) => {
        return existsSync(dir);
    });

    if (validDirectory) {
        return validDirectory;
    }

    /* node:coverage ignore next 1 */
    throw new Error('No prisma output path found.');
}

/**
 * Waits for the default `prisma-client-js` generator to finish producing its outputs.
 *
 * @category Internal
 * @returns The path of the found `.prisma/client` dir.
 */
export async function waitForClientJs(
    schemaPath: string,
    prismaOutputDir: string,
): Promise<string> {
    const currentSchema = collapseWhiteSpace(String(await readFile(schemaPath)));

    return await waitUntil.isTruthy(
        async () => {
            const dirPath = getPrismaClientDir(prismaOutputDir);

            const generatedSchemaContents = collapseWhiteSpace(
                String(await readFile(join(dirPath, 'schema.prisma'))),
            );

            if (generatedSchemaContents === currentSchema) {
                return dirPath;
            } else {
                return '';
            }
        },
        {
            interval: {
                milliseconds: 1000,
            },
            timeout: {
                milliseconds: 5000,
            },
        },
        "Your JS Prisma client never generated, timed out, or generated in an unexpected location. Make sure that you place this generator after the 'prisma-client-js' generator.",
    );
}
