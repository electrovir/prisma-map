import {describe, itCases} from '@augment-vir/test';
import {existsSync} from 'node:fs';
import * as filePaths from './file-paths.mock.js';

describe('file paths exist', () => {
    itCases(
        existsSync,
        /** Before tests have run, `npm run setup` should have run which will populate all of these. */
        Object.entries(filePaths).map(
            ([
                key,
                path,
            ]) => {
                return {
                    it: key,
                    input: path,
                    expect: true,
                };
            },
        ),
    );
});
