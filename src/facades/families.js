import { getRequest, putRequest } from 'services/backend';
import { miscUtils } from 'utils';

import config from 'config/config';

const {
  uris: { familiesUri, familiesApgUri },
} = config;

async function getAllBySearchTerm(
  uri, term, accessToken, format = undefined,
) {
  const data = await getRequest(
    uri, { term }, accessToken,
  );
  if (!format) {
    return data;
  }
  return data.map(format);
}

// ----------------------------------- //

async function getFamilyByIdCurated(id, accessToken) {
  const data = await getRequest(familiesUri.getByIdUri, { id }, accessToken);
  return miscUtils.nullToEmpty(data);
}

async function getAllFamilies(accessToken, format = undefined) {
  const data = await getRequest(familiesUri.getAllWOrderUri, {}, accessToken);
  if (!format) {
    return data;
  }
  return data.map(format);
}

async function getAllFamiliesBySearchTerm(
  term, accessToken, format = undefined,
) {
  return getAllBySearchTerm(
    familiesUri.getAllBySearchTermUri, term, accessToken, format,
  );
}

async function getFamilyApgByIdCurated(id, accessToken) {
  const data = await getRequest(familiesApgUri.getByIdUri, { id }, accessToken);
  return miscUtils.nullToEmpty(data);
}

async function getAllFamiliesApg(accessToken, format = undefined) {
  const data = await getRequest(
    familiesApgUri.getAllWOrderUri, {}, accessToken,
  );
  if (!format) {
    return data;
  }
  return data.map(format);
}

async function getAllFamiliesApgBySearchTerm(
  term, accessToken, format = undefined,
) {
  return getAllBySearchTerm(
    familiesApgUri.getAllBySearchTermUri, term, accessToken, format,
  );
}

async function saveFamily(data, accessToken) {
  return putRequest(familiesUri.baseUri, data, undefined, accessToken);
}

async function saveFamilyApg(data, accessToken) {
  return putRequest(familiesApgUri.baseUri, data, undefined, accessToken);
}

export default {
  getFamilyByIdCurated,
  getAllFamilies,
  getAllFamiliesBySearchTerm,
  getFamilyApgByIdCurated,
  getAllFamiliesApg,
  getAllFamiliesApgBySearchTerm,
  saveFamily,
  saveFamilyApg,
};
