import config from 'config/config';

import axios from './axios';
import Mustache from './mustache';

const getRoleMappingByUser = async ({ userId, accessToken }) => {
  const getByPrincipalIdUri = Mustache
    .render(config.uris.roleMappingsUri.getByPrincipalIdUri, {
      principalId: userId,
      accessToken,
    });
  const response = await axios.get(getByPrincipalIdUri);
  return response.data;
};

const putRoleMapping = async ({ data, accessToken }) => {
  const roleMappingsUri = Mustache
    .render(config.uris.roleMappingsUri.baseUri, { accessToken });
  await axios.put(roleMappingsUri, data);
};

export default {
  getRoleMappingByUser,
  putRoleMapping,
};
