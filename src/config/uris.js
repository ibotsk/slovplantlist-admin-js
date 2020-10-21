/* eslint-disable max-len */
const backendBase = `${process.env.REACT_APP_BACKEND_BASE}:${process.env.REACT_APP_BACKEND_PORT}`;

export default {
  nomenclaturesUri: {
    baseUri: `${backendBase}/api/nomenclatures?access_token=<%accessToken%>`,
    getAllWOrderUri: `${backendBase}/api/nomenclatures?access_token=<%accessToken%>&filter={"order":["genus","species","subsp","var","subvar","forma","authors","id"]}`,
    getAllBySearchTermUri: `${backendBase}/api/nomenclatures?access_token=<%accessToken%>&filter={"where":{
    "or":[
      {"genus":{"like":"%25<%term%>%25"}},
      {"species":{"like":"%25<%term%>%25"}},
      {"subsp":{"like":"%25<%term%>%25"}},
      {"var":{"like":"%25<%term%>%25"}},
      {"subvar":{"like":"%25<%term%>%25"}},
      {"forma":{"like":"%25<%term%>%25"}},
      {"authors":{"like":"%25<%term%>%25"}},
      {"genus_h":{"like":"%25<%term%>%25"}},
      {"species_h":{"like": "%25<%term%>%25"}},
      {"subsp_h":{"like": "%25<%term%>%25"}},
      {"var_h":{"like": "%25<%term%>%25"}},
      {"subvar_h":{"like": "%25<%term%>%25"}},
      {"forma_h":{"like": "%25<%term%>%25"}},
      {"authors_h":{"like": "%25<%term%>%25"}}
    ]}}`,
    getByIdUri: `${backendBase}/api/nomenclatures/<%id%>?access_token=<%accessToken%>`,
    getByIdWFilterUri: `${backendBase}/api/nomenclatures/<%id%>?access_token=<%accessToken%>&filter={"include":["accepted","basionym","replaced","nomenNovum",{"genusRel":["family","familyApg"]}]}`,
    getNomenclatoricSynonymsUri: `${backendBase}/api/nomenclatures/<%id%>/synonymsNomenclatoric?access_token=<%accessToken%>&filter={"include":"synonyms-nomenclatoric-through"}`,
    getTaxonomicSynonymsUri: `${backendBase}/api/nomenclatures/<%id%>/synonymsTaxonomic?access_token=<%accessToken%>&filter={"include":"synonyms-nomenclatoric-through"}`,
    getInvalidSynonymsUri: `${backendBase}/api/nomenclatures/<%id%>/synonymsInvalid?access_token=<%accessToken%>`,
    getSynonymsOfParent: `${backendBase}/api/nomenclatures/<%id%>/parentOfSynonyms?access_token=<%accessToken%>`,
    getBasionymForUri: `${backendBase}/api/nomenclatures/<%id%>/basionymFor?access_token=<%accessToken%>`,
    getReplacedForUri: `${backendBase}/api/nomenclatures/<%id%>/replacedFor?access_token=<%accessToken%>`,
    getNomenNovumForUri: `${backendBase}/api/nomenclatures/<%id%>/nomenNovumFor?access_token=<%accessToken%>`,
    countUri: `${backendBase}/api/nomenclatures/count?access_token=<%accessToken%>&where=<%&whereString%>`,
  },
  nomenclatureOwnersUri: {
    getAllWFilterUri: `${backendBase}/api/nomenclature-owners?access_token=<%accessToken%>&filter={"offset":<%offset%>,"where":<%&where%>,"limit":<%limit%>,"include":"accepted","order":<%&order%>}`,
    countUri: `${backendBase}/api/nomenclature-owners/count?access_token=<%accessToken%>&where=<%&whereString%>`,
  },
  generaUri: {
    baseUri: `${backendBase}/api/genera?access_token=<%accessToken%>`,
    getAllWFilterUri: `${backendBase}/api/genera?access_token=<%accessToken%>&filter={"offset":<%offset%>,"where":<%&where%>,"limit":<%limit%>,"include":["familyApg","family"],"order":<%&order%>}`,
    getAllBySearchTermUri: `${backendBase}/api/genera?access_token=<%accessToken%>&filter={"where":{"name":{"like":"%25<%term%>%25"}}}`,
    getAllWithFamiliesUri: `${backendBase}/api/genera?access_token=<%accessToken%>&filter={"include":["familyApg","family"]}`,
    getByIdWithFamilies: `${backendBase}/api/genera/<%id%>?access_token=<%accessToken%>&filter={"include":["familyApg","family"]}`,
    countUri: `${backendBase}/api/genera/count?access_token=<%accessToken%>&where=<%&whereString%>`,
  },
  familiesApgUri: {
    baseUri: `${backendBase}/api/family_apgs?access_token=<%accessToken%>`,
    getByIdUri: `${backendBase}/api/family_apgs/<%id%>?access_token=<%accessToken%>`,
    getAllWOrderUri: `${backendBase}/api/family_apgs?access_token=<%accessToken%>&filter={"order":["name","id"]}`,
    countUri: `${backendBase}/api/family_apgs/count?access_token=<%accessToken%>&where=<%&whereString%>`,
  },
  familiesUri: {
    baseUri: `${backendBase}/api/families?access_token=<%accessToken%>`,
    getByIdUri: `${backendBase}/api/families/<%id%>?access_token=<%accessToken%>`,
    getAllWOrderUri: `${backendBase}/api/families?access_token=<%accessToken%>&filter={"order":["name","id"]}`,
    countUri: `${backendBase}/api/families/count?access_token=<%accessToken%>&where=<%&whereString%>`,
  },
  synonymsUri: {
    baseUri: `${backendBase}/api/synonyms?access_token=<%accessToken%>`,
    synonymsByIdUri: `${backendBase}/api/synonyms/<%id%>?access_token=<%accessToken%>`,
  },
  usersUri: {
    loginUri: `${backendBase}/api/user_lbs/login`,
    logoutUri: `${backendBase}/api/user_lbs/logout?access_token=<%accessToken%>`,
    baseUri: `${backendBase}/api/user_lbs?access_token=<%accessToken%>`,
    getByIdWithRolesUri: `${backendBase}/api/user_lbs/<%id%>?access_token=<%accessToken%>&filter={"include":"roles"}`,
    getGeneraByUserId: `${backendBase}/api/user_lbs/<%id%>/genera?access_token=<%accessToken%>`,
    getAllWOrderUri: `${backendBase}/api/user_lbs?access_token=<%accessToken%>&filter={"include":"roles","order":["username"]}`,
    getAllWGeneraUri: `${backendBase}/api/user_lbs?access_token=<%accessToken%>&filter={"include":{"genera":["family","familyApg"]},"order":["username"]}`,
    updateByIdUri: `${backendBase}/api/user_lbs/update?access_token=<%accessToken%>&where={"id":"<%id%>"}`,
    countUri: `${backendBase}/api/user_lbs/count?access_token=<%accessToken%>&where=<%&whereString%>`,
  },
  userGeneraUri: {
    baseUri: `${backendBase}/api/users_generas?access_token=<%accessToken%>`,
    getAllByUserAndGenusUri: `${backendBase}/api/users_generas?filter={"where":{"and":[{"id_user":<%userId%>},{"id_genus":<%genusId%>}]}}&access_token=<%accessToken%>`,
    deleteUri: `${backendBase}/api/users_generas/<%id%>?access_token=<%accessToken%>`,
  },
  rolesUri: {
    getAllWOrderUri: `${backendBase}/api/roles?access_token=<%accessToken%>&filter={"order":["id"]}`,
  },
  roleMappingsUri: {
    baseUri: `${backendBase}/api/role_mappings?access_token=<%accessToken%>`,
    getByPrincipalIdUri: `${backendBase}/api/role_mappings?access_token=<%accessToken%>&filter={"where":{"principalId":"<%principalId%>"}}`,
  },
};
