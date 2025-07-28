import api from '@/lib/api';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import type { DabihInfo } from './lib/api/types';

export default function Footer() {
  const [info, setInfo] = useState<DabihInfo | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      const { data } = await api.util.info();
      if (!data) {
        console.error('Failed to fetch info');
        return;
      }
      setInfo(data);
    };
    void fetchInfo();
  }, []);

  const branding = info?.branding;
  const department = branding?.department;
  const organization = branding?.organization;

  return (
    <div className="p-2 space-x-2 flex flex-row flex-wrap justify-center text-gray-400 border-t border-gray-200">
      <div>
        <Link to={department?.url ?? '#'}>{department?.name}</Link>
        {' '}
        -
        {' '}
        <Link to={organization?.url ?? '#'}>{organization?.name}</Link>
      </div>
      <div>
        ©
        {new Date().getFullYear()}
        <span className="px-2"> · </span>
        Version
        {' '}
        {info?.version}
      </div>
      <Link className="text-blue hover:underline" to="/docs/contact">
        Contact/Impressum
      </Link>
      <span className="px-2"> · </span>
      <Link className="text-blue hover:underline" to="/docs/privacy">
        Privacy Policy
      </Link>
      <span className="px-2"> · </span>
      <Link className="text-blue hover:underline" to="/docs/data">
        Data Policy
      </Link>
      <span className="px-2"> · </span>
      <Link className="text-blue hover:underline" to="/docs">
        Documentation
      </Link>
    </div>
  );
}
