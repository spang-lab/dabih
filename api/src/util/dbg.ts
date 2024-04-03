
// eslint-disable-next-line
export default function (...args: any[]) {
  const dbgStr = "----- DEBUG\n";
  const string = args.map((arg) => JSON.stringify(arg, null, 2)).join('\n');
  process.stdout.write(`${dbgStr}${string}\n${dbgStr}`);
}
