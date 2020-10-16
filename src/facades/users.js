import { getRequest, postRequest } from 'services/services';

import config from 'config/config';

const {
  uris: { usersUri },
} = config;

const getAllUsers = async ({ accessToken }) => (
  getRequest(usersUri.getAllWOrderUri, {}, accessToken)
);

const getUserById = async ({ id, accessToken }) => {
  const user = await getRequest(
    usersUri.getByIdWithRolesUri, { id }, accessToken,
  );
  user.password = '';
  const { roles } = user;

  delete user.roles;

  return {
    user,
    roles,
  };
};

const getGeneraOfUser = async ({ userId, accessToken, format }) => {
  const genera = await getRequest(
    usersUri.getGeneraByUserId, { id: userId }, accessToken,
  );

  if (!format) {
    return genera;
  }
  return genera.map(format);
};

const saveUser = async ({ data, accessToken }) => {
  const user = {
    ...data,
    realm: config.constants.userRealm,
  };
  if (data.id) {
    if (!user.password) { // when editing, password is set to empty, unless set new
      delete user.password;
    }
    await postRequest(
      usersUri.updateByIdUri, user, { id: user.id }, accessToken,
    );
    return user.id;
  }
  return postRequest(usersUri.baseUri, data, {}, accessToken);
};

const login = async (username, password) => {
  const response = await postRequest(
    usersUri.loginUri, { username, password }, {}, undefined,
  );
  return response.data;
};

const logout = async (accessToken) => (
  postRequest(usersUri.logoutUri, undefined, undefined, accessToken)
);

export default {
  getAllUsers,
  getUserById,
  getGeneraOfUser,
  saveUser,
  login,
  logout,
};
