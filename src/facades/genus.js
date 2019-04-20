import genusService from '../services/genus';

const getAllGeneraBySearchTerm = async ({ term, format, accessToken }) => {
    const genera = await genusService.getAllGeneraBySearchTerm({ term, accessToken });

    if (!format) {
        return genera;
    }
    return genera.map(format);
}

const getAllGeneraWithFamilies = async ({ format, accessToken }) => {
    const genera = await genusService.getAllGeneraWithFamilies({ accessToken });

    if (!format) {
        return genera;
    }
    return genera.map(format);
}

const getGenusByIdWithFamilies = async ({ id, format, accessToken }) => {
    const genus = await genusService.getGenusByIdWithFamilies({ id, accessToken });

    const family = genus.family;
    const familyApg = genus.familyApg;

    delete genus.family;
    delete genus.familyApg;

    let toReturn = genus;
    if (format) {
        toReturn = format(genus);
    }

    return { genus: toReturn, family, familyApg };
}

const saveGenus = async ({ data, accessToken }) => {
    await genusService.putGenus({ data, accessToken });
}

export default {
    getAllGeneraBySearchTerm,
    getAllGeneraWithFamilies,
    getGenusByIdWithFamilies,
    saveGenus
}
