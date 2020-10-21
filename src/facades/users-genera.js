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
  const generaIdsToRemove = [...new Set(generaRemoved)];
  const idsToRemove = await getIdsForRemoval(
    userId, generaIdsToRemove, accessToken,
  );

  // TODO: Promise.all
  for (const id of idsToRemove) {
    deleteRequest(userGeneraUri.deleteUri, { id }, accessToken);
  }

  // TODO: Promise.all
  for (const genusId of generaIdsAdded) {
    const data = {
      id_user: userId,
      id_genus: genusId,
    };
    putRequest(userGeneraUri.baseUri, data, undefined, accessToken);
  }
}

export default {
  saveUserGenera,
};
