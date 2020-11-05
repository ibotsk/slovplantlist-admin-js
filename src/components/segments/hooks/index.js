import { useEffect, useState } from 'react';

import { tablesFacade } from 'facades';

function useTableData(
  countUri, getAllUri, accessToken, whereString, offset, limit,
  orderString, forceChange,
) {
  const [isLoading, setLoading] = useState(false);
  const [totalSize, setTotalSize] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const size = await tablesFacade.getCount(
        countUri, whereString, accessToken,
      );

      const lim = limit || size; // use all records if limit is undefined
      const records = await tablesFacade.getAll(
        getAllUri, offset, whereString, orderString, lim, accessToken,
      );

      setTotalSize(size);
      setData(records);
      setLoading(false);
    };

    fetch();
  },
  [countUri, getAllUri, accessToken, whereString,
    offset, limit, orderString, forceChange]);

  return {
    data,
    totalSize,
    isLoading,
  };
}

export default {
  useTableData,
};
