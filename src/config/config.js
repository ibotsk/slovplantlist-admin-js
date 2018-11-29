
const backendBase = "http://localhost:3001";

export default {

    nomenclature: {
        name: {
            sl: 's.l.',
            subsp: 'subsp.',
            var: 'var.',
            subvar: 'subvar.',
            forma: 'forma',
            nothosubsp: 'nothosubsp.',
            nothoforma: 'nothoforma',
            proles: 'proles',
            unranked: '[unranked]',
            tribus: 'tribus',
            hybrid: 'x',
        }
    },
    format: {
        formatted: "formatted",
        plain: "plain",
        recordsPerPage: 50,
        rangeDisplayed: 7,
        numOfElementsAtEnds: 1,
        searchFieldMinLength: 4
    },
    uris: {
        nomenclaturesUri: {
            getAll: `${backendBase}/api/nomenclatures?filter=`,
            count: `${backendBase}/api/nomenclatures/count?where={whereString}`
        }
    },

    logging: {
        level: 'debug'
    }

};
