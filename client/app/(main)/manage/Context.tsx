import { createContext } from 'react';

type Dataset = {
  mnemonic: string
};

type SearchParams = {
  query?: string,
  uploader?: boolean,
  deleted: boolean,
  all: boolean,
  page: number,
  limit: number,
  column?: string,
  direction?: string,
};

const DatasetsContext = createContext(null);

export function DatasetsWrapper({ children }) {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [datasetCount, setDatasetCount] = useState<number>(0);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    deleted: false,
    all: false,
    page: 1,
    limit: 25,
  });
}
