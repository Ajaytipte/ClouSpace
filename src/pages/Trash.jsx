import React from 'react';
import { useFileUpload } from '../context/FileUploadContext';
import FileList from '../components/FileList';

const Trash = () => {
    const { trashFiles, isLoading, restoreFile, permanentDelete, emptyTrash } = useFileUpload();

    const handleAction = async (action, file) => {
        const fileId = file.fileId || file.id;
        if (action === 'restore') {
            await restoreFile(fileId);
        } else if (action === 'delete_permanent') {
            if (window.confirm('Are you sure you want to permanently delete this file? This action cannot be undone.')) {
                await permanentDelete(fileId);
            }
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <header className="px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Recycle Bin</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Files in trash will be permanently deleted after 30 days.</p>
                </div>

                {trashFiles.length > 0 && (
                    <button
                        onClick={emptyTrash}
                        className="px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-lg"
                    >
                        Empty Trash
                    </button>
                )}
            </header>

            <FileList
                files={trashFiles}
                onAction={handleAction}
                isLoading={isLoading}
                isTrash={true}
            />
        </div>
    );
};

export default Trash;
