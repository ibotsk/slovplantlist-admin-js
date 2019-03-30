
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
        },
        filter: {
            ntypesGroup: ["A", "PA", "S", "DS"]
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
            getAll: `${backendBase}/api/nomenclatures?filter=%7B"offset":{offset},"where":{where},"limit":{limit},"include":"accepted"%7D`,
            count: `${backendBase}/api/nomenclatures/count?where={whereString}`
        },
        generaUri: {
            getAll: `${backendBase}/api/genera?filter=%7B"offset":{offset},"where":{where},"limit":{limit},"include":["familyApg","family"],"order":"name"%7D`,
            count: `${backendBase}/api/genera/count?where={whereString}`
        },
        familiesApgUri: {
            getAll: `${backendBase}/api/family_apgs?filter=%7B"offset":{offset},"where":{where},"limit":{limit},"order":"name"%7D`,
            count: `${backendBase}/api/family_apgs/count?where={whereString}`
        },
        familiesUri: {
            getAll: `${backendBase}/api/families?filter=%7B"offset":{offset},"where":{where},"limit":{limit},"order":"name"%7D`,
            count: `${backendBase}/api/families/count?where={whereString}`
        }
    },

    logging: {
        level: 'debug'
    }

};
