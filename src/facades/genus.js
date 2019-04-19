import genusServiceModule from '../services/genus';

export default (accessToken) => {

    const genusService = genusServiceModule(accessToken);

    const getAllGeneraBySearchTerm = async (term, format) => {
        const genera = await genusService.getAllGeneraBySearchTerm(term);

        if (!format) {
            return genera;
        }
        return genera.map(format);
    }

    const getAllGeneraWithFamilies = async (format) => {
        const genera = await genusService.getAllGeneraWithFamilies();

        if (!format) {
            return genera;
        }
        return genera.map(format);
    }

    const getGenusByIdWithFamilies = async ({ id }, format) => {
        const genus = await genusService.getGenusByIdWithFamilies({ id });

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

    const saveGenus = async ({ data }) => {
        await genusService.putGenus({ data });
    }

    return {
        getAllGeneraBySearchTerm,
        getAllGeneraWithFamilies,
        getGenusByIdWithFamilies,
        saveGenus
    }
}