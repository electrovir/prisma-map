export default {
    imports: [
        "import {UtcIsoString} from 'date-vir'",
    ],
    replacements: [
        {
            match: /\bDate\b/,
            replace: 'UtcIsoString',
        },
    ],
};
