import {waitUntil} from '@augment-vir/assert';
import {collapseWhiteSpace} from '@augment-vir/common';
import {readFile, stat} from 'node:fs/promises';
import {join} from 'node:path';

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
    const isSchemaDir = (await stat(schemaPath)).isDirectory();
    /* node:coverage ignore next 1: I don't wanna test this right now */
    const currentSchemaPath = isSchemaDir ? join(schemaPath, 'schema.prisma') : schemaPath;
    const currentSchema = collapseWhiteSpace(String(await readFile(currentSchemaPath)));

    return await waitUntil.isTruthy(
        async () => {
            const generatedSchemaContents = collapseWhiteSpace(
                String(await readFile(join(prismaOutputDir, 'schema.prisma'))),
            );

            if (
                /* node:coverage ignore next 3: I don't wanna test this right now */
                isSchemaDir
                    ? generatedSchemaContents.includes(currentSchema)
                    : generatedSchemaContents === currentSchema
            ) {
                return prismaOutputDir;
                /* node:coverage ignore next 3: edge case */
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
