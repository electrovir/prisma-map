import {join, resolve} from 'node:path';

export const repoDirPath = resolve(import.meta.dirname, '..', '..');

export const notCommittedDirPath = join(repoDirPath, '.not-committed');

export const testFilesDirPath = join(repoDirPath, 'test-files');
export const testPrismaSchemaPath = join(testFilesDirPath, 'test-schema.prisma');
export const generatedTestPrismaClientDirPath = join(testFilesDirPath, 'generated');
export const testDbPath = join(notCommittedDirPath, 'full-schema.db');
