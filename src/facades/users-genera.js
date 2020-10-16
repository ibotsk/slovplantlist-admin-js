import {
  getRequest,
  putRequest,
  deleteRequest,
} from 'services/services';

import config from 'config/config';

const {
  uris: { userGeneraUri },
} = config;

async function getIdsForRemoval(userId, generaIdsToRemove, accessToken) {
  const idsForRemoval = [];

  // TODO: Promise.all
  for (const genusId of generaIdsToRemove) {
    const userGenera = await getRequest(
      userGeneraUri.getAllByUserAndGenusUri, { userId, genusId }, accessToken,
    );

    const userGeneraIds = userGenera.map((ug) => ug.id);
    idsForRemoval.push(...userGeneraIds);
  }
  return idsForRemoval;
}

const saveUserGenera = async ({
  userId, generaIdsAdded, generaRemoved, accessToken,
}) => {
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
    putRequest(userGeneraUri.baseUri, data, accessToken);
  }
};

export default {
  saveUserGenera,
};
