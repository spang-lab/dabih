import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/api';

export default async function Organization() {
  const { data: info } = await api.util.info();
  const organization = info?.branding?.organization;
  if (!organization) {
    return null;
  }
  const { name, url, logo } = organization;

  return (
    <div className="flex flex-row">
      <div className="relative w-12 h-12">
        <Image
          className="object-contain"
          src={logo}
          alt={`${name} logo`}
          sizes="99vw"
          fill
        />
      </div>
      <div className="p-3 text-xl font-bold text-gray-400">
        <Link href={url}>
          {name}
        </Link>
      </div>
    </div>
  );
}
