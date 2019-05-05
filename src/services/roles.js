import template from 'url-template';
import axios from './axios';

import config from '../config/config';

const getAll = async ({ accessToken }) => {
    const getAllUri = template.parse(config.uris.rolesUri.getAllWOrderUri).expand({ accessToken });
    const response = await axios.get(getAllUri);
    return response.data;
}

export default {
    getAll
}