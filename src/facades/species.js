import differenceWith from 'lodash.differencewith';
import intersectionWith from 'lodash.intersectionwith';

import {
  getRequest,
  deleteRequest,
  putRequest,
} from 'services/backend';
import { helperUtils } from 'utils';

import config from 'config/config';

const {
  uris: { nomenclaturesUri, synonymsUri },
} = config;

const synonymComparator = (value, other) => (
  value.idParent === other.idParent
  && value.idSynonym === other.idSynonym
);

/**
 * Upsert synonyms:
 *  - that are in currentList and are in newList
 *  - use id from currentList (an item can be removed and then added to the list -> it does not have id anymore)
 *  - everything else from newList (e.g. rorder, syntype might have changed)
 * Insert synonyms:
 *  - that are not in currentList and are in newList
 *  - they do not have id
 * Compare by idParent and idPynonym.
 * @param {array} currentList
 * @param {array} newList
 * @param {number} syntype
 * @param {string} accessToken
 */
const synonymsToUpsert = (
  currentList, newList,
) => {
  // in newList that are not in currentList
  const toCreate = differenceWith(newList, currentList, synonymComparator);
  const toUpdate = intersectionWith(currentList, newList, synonymComparator) // find items that are in both arrays
    .map((cItem) => { // find those items in newList and use everything except id
      const newItem = newList.find((l) => synonymComparator(cItem, l));
      return {
        ...newItem,
        id: cItem.id,
      };
    });

  return [...toCreate, ...toUpdate];
};

/**
 * Synonyms that:
 *  are in currentList but are not in newList.
 * Compare by idParent && idPynonym
 * @param {array} currentList
 * @param {array} newList
 * @returns {array} of ids
 */
const synonymIdsToBeDeleted = (currentList, newList) => {
  const toDelete = differenceWith(currentList, newList, synonymComparator);
  return toDelete.map(({ id }) => id);
};

const submitSynonyms = async (
  id,
  allNewSynonyms,
  accessToken,
) => {
  // get synonyms to be deleted
  const originalSynonyms = await getRequest(
    nomenclaturesUri.getSynonymsOfParent, { id }, accessToken,
  );

  const toBeDeleted = synonymIdsToBeDeleted(originalSynonyms, allNewSynonyms);
  const toBeUpserted = synonymsToUpsert(originalSynonyms, allNewSynonyms);

  const deletePromises = toBeDeleted.map((synId) => (
    deleteRequest(synonymsUri.synonymsByIdUri, { id: synId }, accessToken)
  ));
  const upsertPromises = toBeUpserted.map((synonym) => (
    putRequest(synonymsUri.baseUri, synonym, {}, accessToken)
  ));

  return Promise.all([
    ...deletePromises,
    ...upsertPromises,
  ]);
};

// ----- PUBLIC ----- //

async function getRecordById(id, accessToken) {
  const speciesRecord = await getRequest(
    nomenclaturesUri.getByIdWFilterUri, { id }, accessToken,
  );

  const accepted = helperUtils.losToTypeaheadSelected(speciesRecord.accepted);
  const basionym = helperUtils.losToTypeaheadSelected(speciesRecord.basionym);
  const replaced = helperUtils.losToTypeaheadSelected(speciesRecord.replaced);
  const nomenNovum = helperUtils.losToTypeaheadSelected(
    speciesRecord['nomen-novum'],
  );

  const genus = [{
    id: speciesRecord['genus-rel'].id,
    label: speciesRecord['genus-rel'].name,
  }];
  const { name: familyApg } = speciesRecord['genus-rel']['family-apg'];
  const { name: family } = speciesRecord['genus-rel'].family;

  delete speciesRecord.accepted;
  delete speciesRecord.basionym;
  delete speciesRecord.replaced;
  delete speciesRecord['nomen-novum'];
  delete speciesRecord['genus-rel'];

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
}

async function getSpeciesById(id, accessToken) {
  return getRequest(nomenclaturesUri.getByIdUri, { id }, accessToken);
}

async function getAllSpecies(accessToken, format = undefined) {
  const listOfSpeciess = await getRequest(
    nomenclaturesUri.getAllWOrderUri, {}, accessToken,
  );
  if (!format) {
    return listOfSpeciess;
  }
  return listOfSpeciess.map(format);
}

async function getAllSpeciesBySearchTerm(
  term, accessToken, format = undefined,
) {
  const listOfSpeciess = await getRequest(
    nomenclaturesUri.getAllBySearchTermUri, { term }, accessToken,
  );

  if (!format) {
    return listOfSpeciess;
  }
  return listOfSpeciess.map(format);
}

async function getSynonyms(id, accessToken) {
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

  const misidentifications = await getRequest(
    nomenclaturesUri.getMisidentificationsUri, { id }, accessToken,
  );

  return {
    nomenclatoricSynonyms,
    taxonomicSynonyms,
    invalidDesignations,
    misidentifications,
  };
}

async function getBasionymsFor(id, accessToken) {
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
}

async function saveSpecies(data, accessToken) {
  return putRequest(nomenclaturesUri.baseUri, data, undefined, accessToken);
}

async function saveSpeciesAndSynonyms({
  species,
  nomenclatoricSynonyms,
  taxonomicSynonyms,
  invalidDesignations,
  misidentifications,
  accessToken,
}) {
  const allNewSynonyms = [
    ...nomenclatoricSynonyms,
    ...taxonomicSynonyms,
    ...invalidDesignations,
    ...misidentifications,
  ];

  return Promise.all([
    saveSpecies(species, accessToken),
    submitSynonyms(species.id, allNewSynonyms, accessToken),
  ]);
}

function createSynonym(idParent, idSynonym, syntype) {
  return {
    idParent: parseInt(idParent, 10),
    idSynonym,
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
