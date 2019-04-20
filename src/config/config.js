const backendBase = `${process.env.REACT_APP_BACKEND_BASE}:${process.env.REACT_APP_BACKEND_PORT}`;

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
        synonym: {
            nomenclatoric: {
                numType: 3,
                prefix: '≡'
            },
            taxonomic: {
                numType: 2,
                prefix: '='
            },
            invalid: {
                numType: 1,
                prefix: '–'
            }
        }
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
            baseUri: `${backendBase}/api/nomenclatures?access_token={accessToken}`,
            getAllWFilterUri: `${backendBase}/api/nomenclatures?access_token={accessToken}&filter=%7B"offset":{offset},"where":{where},"limit":{limit},"include":"accepted","order":{order}%7D`,
            getAllWOrderUri: `${backendBase}/api/nomenclatures?access_token={accessToken}&filter=%7B"order":["genus","species","subsp","var","subvar","forma","authors","id"]%7D`,
            getAllBySearchTermUri: `${backendBase}/api/nomenclatures?access_token={accessToken}&filter=%7B"where":%7B"or":[
                %7B"genus":%7B
                    "like": "%25{term}%25"
                %7D%7D,
                %7B"species":%7B
                    "like": "%25{term}%25"
                %7D%7D,
                %7B"subsp":%7B
                    "like": "%25{term}%25"
                %7D%7D,
                %7B"var":%7B
                    "like": "%25{term}%25"
                %7D%7D,
                %7B"subvar":%7B
                    "like": "%25{term}%25"
                %7D%7D,
                %7B"forma":%7B
                    "like": "%25{term}%25"
                %7D%7D,
                %7B"authors":%7B
                    "like": "%25{term}%25"
                %7D%7D,
                %7B"genus_h":%7B
                    "like": "%25{term}%25"
                %7D%7D,
                %7B"species_h":%7B
                    "like": "%25{term}%25"
                %7D%7D,
                %7B"subsp_h":%7B
                    "like": "%25{term}%25"
                %7D%7D,
                %7B"var_h":%7B
                    "like": "%25{term}%25"
                %7D%7D,
                %7B"subvar_h":%7B
                    "like": "%25{term}%25"
                %7D%7D,
                %7B"forma_h":%7B
                    "like": "%25{term}%25"
                %7D%7D,
                %7B"authors_h":%7B
                    "like": "%25{term}%25"
                %7D%7D
            ]%7D%7D`,
            getByIdUri: `${backendBase}/api/nomenclatures/{id}?access_token={accessToken}`,
            getByIdWFilterUri: `${backendBase}/api/nomenclatures/{id}?access_token={accessToken}&filter=%7B"include":["accepted","basionym","replaced","nomenNovum",%7B"genusRel":["family","familyApg"]%7D]%7D`,
            getNomenclatoricSynonymsUri: `${backendBase}/api/nomenclatures/{id}/synonymsNomenclatoric?access_token={accessToken}&filter=%7B"include":"synonymsNomenclatoric"%7D`,
            getTaxonomicSynonymsUri: `${backendBase}/api/nomenclatures/{id}/synonymsTaxonomic?access_token={accessToken}&filter=%7B"include":"synonymsNomenclatoric"%7D`,
            getInvalidSynonymsUri: `${backendBase}/api/nomenclatures/{id}/synonymsInvalid?access_token={accessToken}`,
            getSynonymsOfParent: `${backendBase}/api/nomenclatures/{id}/parentOfSynonyms?access_token={accessToken}`,
            getBasionymForUri: `${backendBase}/api/nomenclatures/{id}/basionymFor?access_token={accessToken}`,
            getReplacedForUri: `${backendBase}/api/nomenclatures/{id}/replacedFor?access_token={accessToken}`,
            getNomenNovumForUri: `${backendBase}/api/nomenclatures/{id}/nomenNovumFor?access_token={accessToken}`,
            countUri: `${backendBase}/api/nomenclatures/count?access_token={accessToken}&where={whereString}`
        },
        generaUri: {
            baseUri: `${backendBase}/api/genera?access_token={accessToken}`,
            getAllWFilterUri: `${backendBase}/api/genera?access_token={accessToken}&filter=%7B"offset":{offset},"where":{where},"limit":{limit},"include":["familyApg","family"],"order":{order}%7D`,
            getAllBySearchTermUri: `${backendBase}/api/genera?access_token={accessToken}&filter=%7B"where":
                %7B"name":%7B
                    "like": "%25{term}%25"
                %7D%7D
            %7D`,
            getAllWithFamiliesUri: `${backendBase}/api/genera?access_token={accessToken}&filter=%7B"include":["familyApg","family"]%7D`, 
            getByIdWithFamilies: `${backendBase}/api/genera/{id}?access_token={accessToken}&filter=%7B"include":["familyApg","family"]%7D`,
            countUri: `${backendBase}/api/genera/count?access_token={accessToken}&where={whereString}`
        },
        familiesApgUri: {
            baseUri: `${backendBase}/api/family_apgs?access_token={accessToken}`,
            getByIdUri: `${backendBase}/api/family_apgs/{id}?access_token={accessToken}`,
            getAllWOrderUri: `${backendBase}/api/family_apgs?access_token={accessToken}&filter=%7B"order":["name","id"]%7D`,
            countUri: `${backendBase}/api/family_apgs/count?access_token={accessToken}&where={whereString}`
        },
        familiesUri: {
            baseUri: `${backendBase}/api/families?access_token={accessToken}`,
            getByIdUri: `${backendBase}/api/families/{id}?access_token={accessToken}`,
            getAllWOrderUri: `${backendBase}/api/families?access_token={accessToken}&filter=%7B"order":["name","id"]%7D`,
            countUri: `${backendBase}/api/families/count?access_token={accessToken}&where={whereString}`
        },
        synonymsUri: {
            baseUri: `${backendBase}/api/synonyms?access_token={accessToken}`,
            synonymsByIdUri: `${backendBase}/api/synonyms/{id}?access_token={accessToken}`
        },
        usersUri: {
            loginUri: `${backendBase}/api/user_lbs/login`,
            logoutUri: `${backendBase}/api/user_lbs/logout?access_token={accessToken}`
        },
    },

    logging: {
        level: 'debug'
    }

};
