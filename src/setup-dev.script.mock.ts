/* node:coverage disable this won't be run in tests */

import {prisma} from '@augment-vir/node';
import {rm} from 'node:fs/promises';
import {
    generatedTestPrismaClientDirPath,
    testDbPath,
    testPrismaSchemaPath,
} from './file-paths.mock.js';

await rm(generatedTestPrismaClientDirPath, {force: true, recursive: true});
await rm(testDbPath, {force: true});

await prisma.database.resetDev(testPrismaSchemaPath);
await prisma.migration.create({migrationName: 'init'}, testPrismaSchemaPath);
