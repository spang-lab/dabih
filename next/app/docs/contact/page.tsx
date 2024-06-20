'use client';
import Link from 'next/link';
import useInfo from '@/lib/hooks/info';

export default function Contact() {
  const info = useInfo();

  const contact = info?.branding?.contact;
  if (!contact) {
    return null;
  }

  const {
    email,
    name,
    street,
    zip,
    city,
    state,
    country,
    phone,
  } = contact;

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Contact</h1>
      <div className="p-2 text-lg">
        <p className="font-bold">{name}</p>
        <p>{street}</p>
        <p>
          {zip}
          {' '}
          {city}
        </p>
        <p>
          {state}
          {', '}
          {country}
        </p>
        <p>{phone}</p>
        <Link
          className="text-blue hover:underline px-1"
          href={`mailto:${email}`}
        >
          {email}
        </Link>
      </div>

    </div>
  );
}
