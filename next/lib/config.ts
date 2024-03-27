const isFalsey = (str: string): boolean => {
  const lower = str.trim().toLowerCase();
  if (lower === 'false' || lower === '0' || lower === '') {
    return true;
  }
  return false;
};

export const getEnv = (key: string, defaultValue = ''): string | null => {
  const { env } = process;
  const value = env[key];
  if (value) {
    if (isFalsey(value)) {
      return null;
    }
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
