import { API_BASE_URL } from '../config/api';

const fileBase = API_BASE_URL;

export const withCDN = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (!path.startsWith('/')) return `${fileBase}/${path}`;
  return `${fileBase}${path}`;
};
