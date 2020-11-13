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
) {
  // get synonyms to be deleted
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

  const patchPromises = await updateAcceptedNameOfSynonyms(
    toBeUpserted, toBeDeleted, patchSynonymRefUri, accessToken,
  );

  return Promise.all([
    ...deletePromises,
    ...upsertPromises,
    ...patchPromises,
  ]);
}

export default {
  submitSynonyms,
};
