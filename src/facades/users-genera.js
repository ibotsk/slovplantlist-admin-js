import usersGeneraFacade from '../services/users-genera';

const saveUserGenera = async ({ userId, userGenera, accessToken }) => {

    for (const userGenus of userGenera) {
        const data = {
            id_user: userId,
            id_genus: userGenus.id
        };
        await usersGeneraFacade.putUserGenus({ data, accessToken });
    }

}

export default {
    saveUserGenera
}