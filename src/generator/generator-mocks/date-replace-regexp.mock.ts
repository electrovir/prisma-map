export default {
    imports: [
        "import {UtcIsoString} from 'date-vir'",
    ],
    replacements: [
        {
            match: /\bDate\s*\|\s*string\b/,
            replace: 'UtcIsoString',
        },
        {
            match: /\bstring\s*\|\s*Date\b/,
            replace: 'UtcIsoString',
        },
        {
            match: /\bDate\b/,
            replace: 'UtcIsoString',
        },
    ],
};
