export const getEnv = (key, defaultValue = '') => {
    const { env } = process;
    const value = env[key];
    if (value) {
        return value;
    }
    return defaultValue;
};
export const hasEnv = (key) => {
    const value = getEnv(key).toLowerCase();
    if (value === '' || value === 'false' || value === '0') {
        return false;
    }
    return true;
};
export const requireEnv = (key) => {
    const { env } = process;
    const value = env[key];
    if (value) {
        return value;
    }
    throw new Error(`ENV var "${key}" is required, but was not found.`);
};
//# sourceMappingURL=env.js.map