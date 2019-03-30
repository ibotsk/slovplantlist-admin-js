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

const listOfSpieces = (nomenclature, options = {}) => {

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
        name = name.concat(listOfSpieces(h));
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

const makeOrder = (sortField, sortOrder = 'ASC') => {
    if (sortOrder.toUpperCase() !== 'ASC' && sortOrder.toUpperCase() !== 'DESC') {
        sortOrder = 'ASC';
    };
    return [`${sortField} ${sortOrder.toUpperCase()}`];
}

const buildOptionsFromKeys = keys => {
    const obj = {};
    Object.keys(keys).forEach(t => {
        obj[t] = t;
    });
    return obj;
}

function filterToWhereItem(filter, key) {
    const filterVal = filter.filterVal;
    if (Array.isArray(filterVal) && filterVal.length > 1) {
        const valsOr = [];
        for (const val of filterVal) {
            valsOr.push(resolveByComparator(filter.comparator, key, val));
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

export default { listOfSpieces, makeWhere, makeOrder, buildOptionsFromKeys };