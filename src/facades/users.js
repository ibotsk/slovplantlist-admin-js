import usersService from '../services/user-service';

import config from '../config/config';

const getAllUsers = async ({ accessToken }) => {
    return usersService.getAll({ accessToken });
}

const getUserById = async ({ id, accessToken }) => {
    const user = await usersService.getByIdWithRoles({ id, accessToken });
    user.password = '';
    return user;
};

const saveUser = async ({ data, accessToken }) => {
    const user = {
        ...data,
        realm: config.constants.userRealm
    };
    await usersService.putUser({ data: user, accessToken });
}

export default {
    getAllUsers,
    getUserById,
    saveUser
}