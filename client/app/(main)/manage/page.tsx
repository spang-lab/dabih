import { Datasets } from '@/components';

export default function Manage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
        Manage
        <span className="text-blue"> your data </span>
      </h1>
      <Datasets />
    </div>
  );
}
