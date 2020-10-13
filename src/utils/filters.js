import config from '../config/config';

/**
 * If filter key is in config.nomenclature.filter then modify that filter such as new
 * filterVal = [{ field, value }] where field is for every value from the config nad value is original filterVal.
 * @param {*} filters 
 */
function curateSearchFilters(filters, { ownerId }) {
    let curatedFilters = { ...filters };
    // const keys = Object.keys(curatedFilters);
    // for (const key of keys) { //listofspecies
    //     const fields = config.nomenclature.filter[key]; // genus, species, ...
    //     if (fields) {
    //         const filterContent = curatedFilters[key]; // filterType, filterVal, caseSensitive, comparator
    //         const filterVal = filterContent.filterVal;
    //         if (typeof filterVal === "string") { // avoid redoing mapping on values that are already in { field, value }
    //             const newFilterValue = fields.map(f => ({ field: f, value: filterVal }));
    //             filterContent.filterVal = newFilterValue;
    //             curatedFilters[key] = filterContent;
    //         }
    //     }
    // }
    const listOfSpeciesFilter = curateListofspeciesFilter(curatedFilters);
    const ownershipFilter = curateOwnershipFilter(curatedFilters, ownerId);
    curatedFilters = { ...curatedFilters, ...listOfSpeciesFilter, ...ownershipFilter };
    return curatedFilters;
}

function curateSortFields(sortField) {
    const fields = config.nomenclature.filter[sortField];
    if (fields) {
        return fields;
    }
    return sortField;
}

function curateListofspeciesFilter(filters) {
    const listOfSpeciesKey = config.constants.listOfSpeciesColumn;
    const fields = config.nomenclature.filter[listOfSpeciesKey];
    const curatedFilters = {};

    const filterContent = filters[listOfSpeciesKey]; // filterType, filterVal, caseSensitive, comparator
    if (fields && filterContent) {
        const filterVal = filterContent.filterVal;
        if (typeof filterVal === "string") { // avoid redoing mapping on values that are already in { field, value }
            const newFilterValue = fields.map(f => ({ field: f, value: filterVal }));
            filterContent.filterVal = newFilterValue;
            curatedFilters[listOfSpeciesKey] = filterContent;
        }
    }
    return curatedFilters;
}

function curateOwnershipFilter(filters, ownerId) {
    const ownershipKey = config.constants.ownership;
    const ownershipMapping = config.mappings.ownership;
    const filterContent = filters[ownershipKey];
    const regexp = makeOwnershipRegexp(ownerId);

    const curatedFilter = {};
    if (filterContent) {
        const filterVal = filterContent.filterVal;
        let newValue = '', comparator = '';
        switch (filterVal) {
            case ownershipMapping.mine.key:
                comparator = 'REGEXP';
                newValue = regexp;
                break;
            case ownershipMapping.others.key:
                comparator = 'NEQ';
                newValue = { and: [null, "", `${ownerId}`] };
                break;
            case ownershipMapping.unassigned.key:
                comparator = '=';
                newValue = [null, ""];
                break;
            case ownershipMapping.notmine.key:
                comparator = 'NEQ';
                newValue = `${ownerId}`;
                break;
            default:
                break;
        }
        curatedFilter[ownershipKey] = {
            ...filterContent,
            filterVal: newValue,
            comparator
        }
    }
    return curatedFilter;
}

function makeOwnershipRegexp(value) {
    const regexpString = `${config.constants.ownershipRegexp.start}${value}${config.constants.ownershipRegexp.end}`;
    return regexpString;
}

export default {
    curateSearchFilters,
    curateSortFields
}