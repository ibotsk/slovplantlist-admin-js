
const backendBase = "http://localhost:3001";

export default {

    constants: {
        listOfSpeciesColumn: 'listOfSpecies'
    },
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
        },
        filter: {
            ntypesGroup: ["A", "PA", "S", "DS"],
            listOfSpecies: [
                "genus",
                "species",
                "subsp",
                "var",
                "subvar",
                "forma",
                "nothosubsp",
                "nothoforma",
                "authors",
                "genus_h",
                "species_h",
                "subsp_h",
                "var_h",
                "subvar_h",
                "forma_h",
                "nothosubsp_h",
                "nothoforma_h",
                "authors_h"
            ]
        }
    },
    format: {
        formatted: "formatted",
        plain: "plain"
    },
    mappings: {
        losType: {
            A: {
                text: "Accepted name",
                colour: "#57ab27"
            },
            PA: {
                text: "Provisionally accepted",
                colour: "#ee7f00"
            },
            S: {
                text: "Synonym",
                colour: "#008fc8"
            },
            DS: {
                text: "Doubtful synonym",
                colour: "#0089a0"
            },
            U: {
                text: "Unresolved",
                colour: "#bb9d00"
            }
        },
    },
    pagination: {
        paginationSize: 7,
        pageStartIndex: 1,
        alwaysShowAllBtns: true, // Always show next and previous button
        withFirstAndLast: true, // Hide the going to First and Last page button
        // hideSizePerPage: true, // Hide the sizePerPage dropdown always
        // hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
        // firstPageText: 'First',
        // prePageText: 'Back',
        // nextPageText: 'Next',
        // lastPageText: 'Last',
        // nextPageTitle: 'First page',
        // prePageTitle: 'Pre page',
        // firstPageTitle: 'Next page',
        // lastPageTitle: 'Last page',
        showTotal: true,
        // paginationTotalRenderer: customTotal, //custom renderer is in TablePageParent
        sizePerPageList: [
            {
                text: '25',
                value: 25
            }, {
                text: '50',
                value: 50
            }, {
                text: '100',
                value: 100
            }] // A numeric array is also available. the purpose of above example is custom the text
    },
    uris: {
        nomenclaturesUri: {
            getAllWFilter: `${backendBase}/api/nomenclatures?filter=%7B"offset":{offset},"where":{where},"limit":{limit},"include":"accepted","order":{order}%7D`,
            countUri: `${backendBase}/api/nomenclatures/count?where={whereString}`
        },
        generaUri: {
            getAllWFilterUri: `${backendBase}/api/genera?filter=%7B"offset":{offset},"where":{where},"limit":{limit},"include":["familyApg","family"],"order":{order}%7D`,
            countUri: `${backendBase}/api/genera/count?where={whereString}`
        },
        familiesApgUri: {
            getAllWOrderUri: `${backendBase}/api/family_apgs?filter=%7B"order":["name","id"]%7D`,
            countUri: `${backendBase}/api/family_apgs/count?where={whereString}`
        },
        familiesUri: {
            getAllWOrderUri: `${backendBase}/api/families?filter=%7B"order":["name","id"]%7D`,
            countUri: `${backendBase}/api/families/count?where={whereString}`
        }
    },

    logging: {
        level: 'debug'
    }

};
