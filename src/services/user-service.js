import config from 'config/config';

import axios from './axios';
import Mustache from './mustache';

const login = async (username, password) => {
  const loginUri = Mustache.render(config.uris.usersUri.loginUri, {});

  const response = await axios.post(loginUri, {
    username,
    password,
  });
  return response.data;
};

const logout = async (accessToken) => {
  const logoutUri = Mustache
    .render(config.uris.usersUri.logoutUri, { accessToken });
  await axios.post(logoutUri);
};

const getAll = async ({ accessToken }) => {
  const getAllUri = Mustache
    .render(config.uris.usersUri.getAllWOrderUri, { accessToken });
  const response = await axios.get(getAllUri);
  return response.data;
};

const getByIdWithRoles = async ({ id, accessToken }) => {
  const getByIdUri = Mustache
    .render(config.uris.usersUri.getByIdWithRolesUri, { id, accessToken });
  const response = await axios.get(getByIdUri);
  return response.data;
};

const getGeneraByUserId = async ({ id, accessToken }) => {
  const getByIdUri = Mustache
    .render(config.uris.usersUri.getGeneraByUserId, { id, accessToken });
  const response = await axios.get(getByIdUri);
  return response.data;
};

const createUser = async ({ data, accessToken }) => {
  const usersUri = Mustache
    .render(config.uris.usersUri.baseUri, { accessToken });
  const response = await axios.post(usersUri, data);
  return response.data.id;
};

const updateUser = async ({ id, data, accessToken }) => {
  const usersUri = Mustache
    .render(config.uris.usersUri.updateByIdUri, { id, accessToken });
  await axios.post(usersUri, data);
};

export default {
  login,
  logout,
  getAll,
  getByIdWithRoles,
  getGeneraByUserId,
  createUser,
  updateUser,
};
