import template from 'url-template';
import axios from './axios';

import config from '../config/config';

const getSpeciesRecordByIdWithFilter = async id => {
    const getByIdUri = template.parse(config.uris.nomenclaturesUri.getByIdWFilterUri).expand({ id });
    const response = await axios.get(getByIdUri);
    return response.data;
}

const getAllSpecies = async () => {
    const getAllListOfSpeciesUri = template.parse(config.uris.nomenclaturesUri.getAllWOrderUri).expand();
    const response = await axios.get(getAllListOfSpeciesUri);
    return response.data;
}

const getAllSpeciesBySearchTerm = async term => {
    const getAllBySearchTermUri = template.parse(config.uris.nomenclaturesUri.getAllBySearchTermUri).expand({ term });
    const response = await axios.get(getAllBySearchTermUri);
    return response.data;
}

export default {
    getSpeciesRecordByIdWithFilter,
    getAllSpecies,
    getAllSpeciesBySearchTerm
}