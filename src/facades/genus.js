import { getRequest, putRequest } from 'services/backend';

import config from 'config/config';

const {
  uris: { generaUri },
} = config;

async function getAllGeneraBySearchTerm(term, accessToken, format = undefined) {
  const genera = await getRequest(
    generaUri.getAllBySearchTermUri, { term }, accessToken,
  );
  if (!format) {
    return genera;
  }
  return genera.map(format);
}

async function getAllGeneraWithFamilies(accessToken, format = undefined) {
  const genera = await getRequest(
    generaUri.getAllWithFamiliesUri, {}, accessToken,
  );
  if (!format) {
    return genera;
  }
  return genera.map(format);
}

async function getGenusByIdWithFamilies(id, accessToken, format = undefined) {
  const genus = await getRequest(
    generaUri.getByIdWithFamilies, { id }, accessToken,
  );
  const { family, 'family-apg': familyApg } = genus;

  delete genus.family;
  delete genus['family-apg'];

  let toReturn = genus;
  if (format) {
    toReturn = format(genus);
  }

  return { genus: toReturn, family, familyApg };
}

async function saveGenus(data, accessToken) {
  return putRequest(generaUri.baseUri, data, undefined, accessToken);
}

export default {
  getAllGeneraBySearchTerm,
  getAllGeneraWithFamilies,
  getGenusByIdWithFamilies,
  saveGenus,
};
