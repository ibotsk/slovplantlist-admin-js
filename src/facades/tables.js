import { getRequest } from 'services/backend';

async function getAll(
  uri, offset, whereString = '{}', orderString = '["id ASC"]', limit, accessToken,
) {
  const params = {
    offset,
    where: whereString,
    order: orderString,
    limit,
  };
  return getRequest(uri, params, accessToken);
}

async function getCount(uri, whereString, accessToken) {
  const { count } = await getRequest(uri, { whereString }, accessToken);
  return count;
}

export default {
  getAll,
  getCount,
};
