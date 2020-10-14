import speciesService from '../services/species';
import helper from '../utils/helper';

import config from '../config/config';

const saveSynonyms = async ({
  id, list, syntype, accessToken,
}) => {
  let i = 1;
  // TODO: Promise.all
  for (const s of list) {
    const data = {
      id_parent: id,
      id_synonym: s.id,
      syntype,
      rorder: i,
    };
    i += 1;
    speciesService.postSynonym({ data, accessToken });
  }
};

const submitSynonyms = async ({
  id,
  nomenclatoricSynonyms,
  taxonomicSynonyms,
  invalidDesignations,
  accessToken,
  isNomenclatoricSynonymsChanged,
  isTaxonomicSynonymsChanged,
  isInvalidDesignationsChanged,
}) => {
  // get synonyms to be deleted
  const originalSynonyms = await speciesService.getAllSynonymsOf(
    { id, accessToken },
  );

  const toBeDeleted = [];

  // save new
  if (isNomenclatoricSynonymsChanged) {
    toBeDeleted.push(...originalSynonyms.filter((s) => (
      s.syntype === config.mappings.synonym.nomenclatoric.numType
    )));
    await saveSynonyms({
      id,
      list: nomenclatoricSynonyms,
      syntype: config.mappings.synonym.nomenclatoric.numType,
      accessToken,
    });
  }
  if (isTaxonomicSynonymsChanged) {
    toBeDeleted.push(...originalSynonyms.filter((s) => (
      s.syntype === config.mappings.synonym.taxonomic.numType
    )));
    await saveSynonyms({
      id,
      list: taxonomicSynonyms,
      syntype: config.mappings.synonym.taxonomic.numType,
      accessToken,
    });
  }
  if (isInvalidDesignationsChanged) {
    toBeDeleted.push(...originalSynonyms.filter((s) => (
      s.syntype === config.mappings.synonym.invalid.numType
    )));
    await saveSynonyms({
      id,
      list: invalidDesignations,
      syntype: config.mappings.synonym.invalid.numType,
      accessToken,
    });
  }

  // delete originals
  // TODO: Promise.all
  for (const syn of toBeDeleted) {
    speciesService.deleteSynonym({ id: syn.id, accessToken });
  }
};

// ----- PUBLIC ----- //

const getRecordById = async ({ id, accessToken }) => {
  const speciesRecord = await speciesService.getSpeciesRecordByIdWithFilter(
    { id, accessToken },
  );

  const accepted = helper.losToTypeaheadSelected(speciesRecord.accepted);
  const basionym = helper.losToTypeaheadSelected(speciesRecord.basionym);
  const replaced = helper.losToTypeaheadSelected(speciesRecord.replaced);
  const nomenNovum = helper.losToTypeaheadSelected(speciesRecord.nomenNovum);
  const genus = [{
    id: speciesRecord.genusRel.id,
    label: speciesRecord.genusRel.name,
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
    family,
  };
};

const getSpeciesById = async ({ id, accessToken }) => (
  speciesService.getSpeciesById({ id, accessToken })
);

const getAllSpecies = async ({ format, accessToken }) => {
  const listOfSpeciess = await speciesService.getAllSpecies(
    { format, accessToken },
  );

  if (!format) {
    return listOfSpeciess;
  }

  return listOfSpeciess.map(format);
};

const getAllSpeciesBySearchTerm = async ({ term, format, accessToken }) => {
  const listOfSpeciess = await speciesService.getAllSpeciesBySearchTerm(
    { term, accessToken },
  );

  if (!format) {
    return listOfSpeciess;
  }
  return listOfSpeciess.map(format);
};

const getSynonyms = async ({ id, accessToken }) => {
  const nomenclatoricSynonyms = await speciesService
    .getSynonymsNomenclatoricOf({ id, accessToken });
  nomenclatoricSynonyms.sort(helper.listOfSpeciesSorterLex);

  const taxonomicSynonyms = await speciesService
    .getSynonymsTaxonomicOf({ id, accessToken });
  taxonomicSynonyms.sort(helper.listOfSpeciesSorterLex);

  const invalidDesignations = await speciesService
    .getInvalidDesignationsOf({ id, accessToken });
  invalidDesignations.sort(helper.listOfSpeciesSorterLex);

  return { nomenclatoricSynonyms, taxonomicSynonyms, invalidDesignations };
};

const getBasionymsFor = async ({ id, accessToken }) => {
  const basionymFor = await speciesService.getBasionymFor({ id, accessToken });
  const replacedFor = await speciesService.getReplacedFor({ id, accessToken });
  const nomenNovumFor = await speciesService.getNomenNovumFor(
    { id, accessToken },
  );
  return {
    basionymFor,
    replacedFor,
    nomenNovumFor,
  };
};

const saveSpeciesAndSynonyms = async ({
  species,
  nomenclatoricSynonyms,
  taxonomicSynonyms,
  invalidDesignations,
  accessToken,
  isNomenclatoricSynonymsChanged = true,
  isTaxonomicSynonymsChanged = true,
  isInvalidDesignationsChanged = true,
}) => {
  await speciesService.putNomenclature({ data: species, accessToken });
  await submitSynonyms({
    id: species.id,
    nomenclatoricSynonyms,
    taxonomicSynonyms,
    invalidDesignations,
    accessToken,
    isNomenclatoricSynonymsChanged,
    isTaxonomicSynonymsChanged,
    isInvalidDesignationsChanged,
  });
};

const saveSpecies = async ({ data, accessToken }) => {
  await speciesService.putNomenclature({ data, accessToken });
};

export default {
  getRecordById,
  getSpeciesById,
  getAllSpecies,
  getAllSpeciesBySearchTerm,
  getSynonyms,
  getBasionymsFor,
  saveSpeciesAndSynonyms,
  saveSpecies,
};
