const {baseConfig} = require('@virmator/spellcheck/configs/cspell.config.base.cjs');

module.exports = {
    ...baseConfig,
    ignorePaths: [
        ...baseConfig.ignorePaths,
        'test-files/migrations/',
        'test-files/generated/',
    ],
    words: [
        ...baseConfig.words,
        'cuid',
    ],
};
