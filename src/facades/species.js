import differenceWith from 'lodash.differencewith';
import intersectionWith from 'lodash.intersectionwith';

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

/**
 * Upsert synonyms:
 *  - that are in currentList and are in newList
 *  - use id from currentList (an item can be removed and then added to the list -> it does not have id anymore)
 *  - everything else from newList (e.g. rorder, syntype might have changed)
 * Insert synonyms:
 *  - that are not in currentList and are in newList
 *  - they do not have id
 * Compare by id_parent and id_synonym.
 * @param {array} currentList
 * @param {array} newList
 * @param {number} syntype
 * @param {string} accessToken
 */
const saveSynonyms = async (
  currentList, newList, accessToken,
) => {
  const comparator = (value, other) => (
    value.id_parent === other.id_parent
    && value.id_synonym === other.id_synonym
  );
  // in newList that are not in currentList
  const toCreate = differenceWith(newList, currentList, comparator);
  const toUpdate = intersectionWith(currentList, newList, comparator) // find items that are in both arrays
    .map((cItem) => { // find those items in newList and use everything except id
      const newItem = newList.find((l) => comparator(cItem, l));
      return {
        ...newItem,
        id: cItem.id,
      };
    });

  const toUpsert = [...toCreate, ...toUpdate];

  return Promise.all(toUpsert.map((synonym) => (
    putRequest(synonymsUri.baseUri, synonym, {}, accessToken)
  )));
};

/**
 * is in currentList but is not in newList.
 * Compare by id_parent && id_synonym
 * @param {array} currentList
 * @param {array} newList
 */
const synonymIdsToBeDeleted = (currentList, newList) => undefined;

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
    // toBeDeleted.push(...originalSynonyms.filter((s) => (
    //   s.syntype === config.mappings.synonym.nomenclatoric.numType
    // )));
    await saveSynonyms(
      originalSynonyms,
      nomenclatoricSynonyms,
      accessToken,
    );
  }
  if (isTaxonomicSynonymsChanged) {
    // toBeDeleted.push(...originalSynonyms.filter((s) => (
    //   s.syntype === config.mappings.synonym.taxonomic.numType
    // )));
    await saveSynonyms(
      originalSynonyms,
      taxonomicSynonyms,
      accessToken,
    );
  }
  if (isInvalidDesignationsChanged) {
    // toBeDeleted.push(...originalSynonyms.filter((s) => (
    //   s.syntype === config.mappings.synonym.invalid.numType
    // )));
    await saveSynonyms(
      originalSynonyms,
      invalidDesignations,
      accessToken,
    );
  }

  // delete originals
  // TODO: Promise.all
  // for (const syn of toBeDeleted) {
  //   deleteRequest(synonymsUri.synonymsByIdUri, { id: syn.id }, accessToken);
  // }
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

const saveSpecies = async ({ data, accessToken }) => (
  putRequest(nomenclaturesUri.baseUri, data, {}, accessToken)
);

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
    saveSpecies({ data: species, accessToken }),
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

function createSynonym(idParent, idSynonym, syntype) {
  return {
    id_parent: parseInt(idParent, 10),
    id_synonym: idSynonym,
    syntype,
  };
}

export default {
  getRecordById,
  getSpeciesById,
  getAllSpecies,
  getAllSpeciesBySearchTerm,
  getSynonyms,
  getBasionymsFor,
  saveSpeciesAndSynonyms,
  saveSpecies,
  createSynonym,
};
