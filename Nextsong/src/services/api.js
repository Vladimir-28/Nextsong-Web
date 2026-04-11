const DEFAULT_API_URL = "http://localhost:8080";

const normalizeBaseUrl = (value) => {
    if (!value) return DEFAULT_API_URL;
    return value.endsWith("/") ? value.slice(0, -1) : value;
};

export const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_URL);

export const buildApiUrl = (path) => {
    if (!path) return API_BASE_URL;
    return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};
