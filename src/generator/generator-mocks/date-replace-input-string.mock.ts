export default {
    imports: [
        "import {UtcIsoString} from 'date-vir'",
    ],
    replacements: {
        inputs: [
            {
                match: ' Date ',
                replace: ' UtcIsoString ',
            },
        ],
    },
};
