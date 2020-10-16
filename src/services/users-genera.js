import config from 'config/config';

import axios from './axios';
import Mustache from './mustache';

const getUserGeneraByUserIdAndGenusId = async ({
  userId, genusId, accessToken,
}) => {
  const uri = Mustache
    .render(config.uris.userGeneraUri.getAllByUserAndGenusUri, {
      userId,
      genusId,
      accessToken,
    });
  const result = await axios.get(uri);
  return result.data;
};

const putUserGenus = async ({ data, accessToken }) => {
  const usersGeneraUri = Mustache
    .render(config.uris.userGeneraUri.baseUri, { accessToken });
  await axios.put(usersGeneraUri, data);
};

const deleteUserGenus = async ({ id, accessToken }) => {
  const deleteUri = Mustache
    .render(config.uris.userGeneraUri.deleteUri, { id, accessToken });
  await axios.delete(deleteUri);
};

export default {
  getUserGeneraByUserIdAndGenusId,
  putUserGenus,
  deleteUserGenus,
};
