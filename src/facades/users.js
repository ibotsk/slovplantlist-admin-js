import usersService from '../services/user-service';

import config from '../config/config';

const getAllUsers = async ({ accessToken }) => {
    return usersService.getAll({ accessToken });
}

const getUserById = async ({ id, accessToken }) => {
    const user = await usersService.getByIdWithRoles({ id, accessToken });
    user.password = '';
    const roles = user.roles;

    delete user.roles;

    return { 
        user, 
        roles 
    };
};

const saveUser = async ({ data, accessToken }) => {
    const user = {
        ...data,
        realm: config.constants.userRealm
    };
    if (data.id) {
        if (!user.password) { // when editing, password is set to empty, unless set new
            delete user.password;
        }
        await usersService.updateUser({ 
            id: user.id, 
            data: user, 
            accessToken 
        });
        return user.id;
    } else {
        return await usersService.createUser({ 
            data: user,
            accessToken
        });
    }
}

export default {
    getAllUsers,
    getUserById,
    saveUser
}