import speciesService from '../services/species';

const getRecordById = async id => {
    return await speciesService.getSpeciesRecordByIdWithFilter(id);
}

const getAllSpecies = async format => {
    const listOfSpeciess = await speciesService.getAllSpecies(format);

    if (!format) {
        return listOfSpeciess;
    }

    return listOfSpeciess.map(format);
}

const getAllSpeciesBySearchTerm = async (term, format) => {
    const listOfSpeciess = await speciesService.getAllSpeciesBySearchTerm(term);

    if (!format) {
        return listOfSpeciess;
    }
    return listOfSpeciess.map(format);
}

const saveSpeciesAndSynonyms = async ({ species }) => {
    await speciesService.putNomenclature({ data: species });
}

export default {
    getRecordById,
    getAllSpecies,
    getAllSpeciesBySearchTerm,
    saveSpeciesAndSynonyms
};