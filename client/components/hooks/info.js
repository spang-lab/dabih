'use client';

import { useCallback, useEffect, useState } from 'react';
import { useApi } from '../api';

export default function useInfo() {
  const api = useApi();
  const [info, setInfo] = useState(null);

  const fetchInfo = useCallback(async () => {
    const result = await api.info();
    if (result.error) {
      return;
    }
    setInfo(result);
  }, [api]);

  useEffect(() => {
    fetchInfo();
  }, [fetchInfo]);
  return { info };
}
