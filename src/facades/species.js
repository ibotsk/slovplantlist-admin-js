import speciesService from '../services/species';
import formatter from '../utils/formatter';

const getRecordById = async id => {
    const speciesRecord = await speciesService.getSpeciesRecordByIdWithFilter(id);

    const accepted = formatter.losToTypeaheadSelected(speciesRecord.accepted);
    const basionym = formatter.losToTypeaheadSelected(speciesRecord.basionym);
    const replaced = formatter.losToTypeaheadSelected(speciesRecord.replaced);
    const nomenNovum = formatter.losToTypeaheadSelected(speciesRecord.nomenNovum);

    delete speciesRecord.accepted;
    delete speciesRecord.basionym;
    delete speciesRecord.replaced;
    delete speciesRecord.nomenNovum;

    return {
        speciesRecord,
        accepted,
        basionym,
        replaced,
        nomenNovum
    };
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