const convertBigInts = (_key: unknown, value: unknown) => {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
};

// eslint-disable-next-line
export default function(...args: any[]) {
  const dbgStr = '----- DEBUG\n';
  const string = args
    .map((arg) => JSON.stringify(arg, convertBigInts, 2))
    .join('\n');
  process.stdout.write(`${dbgStr}${string}\n${dbgStr}`);
}
