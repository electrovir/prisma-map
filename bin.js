#!/usr/bin/env node

import {runCliScript} from '@augment-vir/node';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const cliPath = join(fileURLToPath(import.meta.dirname), 'src', 'generator', 'cli.script.ts');

await runCliScript(cliPath, fileURLToPath(import.meta.filename), 'prisma-map');
