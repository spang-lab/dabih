
const exists = async (path) => {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
};
const isWriteable = async (path) => {
  try {
    await access(path, constants.W_OK);
    return true;
  } catch (err) {
    return false;
  }
};
