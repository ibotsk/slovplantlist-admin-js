
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
            getAll: `${backendBase}/api/nomenclatures?filter=%7B"offset":{offset},"where":{where},"limit":{limit},"include":"accepted"%7D`,
            count: `${backendBase}/api/nomenclatures/count?where={whereString}`
        },
        generaUri: {
            getAll: `${backendBase}/api/genera?filter=%7B"offset":{offset},"where":{where},"limit":{limit},"include":["familyApg","family"]%7D`,
            count: `${backendBase}/api/genera/count?where={whereString}`
        }
    },

    logging: {
        level: 'debug'
    }

};
