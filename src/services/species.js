import template from 'url-template';
import axiosModule from './axios';

import config from '../config/config';

export default (accessToken) => {

    const axios = axiosModule(accessToken);

    const getSpeciesRecordByIdWithFilter = async id => {
        const getByIdUri = template.parse(config.uris.nomenclaturesUri.getByIdWFilterUri).expand({ id });
        const response = await axios.get(getByIdUri);
        return response.data;
    }

    const getSpeciesById = async ({ id }) => {
        const getByIdUri = template.parse(config.uris.nomenclaturesUri.getByIdUri).expand({ id });
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
     */
    const getSynonymsNomenclatoricOf = async ({ id }) => {
        const getSynonymsNomenclatoricUri = template.parse(config.uris.nomenclaturesUri.getNomenclatoricSynonymsUri).expand({ id });
        const response = await axios.get(getSynonymsNomenclatoricUri);
        return response.data;
    }

    // same
    const getSynonymsTaxonomicOf = async ({ id }) => {
        const getSynonymsTaxonomicUri = template.parse(config.uris.nomenclaturesUri.getTaxonomicSynonymsUri).expand({ id });
        const response = await axios.get(getSynonymsTaxonomicUri);
        return response.data;
    }

    //same
    const getInvalidDesignationsOf = async ({ id }) => {
        const getInvalidDesignationsUri = template.parse(config.uris.nomenclaturesUri.getInvalidSynonymsUri).expand({ id });
        const response = await axios.get(getInvalidDesignationsUri);
        return response.data;
    }

    const getAllSynonymsOf = async ({ id }) => {
        const getParentOfSynonymsUri = template.parse(config.uris.nomenclaturesUri.getSynonymsOfParent).expand({ id });
        const response = await axios.get(getParentOfSynonymsUri);
        return response.data;
    }

    const getBasionymFor = async ({ id }) => {
        const getBasionymForUri = template.parse(config.uris.nomenclaturesUri.getBasionymForUri).expand({ id });
        const response = await axios.get(getBasionymForUri);
        return response.data;
    }

    const getReplacedFor = async ({ id }) => {
        const getReplacedForUri = template.parse(config.uris.nomenclaturesUri.getReplacedForUri).expand({ id });
        const response = await axios.get(getReplacedForUri);
        return response.data;
    }

    const getNomenNovumFor = async ({ id }) => {
        const getNomenNovumForUri = template.parse(config.uris.nomenclaturesUri.getNomenNovumForUri).expand({ id });
        const response = await axios.get(getNomenNovumForUri);
        return response.data;
    }

    const putNomenclature = async ({ data }) => {
        const nomenclaturesUri = template.parse(config.uris.nomenclaturesUri.baseUri).expand();
        await axios.put(nomenclaturesUri, data);
    }

    const postSynonym = async ({ data }) => {
        const synonymsUri = template.parse(config.uris.synonymsUri.baseUri).expand();
        await axios.post(synonymsUri, data);
    }

    const deleteSynonym = async ({ id }) => {
        const synonymsByIdUri = template.parse(config.uris.synonymsUri.synonymsByIdUri).expand({ id });
        await axios.delete(synonymsByIdUri);
    }

    return {
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
}
