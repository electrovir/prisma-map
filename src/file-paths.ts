import {basename, dirname, join, resolve} from 'node:path';

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
const parentNodeModulesDir = dirname(repoDirPath);
const childNodeModulesDir = join(repoDirPath, 'node_modules');

/**
 * A path to this package's parent or child `node_modules` folder, depending on where it's
 * installed.
 *
 * @category Internal
 */
export const nodeModulesDir =
    /* node:coverage ignore next 1: only one branch of the ternary can trigger in dev */
    basename(parentNodeModulesDir) === 'node_modules' ? parentNodeModulesDir : childNodeModulesDir;
