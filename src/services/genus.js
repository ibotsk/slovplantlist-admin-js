import template from 'url-template';
import axios from './axios';

import config from '../config/config';

const getAllGeneraBySearchTerm = async (term) => {
    const getAllBySearchTermUri = template.parse(config.uris.generaUri.getAllBySearchTermUri).expand({ term });
    const response = await axios.get(getAllBySearchTermUri);
    return response.data;
}

export default {
    getAllGeneraBySearchTerm
}