import template from 'url-template';
import axios from './axios';

import config from '../config/config';

const login = async (username, password) => {
    const loginUri = template.parse(config.uris.usersUri.loginUri).expand();

    const response = await axios.post(loginUri, {
        username,
        password
    });
    return response.data;
}

const logout = async (accessToken) => {
    const logoutUri = template.parse(config.uris.usersUri.logoutUri).expand({ accessToken });
    await axios.post(logoutUri);
}

const getAll = async ({ accessToken }) => {
    const getAllUri = template.parse(config.uris.usersUri.getAllWOrderUri).expand({ accessToken });
    const response = await axios.get(getAllUri);
    return response.data;
}

const getByIdWithRoles = async ({ id, accessToken }) => {
    const getByIdUri = template.parse(config.uris.usersUri.getByIdWithRolesUri).expand({ id, accessToken });
    const response = await axios.get(getByIdUri);
    return response.data;
}

const getGeneraByUserId = async ({ id, accessToken }) => {
    const getByIdUri = template.parse(config.uris.usersUri.getGeneraByUserId).expand({ id, accessToken });
    const response = await axios.get(getByIdUri);
    return response.data;
}

const createUser = async ({ data, accessToken }) => {
    const usersUri = template.parse(config.uris.usersUri.baseUri).expand({ accessToken });
    const response = await axios.post(usersUri, data);
    return response.data.id;
}

const updateUser = async ({ id, data, accessToken }) => {
    const usersUri = template.parse(config.uris.usersUri.updateByIdUri).expand({ id, accessToken });
    await axios.post(usersUri, data);
}

export default {
    login,
    logout,
    getAll,
    getByIdWithRoles,
    getGeneraByUserId,
    createUser,
    updateUser
}

