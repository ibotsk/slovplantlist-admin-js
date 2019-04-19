import template from 'url-template';
import axiosModule from './axios';

import config from '../config/config';

export default (accessToken) => {

    const axios = axiosModule(accessToken);

    const login = async (username, password) => {
        const loginUri = template.parse(config.uris.usersUri.loginUri).expand();

        const response = await axios.post(loginUri, {
            username,
            password
        });
        return response.data;
    }

    const logout = async () => {
        const logoutUri = template.parse(config.uris.usersUri.logoutUri).expand();
        await axios.post(logoutUri);
    }

    return {
        login,
        logout
    }

}
