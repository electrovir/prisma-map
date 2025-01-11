import {join} from 'node:path';
import {repoDirPath} from '../file-paths.js';

export const notCommittedDirPath = join(repoDirPath, '.not-committed');
export const generatorMocksDirPath = join(repoDirPath, 'src', 'generator', 'generator-mocks');

export const testPrismaSchemaPath = join(repoDirPath, 'test-schema.prisma');
export const generatedTestPrismaClientDirPath = join(repoDirPath, 'node_modules', '.prisma');
export const testDbPath = join(notCommittedDirPath, 'full-schema.db');
