import { useEffect, useState } from 'react';

import { tablesFacade } from 'facades';

function useTableData(
  countUri, getAllUri, accessToken, where, offset, limit, order, forceChange,
) {
  const [isFetching, setFetching] = useState(true);
  const [totalSize, setTotalSize] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const size = await tablesFacade.getCount(
        countUri, where, accessToken,
      );

      const lim = limit || size; // use all records if limit is undefined
      const records = await tablesFacade.getAll(
        getAllUri, offset, where, order, lim, accessToken,
      );

      setTotalSize(size);
      setData(records);
      setFetching(false);
    };

    fetch();
  },
  [countUri, getAllUri, accessToken, where,
    offset, limit, order, isFetching, forceChange]);

  return {
    data,
    totalSize,
    isFetching,
  };
}

export default {
  useTableData,
};
