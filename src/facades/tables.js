import { getRequest } from 'services/backend';

const getAll = async (uri, offset, where, order, limit, accessToken) => {
  const params = {
    offset,
    where: JSON.stringify(where),
    order: JSON.stringify(order),
    limit,
  };
  return getRequest(uri, params, accessToken);
};

const getCount = async (uri, whereString, accessToken) => (
  getRequest(uri, { whereString }, accessToken)
);

export default {
  getAll,
  getCount,
};
