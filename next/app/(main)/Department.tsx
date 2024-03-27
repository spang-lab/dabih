import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/api';

export default async function Department() {
  const info = await api.info();
  const department = info?.branding?.department;
  if (!department) {
    return null;
  }
  const { name, url, logo } = department;

  return (
    <div className="flex flex-row">
      <div className="relative w-16 h-16">
        <Image
          className="object-contain"
          src={logo}
          alt={`${name} logo`}
          sizes="99vw"
          fill
        />
      </div>
      <div className="p-3 text-3xl font-bold text-gray-400">
        <Link href={url}>
          {name}
        </Link>
      </div>
    </div>
  );
}
