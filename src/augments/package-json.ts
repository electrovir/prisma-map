import {type SetRequired} from '@augment-vir/common';
import {readFileSync} from 'node:fs';
import {type PackageJson} from 'type-fest';
import {packageJsonPath} from '../file-paths.js';

/**
 * Simplifies the `PackageJson` type to just what we need internally.
 *
 * @category Internal
 */
export type ThisPackageJson = SetRequired<PackageJson, 'name' | 'author' | 'version'>;

/**
 * Read this package's own `package.json` file.
 *
 * @category Internal
 */
export function readThisPackageJson(): ThisPackageJson {
    const packageContents = readFileSync(packageJsonPath).toString();

    return JSON.parse(packageContents) as ThisPackageJson;
}
