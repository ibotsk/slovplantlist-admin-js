/* eslint-disable max-len */
import uris from './uris';

export default {

  constants: {
    listOfSpeciesColumn: 'listOfSpecies',
    ownership: 'owner_ids',
    ownershipRegexp: {
      start: '(\\,|^)',
      end: '(\\,|$)',
    },
    userRealm: 'slovplantlist',
    userPrincipalType: 'user',
    mustacheTags: ['<%', '%>'],
  },
  nomenclature: {
    name: {
      sl: 's.l.',
      tribus: 'tribus',
      hybrid: 'x',
      infra: {
        subsp: 'subsp.',
        var: 'var.',
        subvar: 'subvar.',
        forma: 'forma',
        nothosubsp: 'nothosubsp.',
        nothoforma: 'nothoforma',
        proles: "'prol'",
        unranked: '[unranked]',
      },
    },
    filter: {
      ntypesGroup: ['A', 'PA', 'S', 'DS'],
      listOfSpecies: [
        'genus',
        'species',
        'subsp',
        'var',
        'subvar',
        'forma',
        'nothosubsp',
        'nothoforma',
        'authors',
        'genus_h',
        'species_h',
        'subsp_h',
        'var_h',
        'subvar_h',
        'forma_h',
        'nothosubsp_h',
        'nothoforma_h',
        'authors_h',
      ],
    },
  },
  format: {
    formatted: 'formatted',
    plain: 'plain',
  },
  mappings: {
    losType: {
      A: {
        key: 'A',
        text: 'Accepted name',
        colour: '#57ab27',
      },
      PA: {
        key: 'PA',
        text: 'Provisionally accepted',
        colour: '#ee7f00',
      },
      S: {
        key: 'S',
        text: 'Synonym',
        colour: '#008fc8',
      },
      DS: {
        key: 'DS',
        text: 'Doubtful synonym',
        colour: '#0089a0',
      },
      U: {
        key: 'U',
        text: 'Unresolved',
        colour: '#bb9d00',
      },
    },
    synonym: {
      nomenclatoric: {
        numType: 3,
        prefix: '≡',
      },
      taxonomic: {
        numType: 2,
        prefix: '=',
      },
      invalid: {
        numType: 1,
        prefix: '–',
      },
    },
    userRole: {
      admin: {
        name: 'admin',
        text: 'ADMIN',
        colour: '#C9302C',
      },
      editor: {
        name: 'editor',
        text: 'EDITOR',
        colour: '#bb9d00',
      },
      author: {
        name: 'author',
        text: 'AUTHOR',
        colour: '#57ab27',
      },
    },
    ownership: {
      all: {
        key: 'all',
        text: 'ALL',
      },
      mine: {
        key: 'mine',
        text: 'MINE',
      },
      others: {
        key: 'others',
        text: 'OTHERS',
      },
      unassigned: {
        key: 'unassigned',
        text: 'UNASSIGNED',
      },
      notmine: {
        key: 'notmine',
        text: 'NOT MINE',
      },
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
        value: 25,
      }, {
        text: '50',
        value: 50,
      }, {
        text: '100',
        value: 100,
      }], // A numeric array is also available. the purpose of above example is custom the text
  },
  uris,

  logging: {
    level: 'debug',
  },

};
