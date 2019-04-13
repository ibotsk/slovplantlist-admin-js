import template from 'url-template';
import axios from './axios';

import config from '../config/config';

const getFamilyById = async ({ id }) => {
    const getFamilyByIdUri = template.parse(config.uris.familiesUri.getByIdUri).expand({ id });
    const response = await axios.get(getFamilyByIdUri);
    return response.data;
}

const getFamilyApgById = async ({ id }) => {
    const getFamilyApgByIdUri = template.parse(config.uris.familiesApgUri.getByIdUri).expand({ id });
    const response = await axios.get(getFamilyApgByIdUri);
    return response.data;
}

const putFamily = async ({ data }) => {
    const familyUri = template.parse(config.uris.familiesUri.baseUri).expand();
    await axios.put(familyUri, data);
}

const putFamilyApg = async ({ data }) => {
    const familyApgUri = template.parse(config.uris.familiesApgUri.baseUri).expand();
    await axios.put(familyApgUri, data);
}

export default {
    getFamilyById,
    getFamilyApgById,
    putFamily,
    putFamilyApg
}