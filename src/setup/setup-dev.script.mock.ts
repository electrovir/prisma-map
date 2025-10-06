/* node:coverage disable this won't be run in tests */

import {rm} from 'node:fs/promises';
import {prismaApi} from 'prisma-vir';
import {
    generatedTestPrismaClientDirPath,
    testDbPath,
    testPrismaSchemaPath,
} from './file-paths.mock.js';

await rm(generatedTestPrismaClientDirPath, {force: true, recursive: true});
await rm(testDbPath, {force: true});

await prismaApi.database.resetDev({
    schemaPath: testPrismaSchemaPath,
    withMigrations: true,
});
await prismaApi.migration.create({
    schemaPath: testPrismaSchemaPath,
    migrationName: 'init',
});
