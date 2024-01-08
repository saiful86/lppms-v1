export const getBaseUrl = (): string => {
  return typeof process !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_BASE_URL || "http://10.192.1.42:5056"
    : "http://10.192.1.42:5056";
};


