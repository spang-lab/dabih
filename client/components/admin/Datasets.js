import React, { useEffect, useState, useCallback } from 'react';
import { useAdminApi } from '../api';

import Dataset from './Dataset';
import { useMessages } from '../messages';

export default function PublicKeys() {
  const api = useAdminApi();
  const log = useMessages();
  const [datasets, setDatasets] = useState([]);

  const getDatasets = useCallback(async () => {
    if (!api.isReady()) {
      return;
    }
    const data = await api.listDatasets();
    if (data.error) {
      return;
    }
    setDatasets(data);
  }, [api]);

  const onAction = async (action, mnemonic) => {
    switch (action) {
      case 'delete':
        await api.deleteDataset(mnemonic);
        break;
      case 'destroy':
        await api.destroyDataset(mnemonic);
        break;
      case 'recover':
        await api.recoverDataset(mnemonic);
        break;
      default:
        log.error(`Unknown action ${action}`);
        return;
    }
    await getDatasets();
  };

  useEffect(() => {
    getDatasets();
  }, [getDatasets]);

  return (
    <div>
      <h3 className="text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">
        Datasets
      </h3>
      {datasets.map((dset) => (
        <Dataset key={dset.mnemonic} data={dset} onAction={onAction} />
      ))}
    </div>
  );
}
