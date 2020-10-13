import template from 'url-template';
import axios from './axios';

import config from '../config/config';

const getRoleMappingByUser = async ({ userId, accessToken }) => {
    const getByPrincipalIdUri = template.parse(config.uris.roleMappingsUri.getByPrincipalIdUri).expand({ principalId: userId, accessToken });
    const response = await axios.get(getByPrincipalIdUri);
    return response.data;
}

const putRoleMapping = async ({ data, accessToken }) => {
    const roleMappingsUri = template.parse(config.uris.roleMappingsUri.baseUri).expand({ accessToken });
    await axios.put(roleMappingsUri, data);
}

export default {
    getRoleMappingByUser,
    putRoleMapping
}