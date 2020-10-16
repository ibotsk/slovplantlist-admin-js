import { getRequest, putRequest } from 'services/services';

import config from 'config/config';

const {
  uris: { generaUri },
} = config;

const getAllGeneraBySearchTerm = async ({ term, format, accessToken }) => {
  const genera = await getRequest(
    generaUri.getAllBySearchTermUri, { term }, accessToken,
  );
  if (!format) {
    return genera;
  }
  return genera.map(format);
};

const getAllGeneraWithFamilies = async ({ format, accessToken }) => {
  const genera = await getRequest(
    generaUri.getAllWithFamiliesUri, {}, accessToken,
  );
  if (!format) {
    return genera;
  }
  return genera.map(format);
};

const getGenusByIdWithFamilies = async ({ id, format, accessToken }) => {
  const genus = await getRequest(
    generaUri.getByIdWithFamilies, { id }, accessToken,
  );
  const { family } = genus;
  const { familyApg } = genus;

  delete genus.family;
  delete genus.familyApg;

  let toReturn = genus;
  if (format) {
    toReturn = format(genus);
  }

  return { genus: toReturn, family, familyApg };
};

const saveGenus = async ({ data, accessToken }) => (
  putRequest(generaUri.baseUri, data, accessToken)
);

export default {
  getAllGeneraBySearchTerm,
  getAllGeneraWithFamilies,
  getGenusByIdWithFamilies,
  saveGenus,
};
