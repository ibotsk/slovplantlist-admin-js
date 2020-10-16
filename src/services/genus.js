import config from 'config/config';

import axios from './axios';
import Mustache from './mustache';

const getAllGeneraBySearchTerm = async ({ term, accessToken }) => {
  const getAllBySearchTermUri = Mustache
    .render(config.uris.generaUri.getAllBySearchTermUri, { term, accessToken });
  const response = await axios.get(getAllBySearchTermUri);
  return response.data;
};

const getAllGeneraWithFamilies = async ({ accessToken }) => {
  const getAllWithFamilies = Mustache
    .render(config.uris.generaUri.getAllWithFamiliesUri, { accessToken });
  const response = await axios.get(getAllWithFamilies);
  return response.data;
};

const getGenusByIdWithFamilies = async ({ id, accessToken }) => {
  const getByIdWithFamiliesUri = Mustache
    .render(config.uris.generaUri.getByIdWithFamilies, { id, accessToken });
  const response = await axios.get(getByIdWithFamiliesUri);
  return response.data;
};

const putGenus = async ({ data, accessToken }) => {
  const generaUri = Mustache
    .render(config.uris.generaUri.baseUri, { accessToken });
  await axios.put(generaUri, data);
};

export default {
  getAllGeneraBySearchTerm,
  getAllGeneraWithFamilies,
  getGenusByIdWithFamilies,
  putGenus,
};
