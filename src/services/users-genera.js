import template from 'url-template';
import axios from './axios';

import config from '../config/config';

const getUserGeneraByUserIdAndGenusId = async ({ userId, genusId, accessToken }) => {
    const uri = template.parse(config.uris.userGeneraUri.getAllByUserAndGenusUri).expand({ userId, genusId, accessToken });
    const result = await axios.get(uri);
    return result.data;
}

const putUserGenus = async ({ data, accessToken }) => {
    const usersGeneraUri = template.parse(config.uris.userGeneraUri.baseUri).expand({ accessToken });
    await axios.put(usersGeneraUri, data);
}

const deleteUserGenus = async ({ id, accessToken }) => {
    const deleteUri = template.parse(config.uris.userGeneraUri.deleteUri).expand({ id, accessToken });
    await axios.delete(deleteUri);
}

export default {
    getUserGeneraByUserIdAndGenusId,
    putUserGenus,
    deleteUserGenus
}