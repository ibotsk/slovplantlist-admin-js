import { getRequest, putRequest } from 'services/services';
import { miscUtils } from 'utils';

import config from 'config/config';

const {
  uris: { familiesUri, familiesApgUri },
} = config;

const getFamilyByIdCurated = async ({ id, accessToken }) => {
  const data = await getRequest(familiesUri.getByIdUri, { id }, accessToken);
  return miscUtils.nullToEmpty(data);
};

const getAllFamilies = async ({ format, accessToken }) => {
  const data = await getRequest(familiesUri.getAllWOrderUri, {}, accessToken);
  if (!format) {
    return data;
  }
  return data.map(format);
};

const getFamilyApgByIdCurated = async ({ id, accessToken }) => {
  const data = await getRequest(familiesApgUri.getByIdUri, { id }, accessToken);
  return miscUtils.nullToEmpty(data);
};

const getAllFamiliesApg = async ({ format, accessToken }) => {
  const data = await getRequest(
    familiesApgUri.getAllWOrderUri, {}, accessToken,
  );
  if (!format) {
    return data;
  }
  return data.map(format);
};

const saveFamily = async ({ data, accessToken }) => (
  putRequest(familiesUri.baseUri, data, accessToken)
);

const saveFamilyApg = async ({ data, accessToken }) => (
  putRequest(familiesApgUri.baseUri, data, accessToken)
);

export default {
  getFamilyByIdCurated,
  getAllFamilies,
  getFamilyApgByIdCurated,
  getAllFamiliesApg,
  saveFamily,
  saveFamilyApg,
};
