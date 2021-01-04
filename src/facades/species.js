import {
  getRequest,
  putRequest,
} from 'services/backend';

import { helperUtils, sorterUtils } from 'utils';
import config from 'config/config';

import common from './common/common';

const {
  uris: { nomenclaturesUri, synonymsUri },
} = config;

async function getRecordById(id, accessToken) {
  const speciesRecord = await getRequest(
    nomenclaturesUri.getByIdWFilterUri, { id }, accessToken,
  );

  const accepted = helperUtils.losToTypeaheadSelected(speciesRecord.accepted);
  const basionym = helperUtils.losToTypeaheadSelected(speciesRecord.basionym);
  const replaced = helperUtils.losToTypeaheadSelected(speciesRecord.replaced);
  const nomenNovum = helperUtils.losToTypeaheadSelected(
    speciesRecord['nomen-novum'],
  );

  const genus = [{
    id: speciesRecord['genus-rel'].id,
    label: speciesRecord['genus-rel'].name,
  }];
  const { name: familyApg } = speciesRecord['genus-rel']['family-apg'];
  const { name: family } = speciesRecord['genus-rel'].family;

  delete speciesRecord.accepted;
  delete speciesRecord.basionym;
  delete speciesRecord.replaced;
  delete speciesRecord['nomen-novum'];
  delete speciesRecord['genus-rel'];

  return {
    speciesRecord,
    accepted,
    basionym,
    replaced,
    nomenNovum,
    genus,
    familyApg,
    family,
  };
}

async function getSpeciesById(id, accessToken) {
  return getRequest(nomenclaturesUri.getByIdUri, { id }, accessToken);
}

async function getAllSpecies(accessToken, format = undefined) {
  const listOfSpeciess = await getRequest(
    nomenclaturesUri.getAllWOrderUri, {}, accessToken,
  );
  if (!format) {
    return listOfSpeciess;
  }
  return listOfSpeciess.map(format);
}

async function getAllSpeciesBySearchTerm(
  term, accessToken, format = undefined,
) {
  const listOfSpeciess = await getRequest(
    nomenclaturesUri.getAllBySearchTermUri, { term }, accessToken,
  );

  if (!format) {
    return listOfSpeciess;
  }
  return listOfSpeciess.map(format);
}

async function getSynonyms(id, accessToken) {
  const nomenclatoricSynonyms = await getRequest(
    nomenclaturesUri.getNomenclatoricSynonymsUri, { id }, accessToken,
  );
  nomenclatoricSynonyms.sort(sorterUtils.listOfSpeciesSorterLex);

  const taxonomicSynonyms = await getRequest(
    nomenclaturesUri.getTaxonomicSynonymsUri, { id }, accessToken,
  );
  taxonomicSynonyms.sort(sorterUtils.listOfSpeciesSorterLex);

  const invalidDesignations = await getRequest(
    nomenclaturesUri.getInvalidSynonymsUri, { id }, accessToken,
  );
  invalidDesignations.sort(sorterUtils.listOfSpeciesSorterLex);

  const misidentifications = await getRequest(
    nomenclaturesUri.getMisidentificationsUri, { id }, accessToken,
  );

  return {
    nomenclatoricSynonyms,
    taxonomicSynonyms,
    invalidDesignations,
    misidentifications,
  };
}

async function getBasionymsFor(id, accessToken) {
  const basionymFor = await getRequest(
    nomenclaturesUri.getBasionymForUri, { id }, accessToken,
  );
  const replacedFor = await getRequest(
    nomenclaturesUri.getReplacedForUri, { id }, accessToken,
  );
  const nomenNovumFor = await getRequest(
    nomenclaturesUri.getNomenNovumForUri, { id }, accessToken,
  );
  return {
    basionymFor,
    replacedFor,
    nomenNovumFor,
  };
}

async function saveSpecies(data, accessToken) {
  return putRequest(nomenclaturesUri.baseUri, data, undefined, accessToken);
}

async function saveSpeciesAndSynonyms({
  species,
  nomenclatoricSynonyms,
  taxonomicSynonyms,
  invalidDesignations,
  misidentifications,
  accessToken,
}) {
  const allNewSynonyms = [
    ...nomenclatoricSynonyms,
    ...taxonomicSynonyms,
    ...invalidDesignations,
    ...misidentifications,
  ];

  return Promise.all([
    saveSpecies(species, accessToken),
    common.submitSynonyms(species.id, allNewSynonyms, {
      getCurrentSynonymsUri: nomenclaturesUri.getSynonymsOfParent,
      deleteSynonymsByIdUri: synonymsUri.synonymsByIdUri,
      updateSynonymsUri: synonymsUri.baseUri,
    }, accessToken),
  ]);
}

function createSynonym(idParent, idSynonym, syntype) {
  return {
    idParent: parseInt(idParent, 10),
    idSynonym,
    syntype,
  };
}

export default {
  getRecordById,
  getSpeciesById,
  getAllSpecies,
  getAllSpeciesBySearchTerm,
  getSynonyms,
  getBasionymsFor,
  saveSpeciesAndSynonyms,
  saveSpecies,
  createSynonym,
};
