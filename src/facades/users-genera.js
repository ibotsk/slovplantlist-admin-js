import usersGeneraService from '../services/users-genera';

async function getIdsForRemoval(userId, generaIdsToRemove, accessToken) {
  const idsForRemoval = [];

  // TODO: Promise.all
  for (const genusId of generaIdsToRemove) {
    const userGenera = await usersGeneraService.getUserGeneraByUserIdAndGenusId(
      { userId, genusId, accessToken },
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
    usersGeneraService.deleteUserGenus({ id, accessToken });
  }

  // TODO: Promise.all
  for (const genusId of generaIdsAdded) {
    const data = {
      id_user: userId,
      id_genus: genusId,
    };
    usersGeneraService.putUserGenus({ data, accessToken });
  }
};

export default {
  saveUserGenera,
};
