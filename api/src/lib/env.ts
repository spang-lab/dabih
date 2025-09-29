export const getEnv = (key: string, defaultValue: string | null = '') => {
  const { env } = process;
  const value = env[key];
  if (value) {
    return value;
  }
  return defaultValue;
};

export const requireEnv = (key: string): string => {
  const { env } = process;
  const value = env[key];
  if (value) {
    return value;
  }
  throw new Error(`ENV var "${key}" is required, but was not found.`);
};
