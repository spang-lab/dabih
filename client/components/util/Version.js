import info from '@/package.json';

export default function Version() {
  const { version } = info;
  return version;
}
