import {join, resolve} from 'node:path';

/**
 * A path to this package's directory.
 *
 * @category Internal
 */
export const repoDirPath = resolve(import.meta.dirname, '..');
/**
 * A path to this package's `package.json` file.
 *
 * @category Internal
 */
export const packageJsonPath = join(repoDirPath, 'package.json');
