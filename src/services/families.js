import config from 'config/config';

import axios from './axios';
import Mustache from './mustache';

const getFamilyById = async ({ id, accessToken }) => {
  const getFamilyByIdUri = Mustache
    .render(config.uris.familiesUri.getByIdUri, { id, accessToken });
  const response = await axios.get(getFamilyByIdUri);
  return response.data;
};

const getAllFamilies = async ({ accessToken }) => {
  const getAllFamiliesUri = Mustache
    .render(config.uris.familiesUri.getAllWOrderUri, { accessToken });
  const response = await axios.get(getAllFamiliesUri);
  return response.data;
};

const getFamilyApgById = async ({ id, accessToken }) => {
  const getFamilyApgByIdUri = Mustache
    .render(config.uris.familiesApgUri.getByIdUri, { id, accessToken });
  const response = await axios.get(getFamilyApgByIdUri);
  return response.data;
};

const getAllFamiliesApg = async ({ accessToken }) => {
  const getAllFamiliesApgUri = Mustache
    .render(config.uris.familiesApgUri.getAllWOrderUri, { accessToken });
  const response = await axios.get(getAllFamiliesApgUri);
  return response.data;
};

const putFamily = async ({ data, accessToken }) => {
  const familyUri = Mustache
    .render(config.uris.familiesUri.baseUri, { accessToken });
  await axios.put(familyUri, data);
};

const putFamilyApg = async ({ data, accessToken }) => {
  const familyApgUri = Mustache
    .render(config.uris.familiesApgUri.baseUri, { accessToken });
  await axios.put(familyApgUri, data);
};

export default {
  getFamilyById,
  getAllFamilies,
  getFamilyApgById,
  getAllFamiliesApg,
  putFamily,
  putFamilyApg,
};
