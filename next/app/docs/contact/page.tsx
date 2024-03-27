import Link from 'next/link';
import api from '@/lib/api';

export default async function Contact() {
  const info = await api.info();

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
