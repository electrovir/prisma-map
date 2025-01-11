import {check} from '@augment-vir/assert';
import {addRegExpFlags} from '@augment-vir/common';
import {readFile, writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {type PrismaMapGeneratorConfig} from '../generator-config/prisma-map-config.js';

/**
 * Reads inputs from a the generated JS client and then generates and writes the frontend output.
 *
 * @category Internal
 */
export async function generate(jsClientDirPath: string, options: PrismaMapGeneratorConfig) {
    const typesPath = join(jsClientDirPath, 'index.d.ts');
    const originalTypes = String(await readFile(typesPath));
    const lines = originalTypes.split('\n');

    let inReplacementMode = false;
    const replacements = options.replacements;

    const mappedLines = replacements
        ? lines.map((line): string => {
              if (inReplacementMode) {
                  if (line.trim() === '* Batch Payload for updateMany & deleteMany & createMany') {
                      inReplacementMode = false;
                  } else {
                      return replacements.reduce((latestLine, replacement) => {
                          return latestLine.replaceAll(
                              check.isString(replacement.match)
                                  ? replacement.match
                                  : addRegExpFlags(replacement.match, 'g'),
                              replacement.replace,
                          );
                      }, line);
                  }
              } else if (line.trim() === '* Models') {
                  inReplacementMode = true;
              }

              return line;
          })
        : lines;

    const newLines = [
        ...(options.imports || []),
        ...mappedLines,
    ];

    await writeFile(typesPath, newLines.join('\n'));
}
