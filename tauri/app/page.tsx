import Image from 'next/image';
import Form from './Form';

import Open from './Open';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-stretch">
      <div className="container mx-auto">
        <Form />
        <Open />
      </div>
    </main>
  );
}
