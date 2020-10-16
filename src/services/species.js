import config from 'config/config';

import axios from './axios';
import Mustache from './mustache';

const getSpeciesRecordByIdWithFilter = async ({ id, accessToken }) => {
  const getByIdUri = Mustache
    .render(config.uris.nomenclaturesUri.getByIdWFilterUri, {
      id,
      accessToken,
    });
  const response = await axios.get(getByIdUri);
  return response.data;
};

const getSpeciesById = async ({ id, accessToken }) => {
  const getByIdUri = Mustache
    .render(config.uris.nomenclaturesUri.getByIdUri, { id, accessToken });
  const response = await axios.get(getByIdUri);
  return response.data;
};

const getAllSpecies = async ({ accessToken }) => {
  const getAllListOfSpeciesUri = Mustache
    .render(config.uris.nomenclaturesUri.getAllWOrderUri, { accessToken });
  const response = await axios.get(getAllListOfSpeciesUri);
  return response.data;
};

const getAllSpeciesBySearchTerm = async ({ term, accessToken }) => {
  const getAllBySearchTermUri = Mustache
    .render(config.uris.nomenclaturesUri.getAllBySearchTermUri, {
      term,
      accessToken,
    });
  const response = await axios.get(getAllBySearchTermUri);
  return response.data;
};

/**
 * The result is ordered by id, the sorting from uri is not taken into account
 * @param {*} id
 */
const getSynonymsNomenclatoricOf = async ({ id, accessToken }) => {
  const getSynonymsNomenclatoricUri = Mustache
    .render(config.uris.nomenclaturesUri.getNomenclatoricSynonymsUri, {
      id,
      accessToken,
    });
  const response = await axios.get(getSynonymsNomenclatoricUri);
  return response.data;
};

// same
const getSynonymsTaxonomicOf = async ({ id, accessToken }) => {
  const getSynonymsTaxonomicUri = Mustache
    .render(config.uris.nomenclaturesUri.getTaxonomicSynonymsUri, {
      id,
      accessToken,
    });
  const response = await axios.get(getSynonymsTaxonomicUri);
  return response.data;
};

// same
const getInvalidDesignationsOf = async ({ id, accessToken }) => {
  const getInvalidDesignationsUri = Mustache
    .render(config.uris.nomenclaturesUri.getInvalidSynonymsUri, {
      id,
      accessToken,
    });
  const response = await axios.get(getInvalidDesignationsUri);
  return response.data;
};

const getAllSynonymsOf = async ({ id, accessToken }) => {
  const getParentOfSynonymsUri = Mustache
    .render(config.uris.nomenclaturesUri.getSynonymsOfParent, {
      id,
      accessToken,
    });
  const response = await axios.get(getParentOfSynonymsUri);
  return response.data;
};

const getBasionymFor = async ({ id, accessToken }) => {
  const getBasionymForUri = Mustache
    .render(config.uris.nomenclaturesUri.getBasionymForUri, {
      id,
      accessToken,
    });
  const response = await axios.get(getBasionymForUri);
  return response.data;
};

const getReplacedFor = async ({ id, accessToken }) => {
  const getReplacedForUri = Mustache
    .render(config.uris.nomenclaturesUri.getReplacedForUri, {
      id,
      accessToken,
    });
  const response = await axios.get(getReplacedForUri);
  return response.data;
};

const getNomenNovumFor = async ({ id, accessToken }) => {
  const getNomenNovumForUri = Mustache
    .render(config.uris.nomenclaturesUri.getNomenNovumForUri, {
      id,
      accessToken,
    });
  const response = await axios.get(getNomenNovumForUri);
  return response.data;
};

const putNomenclature = async ({ data, accessToken }) => {
  const nomenclaturesUri = Mustache
    .render(config.uris.nomenclaturesUri.baseUri, { accessToken });
  await axios.put(nomenclaturesUri, data);
};

const postSynonym = async ({ data, accessToken }) => {
  const synonymsUri = Mustache
    .render(config.uris.synonymsUri.baseUri, { accessToken });
  await axios.post(synonymsUri, data);
};

const deleteSynonym = async ({ id, accessToken }) => {
  const synonymsByIdUri = Mustache
    .render(config.uris.synonymsUri.synonymsByIdUri, { id, accessToken });
  await axios.delete(synonymsByIdUri);
};

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
  deleteSynonym,
};
