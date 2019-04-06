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

/**
 * The result is ordered by id, the sorting from uri is not taken into account
 * @param {*} id 
 * @param {*} accessToken 
 */
const getSynonymsNomenclatoricOf = async ({ id, accessToken }) => {
    const getSynonymsNomenclatoricUri = template.parse(config.uris.nomenclaturesUri.getNomenclatoricSynonymsUri).expand({ id });
    const response = await axios.get(getSynonymsNomenclatoricUri);
    return response.data;
}

// same
const getSynonymsTaxonomicOf = async ({ id, accessToken }) => {
    const getSynonymsTaxonomicUri = template.parse(config.uris.nomenclaturesUri.getTaxonomicSynonymsUri).expand({ id });
    const response = await axios.get(getSynonymsTaxonomicUri);
    return response.data;
}

//same
const getInvalidDesignationsOf = async ({ id, accessToken }) => {
    const getInvalidDesignationsUri = template.parse(config.uris.nomenclaturesUri.getInvalidSynonymsUri).expand({ id });
    const response = await axios.get(getInvalidDesignationsUri);
    return response.data;
}

const putNomenclature = async ({ data }) => {
    const nomenclaturesUri = template.parse(config.uris.nomenclaturesUri.baseUri).expand();
    await axios.put(nomenclaturesUri, data);
}

export default {
    getSpeciesRecordByIdWithFilter,
    getAllSpecies,
    getAllSpeciesBySearchTerm,
    getSynonymsNomenclatoricOf,
    getSynonymsTaxonomicOf,
    getInvalidDesignationsOf,
    putNomenclature
}