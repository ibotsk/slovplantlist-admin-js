import template from 'url-template';
import axios from './axios';

import config from '../config/config';

const getAllGeneraBySearchTerm = async ({ term, accessToken }) => {
    const getAllBySearchTermUri = template.parse(config.uris.generaUri.getAllBySearchTermUri).expand({ term, accessToken });
    const response = await axios.get(getAllBySearchTermUri);
    return response.data;
}

const getAllGeneraWithFamilies = async ({ accessToken }) => {
    const getAllWithFamilies = template.parse(config.uris.generaUri.getAllWithFamiliesUri).expand({ accessToken });
    const response = await axios.get(getAllWithFamilies);
    return response.data;
}

const getGenusByIdWithFamilies = async ({ id, accessToken }) => {
    const getByIdWithFamiliesUri = template.parse(config.uris.generaUri.getByIdWithFamilies).expand({ id, accessToken });
    const response = await axios.get(getByIdWithFamiliesUri);
    return response.data;
}

const putGenus = async ({ data, accessToken }) => {
    const generaUri = template.parse(config.uris.generaUri.baseUri).expand({ accessToken });
    await axios.put(generaUri, data);
}

export default {
    getAllGeneraBySearchTerm,
    getAllGeneraWithFamilies,
    getGenusByIdWithFamilies,
    putGenus
};

