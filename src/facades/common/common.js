import differenceWith from 'lodash.differencewith';
import intersectionWith from 'lodash.intersectionwith';

import { getRequest, deleteRequest, putRequest } from 'services/backend';

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
  idParent,
  allNewSynonyms,
  {
    getCurrentSynonymsUri,
    deleteSynonymsByIdUri,
    updateSynonymsUri,
  },
  accessToken,
) => {
  // get synonyms to be deleted
  const originalSynonyms = await getRequest(
    getCurrentSynonymsUri, { id: idParent }, accessToken,
  );

  const toBeDeleted = synonymIdsToBeDeleted(originalSynonyms, allNewSynonyms);
  const toBeUpserted = synonymsToUpsert(originalSynonyms, allNewSynonyms);

  const deletePromises = toBeDeleted.map((synId) => (
    deleteRequest(deleteSynonymsByIdUri, { id: synId }, accessToken)
  ));
  const upsertPromises = toBeUpserted.map((synonym) => (
    putRequest(updateSynonymsUri, synonym, {}, accessToken)
  ));

  return Promise.all([
    ...deletePromises,
    ...upsertPromises,
  ]);
};

export default {
  submitSynonyms,
};
