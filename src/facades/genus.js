import { getRequest, putRequest, patchRequest } from 'services/backend';

import config from 'config/config';
import { sorterUtils } from 'utils';

import common from './common/common';

const {
  uris: {
    generaUri,
    synonymsGeneraUri,
  },
  mappings: { synonym: synonymConfig },
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

async function getAllGeneraBySearchTermWithAccepted(
  term, accessToken, format = undefined,
) {
  const genera = await getRequest(
    generaUri.getAllBySearchTermWithAcceptedUri, { term }, accessToken,
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
    accepted,
    family,
    'family-apg': familyApg,
    synonyms,
  } = genus;

  delete genus.accepted;
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
    accepted,
    family,
    familyApg,
    synonyms,
  };
}

async function saveGenus(data, accessToken) {
  return putRequest(generaUri.baseUri, data, undefined, accessToken);
}

/**
 *
 * @param {*} genus
 * @param {*} synonyms
 * @param {*} accessToken
 * @param {boolean} isManageAcceptedNames if true, change of accepted name also updates synonyms relations
 */
async function saveGenusAndSynonyms(
  genus, synonyms, accessToken, isManageAcceptedNames = false,
) {
  const promises = [
    saveGenus(genus, accessToken),
    common.submitSynonyms(
      genus.id,
      synonyms,
      {
        getCurrentSynonymsUri: generaUri.getSynonymsOfParent,
        deleteSynonymsByIdUri: synonymsGeneraUri.synonymsByIdUri,
        updateSynonymsUri: synonymsGeneraUri.baseUri,
        patchSynonymRefUri: generaUri.byIdUri,
      },
      accessToken,
      isManageAcceptedNames,
    ),
  ];
  if (isManageAcceptedNames) {
    const mngAcceptedNamePromise = common.manageAcceptedNameRelations(
      genus.id,
      genus.idAcceptedName,
      synonymConfig.taxonomic.numType,
      {
        getSynonymsByIdSynonymUri: synonymsGeneraUri.synonymsByIdSynonymUri,
        upsertSynonymsUri: synonymsGeneraUri.baseUri,
        deleteSynonymUri: synonymsGeneraUri.synonymsByIdUri,
      },
      accessToken,
    );
    promises.push(mngAcceptedNamePromise);
  }
  return Promise.all(promises);
}

async function patchGenus(id, dataField, newValue, accessToken) {
  const data = {
    [dataField]: newValue,
  };
  return patchRequest(generaUri.byIdUri, data, { id }, accessToken);
}

function createSynonym(idParent, idSynonym, syntype) {
  return common.createSynonym(idParent, idSynonym, syntype);
}

export default {
  getAllGeneraBySearchTerm,
  getAllGeneraBySearchTermWithAccepted,
  getAllGeneraWithFamilies,
  getGenusById,
  getGenusByIdWithRelations,
  saveGenus,
  saveGenusAndSynonyms,
  patchGenus,
  createSynonym,
};
