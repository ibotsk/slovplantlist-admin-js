import axios from './axios';
import Mustache from './mustache';

const getAll = async (uri, offset, where, order, limit, accessToken) => {
  const getAllUri = Mustache.render(uri, {
    offset,
    where: JSON.stringify(where),
    order: JSON.stringify(order),
    limit,
    accessToken,
  });
  const response = await axios.get(getAllUri);
  return response.data;
};

const getCount = async (uri, whereString, accessToken) => {
  const getCountUri = Mustache.render(uri, { whereString, accessToken });
  const response = await axios.get(getCountUri);
  return response.data;
};

export default {
  getAll,
  getCount,
};
