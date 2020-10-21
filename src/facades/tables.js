import { getRequest } from 'services/backend';

async function getAll(uri, offset, where, order, limit, accessToken) {
  const params = {
    offset,
    where: JSON.stringify(where),
    order: JSON.stringify(order),
    limit,
  };
  return getRequest(uri, params, accessToken);
}

async function getCount(uri, whereString, accessToken) {
  return getRequest(uri, { whereString }, accessToken);
}

export default {
  getAll,
  getCount,
};
