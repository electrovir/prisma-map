import {check} from '@augment-vir/assert';
import {addRegExpFlags} from '@augment-vir/common';
import {runFsm} from 'fsm-vir';
import {readFile, writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {
    type PrismaMapGeneratorConfig,
    type Replacement,
} from '../generator-config/prisma-map-config.js';

enum State {
    Start = 'start',
    Outputs = 'outputs',
    Inputs = 'inputs',
    Ending = 'ending',
}

function applyAllReplacements(
    line: string,
    replacements: ReadonlyArray<Readonly<Replacement>>,
): string {
    return replacements.reduce((latestLine, replacement) => {
        return latestLine.replaceAll(
            check.isString(replacement.match)
                ? replacement.match
                : addRegExpFlags(replacement.match, 'g'),
            replacement.replace,
        );
    }, line);
}

/**
 * Reads inputs from a the generated JS client and then generates and writes the frontend output.
 *
 * @category Internal
 */
export async function generate(jsClientDirPath: string, options: PrismaMapGeneratorConfig) {
    const typesPath = join(jsClientDirPath, 'index.d.ts');
    const originalTypes = String(await readFile(typesPath));
    const lines = originalTypes.split('\n');

    const replacements = options.replacements;
    const fixedLines = replacements ? [] : lines;

    if (replacements) {
        runFsm({
            initState: State.Start,
            inputs: lines,
            nextState({input, state}) {
                if (state === State.Start && input.trim() === '* Models') {
                    return {
                        nextState: State.Outputs,
                    };
                } else if (state === State.Outputs && input.trim() === '* Deep Input Types') {
                    return {
                        nextState: State.Inputs,
                    };
                } else if (
                    state === State.Inputs &&
                    input.trim() === '* Batch Payload for updateMany & deleteMany & createMany'
                ) {
                    return {
                        nextState: State.Ending,
                    };
                } else {
                    return undefined;
                }
            },
            actions: {
                preNextState({input, state}) {
                    if (state === State.Outputs && replacements.outputs) {
                        fixedLines.push(applyAllReplacements(input, replacements.outputs));
                    } else if (state === State.Inputs && replacements.inputs) {
                        fixedLines.push(applyAllReplacements(input, replacements.inputs));
                    } else {
                        fixedLines.push(input);
                    }
                },
            },
        });
    }

    const newLines = [
        ...(options.imports || []),
        ...fixedLines,
    ];

    await writeFile(typesPath, newLines.join('\n'));
}
