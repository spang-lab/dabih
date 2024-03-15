'use client';

import { useEffect, useState } from 'react';
import api from '../api';

export default function useInfo() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    (async () => {
      const result = await api.info();
      if (result.error) {
        return;
      }
      setInfo(result);
    })();
  }, []);
  return { info };
}
