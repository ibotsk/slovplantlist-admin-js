import { getRequest, putRequest, patchRequest } from 'services/backend';

import config from 'config/config';
import { sorterUtils } from 'utils';

import common from './common/common';

const {
  uris: {
    generaUri,
    synonymsGeneraUri,
  },
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

async function getGenusById(id, accessToken) {
  return getRequest(
    generaUri.byIdUri, { id }, accessToken,
  );
}

async function getGenusByIdWithRelations(id, accessToken, format = undefined) {
  const genus = await getRequest(
    generaUri.getByIdWRelations, { id }, accessToken,
  );
  const {
    family,
    'family-apg': familyApg,
    synonyms,
  } = genus;

  delete genus.family;
  delete genus['family-apg'];
  delete genus.synonyms;

  let toReturn = genus;
  if (format) {
    toReturn = format(genus);
  }

  synonyms.sort(sorterUtils.generaSynonymSorterLex);

  return {
    genus: toReturn,
    family,
    familyApg,
    synonyms,
  };
}

async function saveGenus(data, accessToken) {
  return putRequest(generaUri.baseUri, data, undefined, accessToken);
}

async function saveGenusAndSynonyms(genus, synonyms, accessToken) {
  return Promise.all([
    saveGenus(genus, accessToken),
    common.submitSynonyms(genus.id, synonyms, {
      getCurrentSynonymsUri: generaUri.getSynonymsOfParent,
      deleteSynonymsByIdUri: synonymsGeneraUri.synonymsByIdUri,
      updateSynonymsUri: synonymsGeneraUri.baseUri,
      patchSynonymRefUri: generaUri.byIdUri,
    }, accessToken),
  ]);
}

async function patchGenus(id, dataField, newValue, accessToken) {
  const data = {
    [dataField]: newValue,
  };
  return patchRequest(generaUri.byIdUri, data, { id }, accessToken);
}

function createSynonym(idParent, idSynonym, syntype) {
  return {
    idParent: parseInt(idParent, 10),
    idSynonym: parseInt(idSynonym, 10),
    syntype,
  };
}

export default {
  getAllGeneraBySearchTerm,
  getAllGeneraWithFamilies,
  getGenusById,
  getGenusByIdWithRelations,
  saveGenus,
  saveGenusAndSynonyms,
  patchGenus,
  createSynonym,
};
