import {
  getRequest,
  postRequest,
  deleteRequest,
  putRequest,
} from 'services/backend';
import { helperUtils } from 'utils';

import config from 'config/config';

const {
  uris: { nomenclaturesUri, synonymsUri },
} = config;

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
    // speciesService.postSynonym({ data, accessToken });
    postRequest(synonymsUri.baseUri, data, accessToken);
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
  const originalSynonyms = await getRequest(
    nomenclaturesUri.getSynonymsOfParent, { id }, accessToken,
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
    deleteRequest(synonymsUri.synonymsByIdUri, { id: syn.id }, accessToken);
  }
};

// ----- PUBLIC ----- //

const getRecordById = async ({ id, accessToken }) => {
  const speciesRecord = await getRequest(
    nomenclaturesUri.getByIdWFilterUri, { id }, accessToken,
  );

  const accepted = helperUtils.losToTypeaheadSelected(speciesRecord.accepted);
  const basionym = helperUtils.losToTypeaheadSelected(speciesRecord.basionym);
  const replaced = helperUtils.losToTypeaheadSelected(speciesRecord.replaced);
  const nomenNovum = helperUtils.losToTypeaheadSelected(
    speciesRecord.nomenNovum,
  );

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
  getRequest(nomenclaturesUri.getByIdUri, { id }, accessToken)
);

const getAllSpecies = async ({ format, accessToken }) => {
  const listOfSpeciess = await getRequest(
    nomenclaturesUri.getAllWOrderUri, {}, accessToken,
  );
  if (!format) {
    return listOfSpeciess;
  }
  return listOfSpeciess.map(format);
};

const getAllSpeciesBySearchTerm = async ({ term, format, accessToken }) => {
  const listOfSpeciess = await getRequest(
    nomenclaturesUri.getAllBySearchTermUri, { term }, accessToken,
  );

  if (!format) {
    return listOfSpeciess;
  }
  return listOfSpeciess.map(format);
};

const getSynonyms = async ({ id, accessToken }) => {
  const nomenclatoricSynonyms = await getRequest(
    nomenclaturesUri.getNomenclatoricSynonymsUri, { id }, accessToken,
  );
  nomenclatoricSynonyms.sort(helperUtils.listOfSpeciesSorterLex);

  const taxonomicSynonyms = await getRequest(
    nomenclaturesUri.getTaxonomicSynonymsUri, { id }, accessToken,
  );
  taxonomicSynonyms.sort(helperUtils.listOfSpeciesSorterLex);

  const invalidDesignations = await getRequest(
    nomenclaturesUri.getInvalidSynonymsUri, { id }, accessToken,
  );
  invalidDesignations.sort(helperUtils.listOfSpeciesSorterLex);

  return {
    nomenclatoricSynonyms,
    taxonomicSynonyms,
    invalidDesignations,
  };
};

const getBasionymsFor = async ({ id, accessToken }) => {
  const basionymFor = await getRequest(
    nomenclaturesUri.getBasionymForUri, { id }, accessToken,
  );
  const replacedFor = await getRequest(
    nomenclaturesUri.getReplacedForUri, { id }, accessToken,
  );
  const nomenNovumFor = await getRequest(
    nomenclaturesUri.getNomenNovumForUri, { id }, accessToken,
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
}) => (
  Promise.all([
    putRequest(nomenclaturesUri.baseUri, species, accessToken),
    submitSynonyms({
      id: species.id,
      nomenclatoricSynonyms,
      taxonomicSynonyms,
      invalidDesignations,
      accessToken,
      isNomenclatoricSynonymsChanged,
      isTaxonomicSynonymsChanged,
      isInvalidDesignationsChanged,
    }),
  ])
);

const saveSpecies = async ({ data, accessToken }) => (
  putRequest(nomenclaturesUri.baseUri, data, accessToken)
);

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
