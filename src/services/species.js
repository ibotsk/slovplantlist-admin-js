import template from 'url-template';
import axios from './axios';

import config from '../config/config';

const getSpeciesRecordByIdWithFilter = async ({ id, accessToken }) => {
    const getByIdUri = template.parse(config.uris.nomenclaturesUri.getByIdWFilterUri).expand({ id, accessToken });
    const response = await axios.get(getByIdUri);
    return response.data;
}

const getSpeciesById = async ({ id, accessToken }) => {
    const getByIdUri = template.parse(config.uris.nomenclaturesUri.getByIdUri).expand({ id, accessToken });
    const response = await axios.get(getByIdUri);
    return response.data;
}

const getAllSpecies = async ({ accessToken }) => {
    const getAllListOfSpeciesUri = template.parse(config.uris.nomenclaturesUri.getAllWOrderUri).expand({ accessToken });
    const response = await axios.get(getAllListOfSpeciesUri);
    return response.data;
}

const getAllSpeciesBySearchTerm = async ({ term, accessToken }) => {
    const getAllBySearchTermUri = template.parse(config.uris.nomenclaturesUri.getAllBySearchTermUri).expand({ term, accessToken });
    const response = await axios.get(getAllBySearchTermUri);
    return response.data;
}

/**
 * The result is ordered by id, the sorting from uri is not taken into account
 * @param {*} id 
 */
const getSynonymsNomenclatoricOf = async ({ id, accessToken }) => {
    const getSynonymsNomenclatoricUri = template.parse(config.uris.nomenclaturesUri.getNomenclatoricSynonymsUri).expand({ id, accessToken });
    const response = await axios.get(getSynonymsNomenclatoricUri);
    return response.data;
}

// same
const getSynonymsTaxonomicOf = async ({ id, accessToken }) => {
    const getSynonymsTaxonomicUri = template.parse(config.uris.nomenclaturesUri.getTaxonomicSynonymsUri).expand({ id, accessToken });
    const response = await axios.get(getSynonymsTaxonomicUri);
    return response.data;
}

//same
const getInvalidDesignationsOf = async ({ id, accessToken }) => {
    const getInvalidDesignationsUri = template.parse(config.uris.nomenclaturesUri.getInvalidSynonymsUri).expand({ id, accessToken });
    const response = await axios.get(getInvalidDesignationsUri);
    return response.data;
}

const getAllSynonymsOf = async ({ id, accessToken }) => {
    const getParentOfSynonymsUri = template.parse(config.uris.nomenclaturesUri.getSynonymsOfParent).expand({ id, accessToken });
    const response = await axios.get(getParentOfSynonymsUri);
    return response.data;
}

const getBasionymFor = async ({ id, accessToken }) => {
    const getBasionymForUri = template.parse(config.uris.nomenclaturesUri.getBasionymForUri).expand({ id, accessToken });
    const response = await axios.get(getBasionymForUri);
    return response.data;
}

const getReplacedFor = async ({ id, accessToken }) => {
    const getReplacedForUri = template.parse(config.uris.nomenclaturesUri.getReplacedForUri).expand({ id, accessToken });
    const response = await axios.get(getReplacedForUri);
    return response.data;
}

const getNomenNovumFor = async ({ id, accessToken }) => {
    const getNomenNovumForUri = template.parse(config.uris.nomenclaturesUri.getNomenNovumForUri).expand({ id, accessToken });
    const response = await axios.get(getNomenNovumForUri);
    return response.data;
}

const putNomenclature = async ({ data, accessToken }) => {
    const nomenclaturesUri = template.parse(config.uris.nomenclaturesUri.baseUri).expand({ accessToken });
    await axios.put(nomenclaturesUri, data);
}

const postSynonym = async ({ data, accessToken }) => {
    const synonymsUri = template.parse(config.uris.synonymsUri.baseUri).expand({ accessToken });
    await axios.post(synonymsUri, data);
}

const deleteSynonym = async ({ id, accessToken }) => {
    const synonymsByIdUri = template.parse(config.uris.synonymsUri.synonymsByIdUri).expand({ id, accessToken });
    await axios.delete(synonymsByIdUri);
}

export default {
    getSpeciesRecordByIdWithFilter,
    getSpeciesById,
    getAllSpecies,
    getAllSpeciesBySearchTerm,
    getSynonymsNomenclatoricOf,
    getSynonymsTaxonomicOf,
    getInvalidDesignationsOf,
    getAllSynonymsOf,
    getBasionymFor,
    getReplacedFor,
    getNomenNovumFor,
    putNomenclature,
    postSynonym,
    deleteSynonym
};

