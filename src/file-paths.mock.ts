import {join, resolve} from 'node:path';

export const repoDirPath = resolve(import.meta.dirname, '..');
export const notCommittedDirPath = join(repoDirPath, '.not-committed');

export const testPrismaSchemaPath = join(repoDirPath, 'test-schema.prisma');
export const generatedTestPrismaClientDirPath = join(repoDirPath, 'node_modules', '.prisma');
export const testDbPath = join(notCommittedDirPath, 'full-schema.db');
