import formatter from './formatter';
import config from '../config/config';

const config_name = config.nomenclature.name;
const ff = config.format.formatted;
const plf = config.format.plain;

const o = (string, format) => {
    let s = '';
    if (string) {
        s = string.trim();
    }
    return { string: s, format: format };
}

const Formatted = (string) => o(string, ff);
const Plain = (string) => o(string, plf);

const sl = (string) => {
    const sl = config_name.sl;
    if (string && string.includes(sl)) {
        let modString = string.replace(sl, '');
        return { s: modString, hasSl: true };
    }
    return { s: string, hasSl: false };
}

const subspecies = (subsp) => {
    const result = [];
    let isUnrankedOrProles = false;
    if (subsp.includes(config_name.unranked)) {
        result.push(Plain(config_name.unranked));
        isUnrankedOrProles = true;
    }
    if (subsp.includes(config_name.proles)) {
        result.push(Plain(config_name.proles));
        isUnrankedOrProles = true;
    }
    subsp = subsp.replace(/\[unranked\]|proles/g, '');

    if (!isUnrankedOrProles) {
        result.push(Plain(config_name.subsp));
    }
    result.push(Formatted(subsp));
    return result;
}

/*
    Nothosubsp and nothoforma not used
*/
const infraTaxa = (subsp, vari, subvar, forma, nothosubsp, nothoforma) => {
    let infs = [];
    if (subsp) {
        infs = infs.concat(subspecies(subsp));
    }
    if (vari) {
        infs = infs.concat([Plain(config_name.var), Formatted(vari)]);
    }
    if (subvar) {
        infs = infs.concat([Plain(config_name.subvar), Formatted(subvar)]);
    }
    if (forma) {
        infs = infs.concat([Plain(config_name.forma), Formatted(forma)]);
    }

    return infs;
}

const invalidDesignation = (name, syntype) => {
    if (syntype === '1') {
        let newname = [];
        newname.push(Plain('"'));
        newname = newname.concat(name);
        newname.push(Plain('"'));
        return newname;
    }
    return name;
}

const listOfSpeciesFormat = (nomenclature, options = {}) => {

    let opts = Object.assign({}, {
        isPublication: false,
        isTribus: false,
    }, options);

    let isAuthorLast = true;

    let name = [];
    let slResult = sl(nomenclature.species);

    name.push(Formatted(nomenclature.genus));
    name.push(Formatted(slResult.s));

    if (slResult.hasSl) {
        name.push(Plain(config_name.sl));
    }

    const infras = infraTaxa(nomenclature.subsp, nomenclature.var, nomenclature.subvar, nomenclature.forma, nomenclature.nothosubsp, nomenclature.nothoforma);

    if (nomenclature.species === nomenclature.subsp || nomenclature.species === nomenclature.var || nomenclature.species === nomenclature.forma) {
        name.push(Plain(nomenclature.authors));
        isAuthorLast = false;
    }

    name = name.concat(infras);

    if (isAuthorLast) {
        name.push(Plain(nomenclature.authors));
    }

    if (nomenclature.hybrid) {
        let h = {
            genus: nomenclature.genus_h,
            species: nomenclature.species_h,
            subsp: nomenclature.subsp_h,
            var: nomenclature.var_h,
            subvar: nomenclature.subvar_h,
            forma: nomenclature.forma_h,
            nothosubsp: nomenclature.nothosubsp_h,
            nothoforma: nomenclature.nothoforma_h,
            authors: nomenclature.authors_h,
        }
        name.push(Plain(config_name.hybrid));
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

}

const listOfSpeciesForComponent = (name, formatString) => {

    const nameArr = listOfSpeciesFormat(name);

    const formattedNameArr = nameArr.map(t => {
        if (t.format === ff) {
            return formatter.format(t.string, formatString);
        } else {
            return t.string;
        }
    });

    return formattedNameArr.reduce((acc, el) => acc.concat(el, ' '), []).slice(0, -1);
}

const listOfSpeciesString = (name) => {
    return listOfSpeciesForComponent(name, 'plain').join('');
}

const makeWhere = filters => {
    const whereItems = [];
    const keys = Object.keys(filters);
    // keys of filters are joined with 'and'
    for (const key of keys) {
        // array of filterVal are joined by 'or'
        whereItems.push(filterToWhereItem(filters[key], key));
    }
    if (whereItems.length > 1) {
        return { 'and': whereItems };
    }
    if (whereItems.length === 1) {
        return whereItems[0];
    }
    return {};
}

const makeOrder = (sortFields, sortOrder = 'ASC') => {
    let soUpperCase = sortOrder.toUpperCase();
    if (soUpperCase !== 'ASC' && soUpperCase !== 'DESC') {
        soUpperCase = 'ASC';
    };
    if (Array.isArray(sortFields)) {
        return sortFields.map(f => `${f} ${soUpperCase}`);
    }
    return [`${sortFields} ${soUpperCase}`];
}

const buildOptionsFromKeys = keys => {
    const obj = {};
    Object.keys(keys).forEach(t => {
        obj[t] = t;
    });
    return obj;
}

/**
 * If filter key is in config.nomenclature.filter then modify that filter such as new
 * filterVal = [{ field, value }] where field is for every value from the config nad value is original filterVal.
 * @param {*} filters 
 */
const curateSearchFilters = filters => {
    let curatedFilters = { ...filters };
    const keys = Object.keys(filters);
    for (const key of keys) { //listofspecies
        const fields = config.nomenclature.filter[key]; // genus, species, ...
        if (fields) {
            const filterContent = filters[key]; // filterType, filterVal, caseSensitive, comparator
            const filterVal = filterContent.filterVal;
            if (typeof filterVal === "string") { // avoid redoing mapping on values that are already in { field, value }
                const newFilterValue = fields.map(f => ({ field: f, value: filterVal }));
                filterContent.filterVal = newFilterValue;
                filters[key] = filterContent;
            }
        }
    }
    return curatedFilters;
}

const curateSortFields = sortField => {
    const fields = config.nomenclature.filter[sortField];
    if (fields) {
        return fields;
    }
    return sortField;
}

const listOfSpeciesSorterLex = (losA, losB) => {
    // a > b = 1
    if (losA.genus > losB.genus) {
        return 1;
    } else if (losA.genus < losB.genus) {
        return -1;
    }
    if (losA.species > losB.species) {
        return 1;
    } else if (losA.species < losB.species) {
        return -1;
    }
    if (losA.subsp > losB.subsp) {
        return 1;
    } else if (losA.subsp < losB.subsp) {
        return -1;
    }
    if (losA.var > losB.var) {
        return 1;
    } else if (losA.var < losB.var) {
        return -1;
    }
    if (losA.forma > losB.forma) {
        return 1;
    } else if (losA.forma < losB.forma) {
        return -1;
    }
    if (losA.subvar > losB.subvar) {
        return 1;
    } else if (losA.subvar < losB.subvar) {
        return -1;
    }
    if (losA.authors > losB.authors) {
        return 1;
    } else if (losA.authors < losB.authors) {
        return -1;
    }
    // hybrid fields next
    if (losA.genusH > losB.genusH) {
        return 1;
    } else if (losA.genusH < losB.genusH) {
        return -1;
    }
    if (losA.speciesH > losB.speciesH) {
        return 1;
    } else if (losA.speciesH < losB.speciesH) {
        return -1;
    }
    if (losA.subspH > losB.subspH) {
        return 1;
    } else if (losA.subspH < losB.subspH) {
        return -1;
    }
    if (losA.varH > losB.varH) {
        return 1;
    } else if (losA.varH < losB.varH) {
        return -1;
    }
    if (losA.formaH > losB.formaH) {
        return 1;
    } else if (losA.formaH < losB.formaH) {
        return -1;
    }
    if (losA.subvarH > losB.subvarH) {
        return 1;
    } else if (losA.subvarH < losB.subvarH) {
        return -1;
    }
    if (losA.authorsH > losB.authorsH) {
        return 1;
    } else if (losA.authorsH < losB.authorsH) {
        return -1;
    }
    return 0;
}

function filterToWhereItem(filter, key) {
    const filterVal = filter.filterVal;
    if (Array.isArray(filterVal) && filterVal.length > 1) {
        const valsOr = [];
        for (const val of filterVal) {
            let itemKey = key, value = val;
            if (typeof val !== 'string') {
                itemKey = val.field;
                value = val.value;
            }
            valsOr.push(resolveByComparator(filter.comparator, itemKey, value));
        }
        return { 'or': valsOr };
    }
    return resolveByComparator(filter.comparator, key, filter.filterVal);
}

/**
 * For resolving filter comparator. Supports LIKE and EQ.
 * Loopback mysql connector does not support case insensitive.
 * @param {*} comparator 
 * @param {*} key 
 * @param {*} value 
 */
function resolveByComparator(comparator, key, value) {
    switch (comparator) {
        case 'LIKE':
            return {
                [key]: {
                    like: `%${value}%`
                }
            };
        case 'EQ':
        default:
            return {
                [key]: value
            };
    }
}

export default {
    listOfSpeciesForComponent,
    listOfSpeciesString,
    makeWhere,
    makeOrder,
    buildOptionsFromKeys,
    curateSearchFilters,
    curateSortFields,
    listOfSpeciesSorterLex
};