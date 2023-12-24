export const getBaseUrl = (): string => {
  return typeof process !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_BASE_URL || "http://202.164.208.13:5066"
    : "http://202.164.208.13:5066";
};


