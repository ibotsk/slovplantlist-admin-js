import config from 'config/config';

import axios from './axios';
import Mustache from './mustache';

const getAll = async ({ accessToken }) => {
  const getAllUri = Mustache
    .render(config.uris.rolesUri.getAllWOrderUri, { accessToken });
  const response = await axios.get(getAllUri);
  return response.data;
};

export default {
  getAll,
};
