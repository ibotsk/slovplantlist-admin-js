/* eslint-disable max-len */
const backendBase = `${process.env.REACT_APP_BACKEND_BASE}:${process.env.REACT_APP_BACKEND_PORT}`;

export default {
  nomenclaturesUri: {
    baseUri: `${backendBase}/api/nomenclatures?access_token={accessToken}`,
    getAllWOrderUri: `${backendBase}/api/nomenclatures?access_token={accessToken}&filter=%7B"order":["genus","species","subsp","var","subvar","forma","authors","id"]%7D`,
    getAllBySearchTermUri: `${backendBase}/api/nomenclatures?access_token={accessToken}&filter=%7B"where":%7B"or":[
      %7B"genus":%7B
          "like": "%25{term}%25"
      %7D%7D,
      %7B"species":%7B
          "like": "%25{term}%25"
      %7D%7D,
      %7B"subsp":%7B
          "like": "%25{term}%25"
      %7D%7D,
      %7B"var":%7B
          "like": "%25{term}%25"
      %7D%7D,
      %7B"subvar":%7B
          "like": "%25{term}%25"
      %7D%7D,
      %7B"forma":%7B
          "like": "%25{term}%25"
      %7D%7D,
      %7B"authors":%7B
          "like": "%25{term}%25"
      %7D%7D,
      %7B"genus_h":%7B
          "like": "%25{term}%25"
      %7D%7D,
      %7B"species_h":%7B
          "like": "%25{term}%25"
      %7D%7D,
      %7B"subsp_h":%7B
          "like": "%25{term}%25"
      %7D%7D,
      %7B"var_h":%7B
          "like": "%25{term}%25"
      %7D%7D,
      %7B"subvar_h":%7B
          "like": "%25{term}%25"
      %7D%7D,
      %7B"forma_h":%7B
          "like": "%25{term}%25"
      %7D%7D,
      %7B"authors_h":%7B
          "like": "%25{term}%25"
      %7D%7D
    ]%7D%7D`,
    getByIdUri: `${backendBase}/api/nomenclatures/{id}?access_token={accessToken}`,
    getByIdWFilterUri: `${backendBase}/api/nomenclatures/{id}?access_token={accessToken}&filter=%7B"include":["accepted","basionym","replaced","nomenNovum",%7B"genusRel":["family","familyApg"]%7D]%7D`,
    getNomenclatoricSynonymsUri: `${backendBase}/api/nomenclatures/{id}/synonymsNomenclatoric?access_token={accessToken}&filter=%7B"include":"synonymsNomenclatoric"%7D`,
    getTaxonomicSynonymsUri: `${backendBase}/api/nomenclatures/{id}/synonymsTaxonomic?access_token={accessToken}&filter=%7B"include":"synonymsNomenclatoric"%7D`,
    getInvalidSynonymsUri: `${backendBase}/api/nomenclatures/{id}/synonymsInvalid?access_token={accessToken}`,
    getSynonymsOfParent: `${backendBase}/api/nomenclatures/{id}/parentOfSynonyms?access_token={accessToken}`,
    getBasionymForUri: `${backendBase}/api/nomenclatures/{id}/basionymFor?access_token={accessToken}`,
    getReplacedForUri: `${backendBase}/api/nomenclatures/{id}/replacedFor?access_token={accessToken}`,
    getNomenNovumForUri: `${backendBase}/api/nomenclatures/{id}/nomenNovumFor?access_token={accessToken}`,
    countUri: `${backendBase}/api/nomenclatures/count?access_token={accessToken}&where={whereString}`,
  },
  nomenclatureOwnersUri: {
    getAllWFilterUri: `${backendBase}/api/nomenclature-owners?access_token={accessToken}&filter=%7B"offset":{offset},"where":{where},"limit":{limit},"include":"accepted","order":{order}%7D`,
    countUri: `${backendBase}/api/nomenclature-owners/count?access_token={accessToken}&where={whereString}`,
  },
  generaUri: {
    baseUri: `${backendBase}/api/genera?access_token={accessToken}`,
    getAllWFilterUri: `${backendBase}/api/genera?access_token={accessToken}&filter=%7B"offset":{offset},"where":{where},"limit":{limit},"include":["familyApg","family"],"order":{order}%7D`,
    getAllBySearchTermUri: `${backendBase}/api/genera?access_token={accessToken}&filter=%7B"where":
                %7B"name":%7B
                    "like": "%25{term}%25"
                %7D%7D
            %7D`,
    getAllWithFamiliesUri: `${backendBase}/api/genera?access_token={accessToken}&filter=%7B"include":["familyApg","family"]%7D`,
    getByIdWithFamilies: `${backendBase}/api/genera/{id}?access_token={accessToken}&filter=%7B"include":["familyApg","family"]%7D`,
    countUri: `${backendBase}/api/genera/count?access_token={accessToken}&where={whereString}`,
  },
  familiesApgUri: {
    baseUri: `${backendBase}/api/family_apgs?access_token={accessToken}`,
    getByIdUri: `${backendBase}/api/family_apgs/{id}?access_token={accessToken}`,
    getAllWOrderUri: `${backendBase}/api/family_apgs?access_token={accessToken}&filter=%7B"order":["name","id"]%7D`,
    countUri: `${backendBase}/api/family_apgs/count?access_token={accessToken}&where={whereString}`,
  },
  familiesUri: {
    baseUri: `${backendBase}/api/families?access_token={accessToken}`,
    getByIdUri: `${backendBase}/api/families/{id}?access_token={accessToken}`,
    getAllWOrderUri: `${backendBase}/api/families?access_token={accessToken}&filter=%7B"order":["name","id"]%7D`,
    countUri: `${backendBase}/api/families/count?access_token={accessToken}&where={whereString}`,
  },
  synonymsUri: {
    baseUri: `${backendBase}/api/synonyms?access_token={accessToken}`,
    synonymsByIdUri: `${backendBase}/api/synonyms/{id}?access_token={accessToken}`,
  },
  usersUri: {
    loginUri: `${backendBase}/api/user_lbs/login`,
    logoutUri: `${backendBase}/api/user_lbs/logout?access_token={accessToken}`,
    baseUri: `${backendBase}/api/user_lbs?access_token={accessToken}`,
    getByIdWithRolesUri: `${backendBase}/api/user_lbs/{id}?access_token={accessToken}&filter=%7B"include":"roles"%7D`,
    getGeneraByUserId: `${backendBase}/api/user_lbs/{id}/genera?access_token={accessToken}`,
    getAllWOrderUri: `${backendBase}/api/user_lbs?access_token={accessToken}&filter=%7B"include":"roles","order":["username"]%7D`,
    getAllWGeneraUri: `${backendBase}/api/user_lbs?access_token={accessToken}&filter=%7B"include":%7B"genera":["family","familyApg"]%7D,"order":["username"]%7D`,
    updateByIdUri: `${backendBase}/api/user_lbs/update?access_token={accessToken}&where=%7B"id":"{id}"%7D`,
    countUri: `${backendBase}/api/user_lbs/count?access_token={accessToken}&where={whereString}`,
  },
  userGeneraUri: {
    baseUri: `${backendBase}/api/users_generas?access_token={accessToken}`,
    getAllByUserAndGenusUri: `${backendBase}/api/users_generas?filter=%7B"where":%7B"and":[%7B"id_user":{userId}%7D,%7B"id_genus":{genusId}%7D]%7D%7D&access_token={accessToken}`,
    deleteUri: `${backendBase}/api/users_generas/{id}?access_token={accessToken}`,
  },
  rolesUri: {
    getAllWOrderUri: `${backendBase}/api/roles?access_token={accessToken}&filter=%7B"order":["id"]%7D`,
  },
  roleMappingsUri: {
    baseUri: `${backendBase}/api/role_mappings?access_token={accessToken}`,
    getByPrincipalIdUri: `${backendBase}/api/role_mappings?access_token={accessToken}&filter=%7B"where":%7B"principalId":"{principalId}"%7D%7D`,
  },
};