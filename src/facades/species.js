import speciesService from '../services/species';
import helper from '../utils/helper';
import formatter from '../utils/formatter';

import config from '../config/config';

const getRecordById = async id => {
    const speciesRecord = await speciesService.getSpeciesRecordByIdWithFilter(id);

    const accepted = formatter.losToTypeaheadSelected(speciesRecord.accepted);
    const basionym = formatter.losToTypeaheadSelected(speciesRecord.basionym);
    const replaced = formatter.losToTypeaheadSelected(speciesRecord.replaced);
    const nomenNovum = formatter.losToTypeaheadSelected(speciesRecord.nomenNovum);
    const genus = [{
        id: speciesRecord.genusRel.id,
        label: speciesRecord.genusRel.name
    }];
    const familyApg = speciesRecord.genusRel.familyApg.name;
    const family = speciesRecord.genusRel.family.name;

    delete speciesRecord.accepted;
    delete speciesRecord.basionym;
    delete speciesRecord.replaced;
    delete speciesRecord.nomenNovum;
    delete speciesRecord.genusRel;

    return {
        speciesRecord,
        accepted,
        basionym,
        replaced,
        nomenNovum,
        genus,
        familyApg,
        family
    };
}

const getSpeciesById = async ({ id }) => {
    return await speciesService.getSpeciesById({ id });
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

const getSynonyms = async (id) => {

    const nomenclatoricSynonyms = await speciesService.getSynonymsNomenclatoricOf({ id });
    nomenclatoricSynonyms.sort(helper.listOfSpeciesSorterLex);

    const taxonomicSynonyms = await speciesService.getSynonymsTaxonomicOf({ id });
    taxonomicSynonyms.sort(helper.listOfSpeciesSorterLex);

    const invalidDesignations = await speciesService.getInvalidDesignationsOf({ id });
    invalidDesignations.sort(helper.listOfSpeciesSorterLex);

    return { nomenclatoricSynonyms, taxonomicSynonyms, invalidDesignations };
}

const getBasionymsFor = async (id) => {
    const basionymFor = await speciesService.getBasionymFor({ id });
    const replacedFor = await speciesService.getReplacedFor({ id });
    const nomenNovumFor = await speciesService.getNomenNovumFor({ id });
    return {
        basionymFor,
        replacedFor,
        nomenNovumFor
    }
}

const saveSpeciesAndSynonyms = async ({
    species,
    nomenclatoricSynonyms,
    taxonomicSynonyms,
    invalidDesignations,
    isNomenclatoricSynonymsChanged = true,
    isTaxonomicSynonymsChanged = true,
    isInvalidDesignationsChanged = true }) => {

    await speciesService.putNomenclature({ data: species });
    await submitSynonyms({
        id: species.id,
        nomenclatoricSynonyms,
        taxonomicSynonyms,
        invalidDesignations,
        isNomenclatoricSynonymsChanged,
        isTaxonomicSynonymsChanged,
        isInvalidDesignationsChanged
    });
}

const saveSpecies = async ({ data }) => {
    await speciesService.putNomenclature({ data });
}

async function submitSynonyms({
    id,
    nomenclatoricSynonyms,
    taxonomicSynonyms,
    invalidDesignations,
    isNomenclatoricSynonymsChanged,
    isTaxonomicSynonymsChanged,
    isInvalidDesignationsChanged }) {
    // get synonyms to be deleted
    const originalSynonyms = await speciesService.getAllSynonymsOf({ id });

    const toBeDeleted = [];

    // save new
    if (isNomenclatoricSynonymsChanged) {
        toBeDeleted.push(...originalSynonyms.filter(s => s.syntype === config.mappings.synonym.nomenclatoric.numType));
        await saveSynonyms({
            id,
            list: nomenclatoricSynonyms,
            syntype: config.mappings.synonym.nomenclatoric.numType
        });
    }
    if (isTaxonomicSynonymsChanged) {
        toBeDeleted.push(...originalSynonyms.filter(s => s.syntype === config.mappings.synonym.taxonomic.numType));
        await saveSynonyms({
            id,
            list: taxonomicSynonyms,
            syntype: config.mappings.synonym.taxonomic.numType
        });
    }
    if (isInvalidDesignationsChanged) {
        toBeDeleted.push(...originalSynonyms.filter(s => s.syntype === config.mappings.synonym.invalid.numType));
        await saveSynonyms({
            id,
            list: invalidDesignations,
            syntype: config.mappings.synonym.invalid.numType
        });
    }

    // delete originals
    for (const syn of toBeDeleted) {
        await speciesService.deleteSynonym({ id: syn.id });
    }
}

async function saveSynonyms({ id, list, syntype }) {
    let i = 1;
    for (const s of list) {
        const data = {
            id_parent: id,
            id_synonym: s.id,
            syntype,
            rorder: i
        };
        i++;
        await speciesService.postSynonym({ data });
    }
}

export default {
    getRecordById,
    getSpeciesById,
    getAllSpecies,
    getAllSpeciesBySearchTerm,
    getSynonyms,
    getBasionymsFor,
    saveSpeciesAndSynonyms,
    saveSpecies
};