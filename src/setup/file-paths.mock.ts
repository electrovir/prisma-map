import {join} from 'node:path';
import {repoDirPath} from '../file-paths.js';

export const notCommittedDirPath = join(repoDirPath, '.not-committed');
export const generatorMocksDirPath = join(repoDirPath, 'src', 'generator', 'generator-mocks');

export const testFilesDirPath = join(repoDirPath, 'test-files');
export const testPrismaSchemaPath = join(testFilesDirPath, 'test-schema.prisma');
export const generatedTestPrismaClientDirPath = join(testFilesDirPath, 'generated');
export const testDbPath = join(notCommittedDirPath, 'full-schema.db');
