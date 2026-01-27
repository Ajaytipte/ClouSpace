import React from 'react';
import { useFileUpload } from '../context/FileUploadContext';
import FileList from '../components/FileList';

const Recent = () => {
    const { recentFiles, isLoading, deleteFile } = useFileUpload();

    const handleAction = async (action, file) => {
        if (action === 'delete') {
            await deleteFile(file.fileId || file.id);
        } else if (action === 'download' || action === 'view') {
            if (file.url) window.open(file.url, '_blank');
            else alert('File URL not available');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <header className="px-2">
                <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Recent Activity</h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Files you've recently uploaded or modified.</p>
            </header>

            <FileList
                files={recentFiles}
                onAction={handleAction}
                isLoading={isLoading}
            />
        </div>
    );
};

export default Recent;
