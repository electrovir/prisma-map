import {addSuffix, extractErrorMessage, removeColor} from '@augment-vir/common';
import {prisma} from '@augment-vir/node';
import {
    assertTestContext,
    describe,
    RuntimeEnv,
    snapshotCasesWithContext,
    type UniversalTestContext,
} from '@augment-vir/test';
import {unifiedNoColor} from 'disparity';
import {cp, mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import {basename, join, relative} from 'node:path';
import {repoDirPath} from '../file-paths.js';
import {generatorMocksDirPath, notCommittedDirPath} from '../setup/file-paths.mock.js';

describe('generator test', () => {
    async function runGeneratorTest(
        testContext: UniversalTestContext,
        configName: string,
        finalSchema?: string,
    ) {
        try {
            assertTestContext(testContext, RuntimeEnv.Node);
            const configInputPath = join(
                generatorMocksDirPath,
                addSuffix({value: configName, suffix: '.mock.ts'}),
            );
            const testDirPath = join(notCommittedDirPath, testContext.name);
            const schemaPath = join(testDirPath, 'schema.prisma');
            const configOutputPath = join(testDirPath, 'config.ts');
            const binPath = relative(testDirPath, join(repoDirPath, 'bin.js'));
            const clientOutputDirPath = join(testDirPath, 'prisma-output');

            await mkdir(testDirPath, {recursive: true});
            await cp(configInputPath, configOutputPath);
            await rm(clientOutputDirPath, {recursive: true, force: true});

            const unmappedSchema = /* Prisma */ `
            generator jsClient {
                provider = "prisma-client-js"
                output   = "${basename(clientOutputDirPath)}"
            }
            
            datasource db {
                provider = "sqlite"
                url      = "file:./db.db"
            }
            
            model User {
                id        String   @id @default(cuid(2))
                createdAt DateTime @default(now())

                email    String
            }
        `;

            const mappedGenerator = /* Prisma */ `            
            generator mappedClient {
                provider = "node ${binPath}"
                config   = "${basename(configOutputPath)}"
            }
        `;

            await writeFile(schemaPath, unmappedSchema);
            await prisma.client.generate(schemaPath);
            const typesBefore = String(await readFile(join(clientOutputDirPath, 'index.d.ts')));

            await writeFile(schemaPath, finalSchema || unmappedSchema + mappedGenerator);
            await rm(clientOutputDirPath, {recursive: true, force: true});
            await prisma.client.generate(schemaPath);
            const typesAfter = String(await readFile(join(clientOutputDirPath, 'index.d.ts')));

            return unifiedNoColor(typesBefore, typesAfter, {context: 0});
        } catch (error) {
            throw new Error(
                removeColor(extractErrorMessage(error))
                    .replaceAll(/ in [\d.,]+m?s/g, '')
                    .replaceAll(repoDirPath + '/', ''),
            );
        }
    }

    snapshotCasesWithContext(runGeneratorTest, [
        {
            it: 'converts Date types with a RegExp',
            inputs: ['date-replace-regexp'],
        },
        {
            it: 'converts Date types with a string',
            inputs: ['date-replace-string'],
        },
        {
            it: 'does nothing when config is empty',
            inputs: ['empty-config'],
        },
        {
            it: 'times out when prisma-client-js is not first',
            inputs: [
                'empty-config',
                /* Prisma */ `
                    generator mappedClient {
                        provider = "node ../../bin.js"
                        config   = "config.ts"
                    }
                    generator jsClient {
                        provider = "prisma-client-js"
                        output   = "prisma-output"
                    }
                    datasource db {
                        provider = "sqlite"
                        url      = "file:./db.db"
                    }
                    model User {
                        id        String   @id @default(cuid(2))
                        createdAt DateTime @default(now())

                        email    String
                    }
                `,
            ],
        },
        {
            it: 'fails if prisma-client-js is entirely missing',
            inputs: [
                'empty-config',
                /* Prisma */ `
                    generator mappedClient {
                        provider = "node ../../bin.js"
                        config   = "config.ts"
                    }
                    datasource db {
                        provider = "sqlite"
                        url      = "file:./db.db"
                    }
                    model User {
                        id        String   @id @default(cuid(2))
                        createdAt DateTime @default(now())

                        email    String
                    }
                `,
            ],
        },
        {
            it: 'fails if prisma-client-js output path is empty',
            inputs: [
                'empty-config',
                /* Prisma */ `
                    generator jsClient {
                        provider = "prisma-client-js"
                        output   = ""
                    }
                    generator mappedClient {
                        provider = "node ../../bin.js"
                        config   = "config.ts"
                    }
                    datasource db {
                        provider = "sqlite"
                        url      = "file:./db.db"
                    }
                    model User {
                        id        String   @id @default(cuid(2))
                        createdAt DateTime @default(now())

                        email    String
                    }
                `,
            ],
        },
        {
            it: 'fails on an invalid config',
            inputs: [
                'invalid-config',
            ],
        },
    ]);
});
