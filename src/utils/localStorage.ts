const getLocalStorage = (key: string): object | null => {
  const config = localStorage.getItem(key);
  if (config) {
    try {
      return JSON.parse(config);
    } catch (err) {
      return [];
    }
  }
  return [];
};

const setLocalStorage = (key: string, config: object) => {
  localStorage.setItem(key, JSON.stringify(config));
  return key;
};

const clearLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};
export { getLocalStorage, setLocalStorage, clearLocalStorage };
