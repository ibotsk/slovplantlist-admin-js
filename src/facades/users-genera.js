import {
  getRequest,
  putRequest,
  deleteRequest,
} from 'services/backend';

import config from 'config/config';

const {
  uris: { userGeneraUri },
} = config;

const getIdsForRemoval = async (userId, generaIdsToRemove, accessToken) => {
  const idsForRemoval = [];

  const promises = generaIdsToRemove.map(async (genusId) => {
    const userGenera = await getRequest(
      userGeneraUri.getAllByUserAndGenusUri, { userId, genusId }, accessToken,
    );
    const userGeneraIds = userGenera.map((ug) => ug.id);
    idsForRemoval.push(...userGeneraIds);
  });

  await Promise.all(promises);

  return idsForRemoval;
};

// ----- PUBLIC ----- //

async function saveUserGenera({
  userId, generaIdsAdded, generaRemoved, accessToken,
}) {
  const promises = [];

  if (generaRemoved && generaRemoved.length > 0) {
    const generaIdsToRemove = [...new Set(generaRemoved)];
    const idsToRemove = await getIdsForRemoval(
      userId, generaIdsToRemove, accessToken,
    );

    const idsToDeletePromises = idsToRemove.map((id) => (
      deleteRequest(userGeneraUri.deleteUri, { id }, accessToken)
    ));
    promises.push(...idsToDeletePromises);
  }

  if (generaIdsAdded && generaIdsAdded.length > 0) {
    const generaIdsToSavePromises = generaIdsAdded.map(async (genusId) => {
      const data = {
        idUser: userId,
        idGenus: genusId,
      };
      return putRequest(userGeneraUri.baseUri, data, undefined, accessToken);
    });
    promises.push(...generaIdsToSavePromises);
  }

  return Promise.all(promises);
}

export default {
  saveUserGenera,
};
