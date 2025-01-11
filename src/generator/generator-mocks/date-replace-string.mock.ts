export default {
    imports: [
        "import {UtcIsoString} from 'date-vir'",
    ],
    replacements: [
        {
            match: ' Date ',
            replace: 'UtcIsoString',
        },
    ],
};
