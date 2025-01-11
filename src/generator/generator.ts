import {log} from '@augment-vir/common';
import generatorHelper from '@prisma/generator-helper';
import prismaInternals from '@prisma/internals';
import {readThisPackageJson} from '../augments/package-json.js';
import {generate} from './generate.js';
import {readPrismaMapGeneratorOptions} from './generator-config.js';
import {waitForClientJs} from './wait-for-client-js.js';

/**
 * Registers the generator with Prisma so it can be triggered via a `prisma generate` command.
 *
 * @category Internal
 */
export function registerGenerator() {
    generatorHelper.generatorHandler({
        onManifest() {
            return {
                defaultOutput: '-',
                requiresGenerators: ['prisma-client-js'],
                prettyName: 'prisma-map',
                version: readThisPackageJson().version,
            };
        },
        async onGenerate({otherGenerators, schemaPath, generator}) {
            const options = await readPrismaMapGeneratorOptions(schemaPath, generator);

            const jsGenerator = otherGenerators.find(
                (generator) => generator.provider.value === 'prisma-client-js',
            );

            /* node:coverage ignore next 7: Prisma internally catches these */
            if (!jsGenerator) {
                throw new Error(
                    'Cannot use the prisma-map generator without the prisma-client-js generator.',
                );
            } else if (!jsGenerator.output) {
                throw new Error('Cannot find prisma-client-js output path.');
            }

            const jsOutputDir = prismaInternals.parseEnvValue(jsGenerator.output);

            log.faint(`Waiting for JS client generation...`);
            const jsClientDirPath = await waitForClientJs(schemaPath, jsOutputDir);

            await generate(jsClientDirPath, options);
        },
    });
}
