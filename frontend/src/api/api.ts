import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios';

const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('jwt_token');
    }
    return null;
};

export const authApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_AUTH,
});

// Ações para o logout centralizado
const handleUnauthorized = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('jwt_token');
        window.location.replace('/login?sessionExpired=true'); 
    }
};

const createAuthenticatedApi = (baseURL: string) => {
    const api = axios.create({ baseURL });

    api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config; 
    }, (error) => {
        return Promise.reject(error);
    });

    api.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
            if (error.response && error.response.status === 401) {
                console.warn('Sessão expirada ou não autorizada (401). Forçando logout.');
                handleUnauthorized();
            }
            return Promise.reject(error);
        }
    );

    return api;
}

export const managementApi = createAuthenticatedApi(process.env.NEXT_PUBLIC_API_MANAGEMENT!);
export const queryApi = createAuthenticatedApi(process.env.NEXT_PUBLIC_API_QUERY!);