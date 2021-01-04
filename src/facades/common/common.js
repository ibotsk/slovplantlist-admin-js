import differenceWith from 'lodash.differencewith';
import intersectionWith from 'lodash.intersectionwith';

import {
  getRequest, deleteRequest, putRequest, patchRequest,
} from 'services/backend';

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
const getSynonymsToUpsert = (
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
 * @returns {array}
 */
const getSynonymsToBeDeleted = (currentList, newList) => (
  differenceWith(currentList, newList, synonymComparator)
);

const updateAcceptedNameOfSynonyms = async (
  synonymsForUpdate,
  synonymsForDelete,
  patchUri,
  accessToken,
  idPropName = 'idAcceptedName',
) => {
  // set [idPropName] of the synonym referent as idParent
  const updatePromises = synonymsForUpdate.map(({ idParent, idSynonym }) => {
    const data = { [idPropName]: idParent };
    return patchRequest(patchUri, data, { id: idSynonym }, accessToken);
  });
  // set [idPropName] to undefined
  const deletePromises = synonymsForDelete.map(({ idSynonym }) => {
    const data = { [idPropName]: null };
    return patchRequest(patchUri, data, { id: idSynonym }, accessToken);
  });

  return [...updatePromises, ...deletePromises];
};

function createSynonym(idParent, idSynonym, syntype) {
  return {
    idParent: parseInt(idParent, 10),
    idSynonym: parseInt(idSynonym, 10),
    syntype,
  };
}

/**
 * Manages synonyms of given parent
 * @param {number} idParent
 * @param {array} allNewSynonyms
 * @param {object} uris
 * @param {string} accessToken
 * @param {boolean} isUpdateAcceptedNames
 */
async function submitSynonyms(
  idParent,
  allNewSynonyms,
  {
    getCurrentSynonymsUri,
    deleteSynonymsByIdUri,
    updateSynonymsUri,
    patchSynonymRefUri,
  },
  accessToken,
  isUpdateAcceptedNames = false,
) {
  // get current synonyms
  const originalSynonyms = await getRequest(
    getCurrentSynonymsUri, { id: idParent }, accessToken,
  );

  const toBeDeleted = getSynonymsToBeDeleted(
    originalSynonyms, allNewSynonyms,
  );
  const idsToBeDeleted = toBeDeleted.map(({ id }) => id);
  const toBeUpserted = getSynonymsToUpsert(originalSynonyms, allNewSynonyms);

  const deletePromises = idsToBeDeleted.map((synId) => (
    deleteRequest(deleteSynonymsByIdUri, { id: synId }, accessToken)
  ));
  const upsertPromises = toBeUpserted.map((synonym) => (
    putRequest(updateSynonymsUri, synonym, {}, accessToken)
  ));

  const promises = [
    ...deletePromises,
    ...upsertPromises,
  ];

  if (isUpdateAcceptedNames) {
    const patchPromises = await updateAcceptedNameOfSynonyms(
      toBeUpserted, toBeDeleted, patchSynonymRefUri, accessToken,
    );
    promises.push(...patchPromises);
  }

  return Promise.all(promises);
}

/**
 * This function takes care of synonyms relations, when accepted name of an entity is changed.
 * The entity is identified by idSynonym.
 * If Accepted name is added and there was none before, synonym relation is created: idParent = newIdParent, idSynonym = idSynonym.
 * If Accepted name has changed and is not empty, existing synonym relation is updated.
 * If Accepted name is empty and was not before, existing synonym relation is deleted.
 */
async function manageAcceptedNameRelations(
  idSynonym, newIdParent, syntype, {
    getSynonymsByIdSynonymUri,
    upsertSynonymsUri,
    deleteSynonymUri,
  },
  accessToken,
) {
  const synonyms = await getRequest(
    getSynonymsByIdSynonymUri, { idSynonym }, accessToken,
  );

  if (newIdParent) {
    // create or update
    let synonymsToSave = [];
    if (!synonyms || synonyms.length === 0) {
      const newSynonym = createSynonym(newIdParent, idSynonym, syntype);
      synonymsToSave.push(newSynonym);
    } else {
      synonymsToSave = synonyms.map((s) => ({ ...s, idParent: newIdParent }));
    }
    return synonymsToSave.map(
      (s) => putRequest(upsertSynonymsUri, s, {}, accessToken),
    );
  }

  // delete because newIdParent is falsy
  return synonyms.map(
    ({ id }) => deleteRequest(deleteSynonymUri, { id }, accessToken),
  );
}

export default {
  createSynonym,
  manageAcceptedNameRelations,
  submitSynonyms,
};
