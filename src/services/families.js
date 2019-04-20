import template from 'url-template';
import axios from './axios';

import config from '../config/config';

const getFamilyById = async ({ id, accessToken }) => {
    const getFamilyByIdUri = template.parse(config.uris.familiesUri.getByIdUri).expand({ id, accessToken });
    const response = await axios.get(getFamilyByIdUri);
    return response.data;
}

const getAllFamilies = async ({ accessToken }) => {
    const getAllFamiliesUri = template.parse(config.uris.familiesUri.getAllWOrderUri).expand({ accessToken });
    const response = await axios.get(getAllFamiliesUri);
    return response.data;
}

const getFamilyApgById = async ({ id, accessToken }) => {
    const getFamilyApgByIdUri = template.parse(config.uris.familiesApgUri.getByIdUri).expand({ id, accessToken });
    const response = await axios.get(getFamilyApgByIdUri);
    return response.data;
}

const getAllFamiliesApg = async ({ accessToken }) => {
    const getAllFamiliesApgUri = template.parse(config.uris.familiesApgUri.getAllWOrderUri).expand({ accessToken });
    const response = await axios.get(getAllFamiliesApgUri);
    return response.data;
}

const putFamily = async ({ data, accessToken }) => {
    const familyUri = template.parse(config.uris.familiesUri.baseUri).expand({ accessToken });
    await axios.put(familyUri, data);
}

const putFamilyApg = async ({ data, accessToken }) => {
    const familyApgUri = template.parse(config.uris.familiesApgUri.baseUri).expand({ accessToken });
    await axios.put(familyApgUri, data);
}

export default {
    getFamilyById,
    getAllFamilies,
    getFamilyApgById,
    getAllFamiliesApg,
    putFamily,
    putFamilyApg
}
