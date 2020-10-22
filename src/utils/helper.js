import config from 'config/config';

import formatter from './formatter';

const { name: configName } = config.nomenclature;
const { format: { formatted: ff, plain: plf } } = config;

const o = (string, format) => {
  let s = '';
  if (string) {
    s = string.trim();
  }
  return { string: s, format };
};

const Formatted = (string) => o(string, ff);
const Plain = (string) => o(string, plf);

const makeSl = (string) => {
  const { sl } = configName;
  if (string && string.includes(sl)) {
    const modString = string.replace(sl, '');
    return { s: modString, hasSl: true };
  }
  return { s: string, hasSl: false };
};

/*
    For every property in config.nomenclature.name.infra

    Names of the infra taxa must match the ones of the listOfSpecies table columns.
    Notho- are not used.
*/
const infraTaxa = (nomenclature) => {
  let infs = [];

  const configInfraTaxa = configName.infra;

  for (const infra of Object.keys(configInfraTaxa)) {
    const infraValue = nomenclature[infra];

    if (infraValue) {
      const infraLabel = configInfraTaxa[infra];
      infs = infs.concat([Plain(infraLabel), Formatted(infraValue)]);
    }
  }

  return infs;
};

const invalidDesignation = (name, syntype) => {
  if (syntype === '1') {
    let newname = [];
    newname.push(Plain('"'));
    newname = newname.concat(name);
    newname.push(Plain('"'));
    return newname;
  }
  return name;
};

// ------------------------------------------------------- //

const listOfSpeciesFormat = (nomenclature, options = {}) => {
  const opts = {
    isPublication: false,
    isTribus: false,
    ...options,
  };

  let isAuthorLast = true;

  let name = [];
  const slResult = makeSl(nomenclature.species);

  name.push(Formatted(nomenclature.genus));
  name.push(Formatted(slResult.s));

  if (slResult.hasSl) {
    name.push(Plain(configName.sl));
  }

  const infras = infraTaxa(nomenclature);

  if (nomenclature.species === nomenclature.subsp
    || nomenclature.species === nomenclature.var
    || nomenclature.species === nomenclature.forma
  ) {
    if (nomenclature.authors) {
      name.push(Plain(nomenclature.authors));
    }
    isAuthorLast = false;
  }

  name = name.concat(infras);

  if (isAuthorLast) {
    name.push(Plain(nomenclature.authors));
  }

  if (nomenclature.hybrid) {
    const h = {
      genus: nomenclature.genusH,
      species: nomenclature.speciesH,
      subsp: nomenclature.subspH,
      var: nomenclature.varH,
      subvar: nomenclature.subvarH,
      forma: nomenclature.formaH,
      nothosubsp: nomenclature.nothosubspH,
      nothoforma: nomenclature.nothoformaH,
      authors: nomenclature.authorsH,
    };
    name.push(Plain(configName.hybrid));
    name = name.concat(listOfSpeciesFormat(h));
  }

  name = invalidDesignation(name, options.syntype);

  if (opts.isPublication) {
    name.push(Plain(nomenclature.publication));
  }
  if (opts.isTribus) {
    name.push(Plain(nomenclature.tribus));
  }

  return name;
};

/**
 * For resolving filter comparator. Supports LIKE and EQ.
 * Loopback mysql connector does not support case insensitive.
 * @param {*} comparator
 * @param {*} key
 * @param {*} value
 */
const resolveByComparator = (comparator, key, value) => {
  switch (comparator) {
    case '':
      return {};
    case 'LIKE':
      return {
        [key]: {
          like: `%25${value}%25`,
        },
      };
    case 'REGEXP':
      return {
        [key]: {
          regexp: value,
        },
      };
    case 'NEQ':
      // if (Array.isArray(value)) {
      //     return {
      //         and: value.map(v => ({
      //             [key]: {
      //                 neq: v
      //             }
      //         }))
      //     };
      // }
      return {
        [key]: {
          neq: value,
        },
      };
    case 'EQ':
    default:
      return {
        [key]: value,
      };
  }
};

const filterToWhereItem = (filter, key) => {
  let conjug = 'or';
  let { filterVal } = filter;
  if (filterVal.and) {
    conjug = 'and';
    filterVal = filterVal.and;
  }

  if (Array.isArray(filterVal) && filterVal.length > 1) {
    const valsOr = [];
    for (const val of filterVal) {
      let itemKey = key; let
        value = val;
      if (val && typeof val !== 'string') {
        itemKey = val.field;
        value = val.value;
      }
      valsOr.push(resolveByComparator(filter.comparator, itemKey, value));
    }
    return { [conjug]: valsOr };
  }
  return resolveByComparator(filter.comparator, key, filter.filterVal);
};

function listOfSpeciesForComponent(name, formatString) {
  const nameArr = listOfSpeciesFormat(name);

  const formattedNameArr = nameArr.map((t) => {
    if (t.format === ff) {
      return formatter.format(t.string, formatString);
    }
    return t.string;
  });

  return formattedNameArr
    .reduce((acc, el) => acc.concat(el, ' '), [])
    .slice(0, -1);
}

function listOfSpeciesString(name) {
  return listOfSpeciesForComponent(name, 'plain').join('');
}

function losToTypeaheadSelected(data) {
  if (!data) {
    return undefined;
  }
  return [{
    id: data.id,
    label: listOfSpeciesString(data),
  }];
}

function makeWhere(filters) {
  const whereItems = [];
  const keys = Object.keys(filters);
  // keys of filters are joined with 'and'
  for (const key of keys) {
    // array of filterVal are joined by 'or'
    whereItems.push(filterToWhereItem(filters[key], key));
  }
  if (whereItems.length > 1) {
    return { and: whereItems };
  }
  if (whereItems.length === 1) {
    return whereItems[0];
  }
  return {};
}

function makeOrder(sortFields, sortOrder = 'ASC') {
  let soUpperCase = sortOrder.toUpperCase();
  if (soUpperCase !== 'ASC' && soUpperCase !== 'DESC') {
    soUpperCase = 'ASC';
  }
  if (Array.isArray(sortFields)) {
    return sortFields.map((f) => `${f} ${soUpperCase}`);
  }
  return [`${sortFields} ${soUpperCase}`];
}

function buildOptionsFromKeys(keys) {
  const obj = {};
  Object.keys(keys).forEach((t) => {
    obj[t] = keys[t].text;
    // obj[t] = t;
  });
  return obj;
}

/**
 * If filter key is in config.nomenclature.filter then modify that filter such as new
 * filterVal = [{ field, value }] where field is for every value from the config nad value is original filterVal.
 * @param {*} filters
 */
// const curateSearchFilters = filters => {
//     let curatedFilters = { ...filters };
//     const keys = Object.keys(filters);
//     for (const key of keys) { //listofspecies
//         const fields = config.nomenclature.filter[key]; // genus, species, ...
//         if (fields) {
//             const filterContent = curatedFilters[key]; // filterType, filterVal, caseSensitive, comparator
//             const filterVal = filterContent.filterVal;
//             if (typeof filterVal === "string") { // avoid redoing mapping on values that are already in { field, value }
//                 const newFilterValue = fields.map(f => ({ field: f, value: filterVal }));
//                 filterContent.filterVal = newFilterValue;
//                 curatedFilters[key] = filterContent;
//             }
//         }
//     }
//     return curatedFilters;
// }

// const curateSortFields = sortField => {
//     const fields = config.nomenclature.filter[sortField];
//     if (fields) {
//         return fields;
//     }
//     return sortField;
// }

function listOfSpeciesSorterLex(losA, losB) {
  // a > b = 1
  if (losA.genus > losB.genus) {
    return 1;
  } if (losA.genus < losB.genus) {
    return -1;
  }
  if (losA.species > losB.species) {
    return 1;
  } if (losA.species < losB.species) {
    return -1;
  }
  if (losA.subsp > losB.subsp) {
    return 1;
  } if (losA.subsp < losB.subsp) {
    return -1;
  }
  if (losA.var > losB.var) {
    return 1;
  } if (losA.var < losB.var) {
    return -1;
  }
  if (losA.forma > losB.forma) {
    return 1;
  } if (losA.forma < losB.forma) {
    return -1;
  }
  if (losA.subvar > losB.subvar) {
    return 1;
  } if (losA.subvar < losB.subvar) {
    return -1;
  }
  if (losA.authors > losB.authors) {
    return 1;
  } if (losA.authors < losB.authors) {
    return -1;
  }
  // hybrid fields next
  if (losA.genusH > losB.genusH) {
    return 1;
  } if (losA.genusH < losB.genusH) {
    return -1;
  }
  if (losA.speciesH > losB.speciesH) {
    return 1;
  } if (losA.speciesH < losB.speciesH) {
    return -1;
  }
  if (losA.subspH > losB.subspH) {
    return 1;
  } if (losA.subspH < losB.subspH) {
    return -1;
  }
  if (losA.varH > losB.varH) {
    return 1;
  } if (losA.varH < losB.varH) {
    return -1;
  }
  if (losA.formaH > losB.formaH) {
    return 1;
  } if (losA.formaH < losB.formaH) {
    return -1;
  }
  if (losA.subvarH > losB.subvarH) {
    return 1;
  } if (losA.subvarH < losB.subvarH) {
    return -1;
  }
  if (losA.authorsH > losB.authorsH) {
    return 1;
  } if (losA.authorsH < losB.authorsH) {
    return -1;
  }
  return 0;
}

function synonymSorterLex(synA, synB) {
  return listOfSpeciesSorterLex(synA.synonym, synB.synonym);
}

export default {
  listOfSpeciesForComponent,
  listOfSpeciesString,
  losToTypeaheadSelected,
  makeWhere,
  makeOrder,
  buildOptionsFromKeys,
  // curateSearchFilters,
  // curateSortFields,
  listOfSpeciesSorterLex,
  synonymSorterLex,
};
