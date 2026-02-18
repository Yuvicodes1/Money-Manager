const cacheStore = {};

const TTL = 60 * 1000; // 60 seconds

//this part is used to retrieve a value from the cache based on a key. It checks if the cached value exists and if it has not expired based on the defined TTL (Time To Live). If the cached value is valid, it returns the value; otherwise, it returns null.
exports.getFromCache = (key) => {
  const cached = cacheStore[key];

  if (!cached) return null;

  const isExpired = Date.now() - cached.timestamp > TTL;

  if (isExpired) {
    delete cacheStore[key];
    return null;
  }

  return cached.value;
};

//this part is used to set the cache for a specific key with a value. It stores the value along with a timestamp of when it was set. The timestamp is used to determine if the cached value has expired based on the defined TTL (Time To Live).
exports.setCache = (key, value) => {
  cacheStore[key] = {
    value,
    timestamp: Date.now()
  };
};
