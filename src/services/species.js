import template from 'url-template';
import axios from './axios';

import config from '../config/config';

const getSpeciesRecordByIdWithFilter = async id => {
    const getByIdUri = template.parse(config.uris.nomenclaturesUri.getByIdWFilterUri).expand({ id });
    console.log(getByIdUri, id);
    
    const response = await axios.get(getByIdUri);
    return response.data;
}

export default {
    getSpeciesRecordByIdWithFilter
}