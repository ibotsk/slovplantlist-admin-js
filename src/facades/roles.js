import { getRequest, putRequest } from 'services/services';

import config from 'config/config';

const {
  uris: { rolesUri, roleMappingsUri },
} = config;

const getAllRoles = async ({ accessToken, format }) => {
  const roles = await getRequest(rolesUri.getAllWOrderUri, {}, accessToken);
  if (!format) {
    return roles;
  }
  return roles.map(format);
};

/**
 * Replaces existing role mapping or creates new.
 * User can have only one role.
 * @param {*} param0
 */
const saveRoleForUser = async ({ userId, roleId, accessToken }) => {
  const roleMappings = await getRequest(
    roleMappingsUri.getByPrincipalIdUri, { principalId: userId }, accessToken,
  );
  const roleMappingOfUser = roleMappings[0];
  const data = {
    ...roleMappingOfUser,
    principalType: config.constants.userPrincipalType,
    principalId: userId,
    roleId,
  };

  return putRequest(roleMappingsUri.baseUri, data, accessToken);
};

export default {
  getAllRoles,
  saveRoleForUser,
};
