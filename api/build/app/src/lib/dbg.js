const convertBigInts = (_key, value) => {
    if (typeof value === 'bigint') {
        return value.toString();
    }
    return value;
};
export default function (...args) {
    const dbgStr = '----- DEBUG\n';
    const string = args
        .map((arg) => JSON.stringify(arg, convertBigInts, 2))
        .join('\n');
    process.stdout.write(`${dbgStr}${string}\n${dbgStr}`);
}
//# sourceMappingURL=dbg.js.map