let store = {};

const init = async () => {
  const set = async (key, value, lifetime) => {
    const msToS = 1000;
    const endOfLife = new Date() + lifetime * msToS;
    const data = {
      timestamp: endOfLife,
      value,
    };
    store[key] = data;
  };
  const get = async (key) => {
    const data = store[key];
    if (!data) {
      return null;
    }
    const { timestamp, value } = data;
    if (timestamp < new Date()) {
      return null;
    }
    return value;
  };
  const touch = async (key, lifetime) => {
    const value = await get(key);
    if (!value) {
      return;
    }
    await set(key, value, lifetime);
  };

  const del = async (key) => {
    delete store[key];
  };
  const close = () => {
    store = {};
  };
  return {
    get, set, del, close, touch,
  };
};
export default init;
