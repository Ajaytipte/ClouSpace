import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
    uploadUrl as getPresignedURL,
    listFiles,
    listRecentFiles,
    listTrashFiles,
    deleteFile as apiDeleteFile,
    restoreFile as apiRestoreFile,
    permanentDeleteFile as apiPermanentDeleteFile,
    storageUsage as getStorageUsage,
    createFolder as apiCreateFolder,
    renameFile as apiRenameFile,
    getDownloadUrl as apiGetDownloadUrl
} from '../api';

const FileUploadContext = createContext();

export const FileUploadProvider = ({ children }) => {
    const [myFiles, setMyFiles] = useState([]);
    const [folders, setFolders] = useState([]);
    const [currentFolder, setCurrentFolder] = useState(null);
    const [recentFiles, setRecentFiles] = useState([]);
    const [trashFiles, setTrashFiles] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [storage, setStorage] = useState({ used: 0, total: 15 * 1024 * 1024 * 1024 });
    const [uploads, setUploads] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const refreshData = useCallback(async () => {
        try {
            setIsLoading(true);
            // In a real app, listFiles should accept a folderId
            // For now, we'll assume listFiles returns everything and we filter client-side
            // OR we update the API call if the backend supports it.
            // Assuming backend support: listFiles(currentFolder?.folderId)

            const results = await Promise.allSettled([
                listFiles(currentFolder?.folderId),
                listRecentFiles(),
                listTrashFiles(),
                getStorageUsage()
            ]);

            const allFiles = results[0].status === 'fulfilled' ? results[0].value || [] : [];

            // Separate folders and files if the API returns them mixed, or if we need to filter
            // Assuming the API returns a structure like { files: [], folders: [] } or just a list
            // For this implementation, let's assume 'allFiles' contains both with a 'type' property or similar
            // If the API is simple, we might need to mock folders for now or assume they are in the list

            // MOCKING FOLDERS for demonstration if API doesn't return them yet
            // In production, 'allFiles' should contain folders
            // We will filter based on currentFolder logic if the API returns everything
            // But ideally the API filters.

            // For now, let's assume the API returns everything and we filter manually if needed
            // But since we added createFolder, we expect folders to be in the list.

            const loadedFolders = allFiles.filter(f => f.type === 'folder' || f.isFolder);
            const loadedFiles = allFiles.filter(f => f.type !== 'folder' && !f.isFolder);

            setFolders(loadedFolders);
            setMyFiles(loadedFiles);

            setRecentFiles(results[1].status === 'fulfilled' ? results[1].value || [] : []);
            setTrashFiles(results[2].status === 'fulfilled' ? results[2].value || [] : []);
            setStorage(results[3].status === 'fulfilled' ? results[3].value || { used: 0, total: 15 * 1024 * 1024 * 1024 } : { used: 0, total: 15 * 1024 * 1024 * 1024 });

            // Log errors for debugging
            if (results[0].status === 'rejected') console.error('listFiles failed:', results[0].reason);
            if (results[1].status === 'rejected') console.error('listRecentFiles failed:', results[1].reason);
            if (results[2].status === 'rejected') console.error('listTrashFiles failed:', results[2].reason);
            if (results[3].status === 'rejected') console.error('getStorageUsage failed:', results[3].reason);

        } catch (error) {
            console.error('Failed to refresh data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [currentFolder]);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const addNotification = (title, message) => {
        const newNotif = {
            id: Date.now(),
            title,
            message,
            time: 'Just now',
            unread: true
        };
        setNotifications(prev => [newNotif, ...prev]);
    };

    const createFolder = async (name) => {
        try {
            await apiCreateFolder(name, currentFolder?.folderId);
            addNotification('Folder Created', `Created folder "${name}"`);
            await refreshData();
        } catch (error) {
            console.error('Create folder error:', error);
            addNotification('Error', 'Failed to create folder');
        }
    };

    const navigateToFolder = (folder) => {
        setCurrentFolder(folder);
    };

    const getFileUrl = async (file) => {
        // 1. Try to get a secure presigned URL from the backend
        try {
            const { downloadUrl } = await apiGetDownloadUrl(file.fileId || file.id);
            if (downloadUrl) return downloadUrl;
        } catch (error) {
            console.warn('Backend does not support /download-url or failed, falling back to public URL construction.');
        }

        // 2. Fallback: Construct S3 URL (assuming public or known pattern)
        const bucketName = 'cloudspace-files';
        const region = 'ap-south-1';
        const key = file.fileName || file.name || file.key;

        if (key) {
            return `https://${bucketName}.s3.${region}.amazonaws.com/${encodeURIComponent(key)}`;
        }

        throw new Error('Could not determine file URL');
    };

    const downloadFile = async (file) => {
        try {
            addNotification('Downloading', `Starting download for ${file.name || file.fileName}...`);

            const url = await getFileUrl(file);

            // Trigger download
            const link = document.createElement('a');
            link.href = url;
            link.download = file.name || file.fileName;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error('Download error:', error);
            addNotification('Download Failed', 'Could not download file. Please check if the file exists.');
        }
    };

    const renameFile = async (file, newName) => {
        try {
            await apiRenameFile(file.fileId || file.id, newName);
            addNotification('Renamed', `Renamed to ${newName}`);
            await refreshData();
        } catch (error) {
            console.error('Rename error:', error);
            if (error.response && error.response.status === 404) {
                addNotification('Error', 'Rename feature not supported by backend yet.');
            } else {
                addNotification('Error', 'Failed to rename file');
            }
        }
    };

    const uploadFile = async (file) => {
        const id = Date.now();
        const newUpload = { id, name: file.name, progress: 0, status: 'requesting_url' };

        setUploads(prev => [...prev, newUpload]);

        try {
            const { uploadURL, fileId } = await getPresignedURL({
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                folderId: currentFolder?.folderId // Pass folder ID if supported
            });

            setUploads(prev => prev.map(u => u.id === id ? { ...u, status: 'uploading' } : u));

            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const progress = (event.loaded / event.total) * 100;
                        setUploads(prev => prev.map(u => u.id === id ? { ...u, progress } : u));
                    }
                };

                xhr.onload = async () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        setUploads(prev => prev.map(u => u.id === id ? { ...u, progress: 100, status: 'completed' } : u));

                        addNotification('Upload Complete', `Successfully uploaded ${file.name}`);
                        await refreshData();

                        setTimeout(() => {
                            setUploads(prev => prev.filter(u => u.id !== id));
                        }, 3000);
                        resolve();
                    } else {
                        reject(new Error('S3 Upload failed'));
                    }
                };

                xhr.onerror = () => reject(new Error('Network error during S3 upload'));
                xhr.open('PUT', uploadURL);
                xhr.setRequestHeader('Content-Type', file.type);
                xhr.send(file);
            });

        } catch (error) {
            console.error('Upload Error:', error);
            setUploads(prev => prev.map(u => u.id === id ? { ...u, status: 'error', error: error.message } : u));
            addNotification('Upload Failed', `Could not upload ${file.name}`);
            setTimeout(() => {
                setUploads(prev => prev.filter(u => u.id !== id));
            }, 5000);
        }
    };

    const deleteFile = async (fileId) => {
        if (!window.confirm('Are you sure you want to move this file to the Recycle Bin?')) {
            return;
        }
        try {
            await apiDeleteFile(fileId);
            addNotification('File Deleted', 'Moved to Recycle Bin');
            await refreshData();
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete file');
        }
    };

    const restoreFile = async (fileId) => {
        try {
            await apiRestoreFile(fileId);
            addNotification('File Restored', 'File moved back to original folder');
            await refreshData();
        } catch (error) {
            console.error('Restore error:', error);
            alert('Failed to restore file');
        }
    };

    const permanentDelete = async (fileId) => {
        if (!fileId) {
            console.error('Cannot delete: Missing file ID');
            return;
        }

        try {
            console.log('Permanently deleting file:', fileId);
            await apiPermanentDeleteFile(fileId);

            // Update local state immediately
            setTrashFiles(prev => prev.filter(f => (f.fileId || f.id) !== fileId));

            // Also ensure it's removed from other lists just in case
            setMyFiles(prev => prev.filter(f => (f.fileId || f.id) !== fileId));
            setRecentFiles(prev => prev.filter(f => (f.fileId || f.id) !== fileId));

            addNotification('File Permanently Deleted', 'This action cannot be undone');
        } catch (error) {
            console.error('Permanent delete error:', error);
            if (error.response && error.response.status === 500) {
                alert('Server Error: The backend failed to delete the file. This usually means the server is missing permissions (s3:DeleteObject) or has a bug.');
            } else {
                alert('Failed to permanently delete file. Please try again.');
            }
        }
    };

    const emptyTrash = async () => {
        if (trashFiles.length === 0) return;
        try {
            setIsLoading(true);
            // In future, call a single /empty-trash endpoint
            await Promise.all(trashFiles.map(f => apiDeleteFile(f.fileId)));
            addNotification('Trash Emptied', 'All files permanently deleted');
            await refreshData();
        } catch (error) {
            console.error('Empty Trash error:', error);
            alert('Failed to empty trash completely');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <FileUploadContext.Provider value={{
            uploadFile,
            uploads,
            myFiles,
            folders,
            currentFolder,
            recentFiles,
            trashFiles,
            notifications,
            setNotifications,
            storage,
            isLoading,
            refreshData,
            deleteFile,
            restoreFile,
            permanentDelete,
            emptyTrash,
            createFolder,
            navigateToFolder,
            downloadFile,
            renameFile,
            getFileUrl
        }}>
            {children}
            {/* Global Upload Progress Tray */}
            {uploads.length > 0 && (
                <div className="fixed bottom-6 right-6 w-80 space-y-4 z-[100]">
                    {uploads.map(upload => (
                        <div key={upload.id} className="bg-white dark:bg-[#0b0f1a] p-5 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl animate-in slide-in-from-right-10 overflow-hidden relative">
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-3 text-xs">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-900 dark:text-white truncate max-w-[150px]">{upload.name}</span>
                                        <span className="text-gray-400 capitalize mt-0.5">{upload.status.replace('_', ' ')}</span>
                                    </div>
                                    <span className={`font-black ${upload.status === 'completed' ? 'text-green-500' : 'text-primary-600'}`}>
                                        {Math.round(upload.progress)}%
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-300 ${upload.status === 'completed' ? 'bg-green-500' : upload.status === 'error' ? 'bg-red-500' : 'bg-primary-500'}`}
                                        style={{ width: `${upload.progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </FileUploadContext.Provider>
    );
};

export const useFileUpload = () => useContext(FileUploadContext);
