import template from 'url-template';
import axios from './axios';

import config from '../config/config';

const getAllGeneraBySearchTerm = async (term) => {
    const getAllBySearchTermUri = template.parse(config.uris.generaUri.getAllBySearchTermUri).expand({ term });
    const response = await axios.get(getAllBySearchTermUri);
    return response.data;
}

const getAllGeneraWithFamilies = async () => {
    const getAllWithFamilies = template.parse(config.uris.generaUri.getAllWithFamiliesUri).expand();
    const response = await axios.get(getAllWithFamilies);
    return response.data;
}

const getGenusByIdWithFamilies = async ({ id }) => {
    const getByIdWithFamiliesUri = template.parse(config.uris.generaUri.getByIdWithFamilies).expand({ id });
    const response = await axios.get(getByIdWithFamiliesUri);
    return response.data;
}

const putGenus = async ({ data }) => {
    const generaUri = template.parse(config.uris.generaUri.baseUri).expand();
    await axios.put(generaUri, data);
}

export default {
    getAllGeneraBySearchTerm,
    getAllGeneraWithFamilies,
    getGenusByIdWithFamilies,
    putGenus
}