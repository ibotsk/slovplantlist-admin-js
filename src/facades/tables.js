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

async function getCount(uri, where, accessToken) {
  const whereString = JSON.stringify(where);
  const { count } = await getRequest(uri, { whereString }, accessToken);
  return count;
}

export default {
  getAll,
  getCount,
};
