import usersGeneraService from '../services/users-genera';

const saveUserGenera = async ({ userId, generaIdsAdded, generaRemoved, accessToken }) => {
    const generaIdsToRemove = [...new Set(generaRemoved)];
    const idsToRemove = await getIdsForRemoval(userId, generaIdsToRemove, accessToken);

    for (const id of idsToRemove) {
        await usersGeneraService.deleteUserGenus({ id, accessToken });
    }

    for (const genusId of generaIdsAdded) {
        const data = {
            id_user: userId,
            id_genus: genusId
        };
        await usersGeneraService.putUserGenus({ data, accessToken });
    }

}

async function getIdsForRemoval(userId, generaIdsToRemove, accessToken) {
    const idsForRemoval = [];

    for (const genusId of generaIdsToRemove) {
        const userGenera = await usersGeneraService.getUserGeneraByUserIdAndGenusId({ userId, genusId, accessToken });
        
        const userGeneraIds = userGenera.map(ug => ug.id);
        idsForRemoval.push(...userGeneraIds);
    }
    return idsForRemoval;
}

export default {
    saveUserGenera
}