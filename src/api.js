import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: BASE_URL,
});

// Request interceptor to attach Authorization: Bearer <token>
api.interceptors.request.use(
    async (config) => {
        try {
            const session = await fetchAuthSession();
            // Get the ID Token from the Cognito session
            const token = session.tokens?.idToken?.toString();

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Auth session error:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * POST /upload-url
 */
export const uploadUrl = async (data) => {
    const response = await api.post('/upload-url', data);
    return response.data;
};

/**
 * GET /files
 */
export const listFiles = async () => {
    const response = await api.get('/files');
    return response.data;
};

/**
 * GET /files?recent=true
 */
export const listRecentFiles = async () => {
    const response = await api.get('/files?recent=true');
    return response.data;
};

/**
 * GET /files?trash=true
 */
export const listTrashFiles = async () => {
    const response = await api.get('/files?trash=true');
    return response.data;
};

/**
 * POST /delete-file
 */
export const deleteFile = async (fileId) => {
    const response = await api.post('/delete-file', { fileId });
    return response.data;
};

/**
 * POST /restore-file
 */
export const restoreFile = async (fileId) => {
    const response = await api.post('/restore-file', { fileId });
    return response.data;
};

/**
 * GET /storage-usage
 */
export const storageUsage = async () => {
    const response = await api.get('/storage-usage');
    return response.data;
};

/**
 * POST /folders
 */
export const createFolder = async (name, parentId = null) => {
    const response = await api.post('/folders', { name, parentId });
    return response.data;
};

/**
 * POST /rename-file
 */
export const renameFile = async (fileId, newName) => {
    const response = await api.post('/rename-file', { fileId, newName });
    return response.data;
};

/**
 * POST /move-file
 */
export const moveFile = async (fileId, folderId) => {
    const response = await api.post('/move-file', { fileId, folderId });
    return response.data;
};

/**
 * GET /download-url
 */
export const getDownloadUrl = async (fileId) => {
    const response = await api.get(`/download-url?fileId=${fileId}`);
    return response.data;
};

export const permanentDeleteFile = async (fileId) => {
    const response = await api.post('/permanent-delete', { fileId });
    return response.data;
};

export default api;
