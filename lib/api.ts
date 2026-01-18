const DEFAULT_API_BASE_URL = "https://api.kaya.ng/kaya-api";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;

const DEFAULT_RIDER_PROFILE_BASE_URL = "https://jbuit.org/api";

export const RIDER_PROFILE_BASE_URL =
  process.env.NEXT_PUBLIC_RIDER_PROFILE_BASE_URL ??
  DEFAULT_RIDER_PROFILE_BASE_URL;

export const apiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return `${API_BASE_URL}/${normalizedPath}`;
};

export const riderProfileUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return `${RIDER_PROFILE_BASE_URL}/${normalizedPath}`;
};
