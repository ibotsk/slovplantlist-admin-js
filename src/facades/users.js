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

const getGeneraOfUser = async ({ userId, accessToken, format }) => {
    const genera = await usersService.getGeneraByUserId({ id: userId, accessToken });
    
    if (!format) {
        return genera;
    }
    return genera.map(format);
}

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

const login = async (username, password) => {
    return await usersService.login(username, password);
}

export default {
    getAllUsers,
    getUserById,
    getGeneraOfUser,
    saveUser,
    login
}