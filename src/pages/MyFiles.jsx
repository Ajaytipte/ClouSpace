import React from 'react';
import { Plus, Upload, FolderPlus } from 'lucide-react';
import { useFileUpload } from '../context/FileUploadContext';
import FileList from '../components/FileList';

const MyFiles = () => {
    const { myFiles, isLoading, deleteFile, uploadFile } = useFileUpload();

    const handleAction = async (action, file) => {
        if (action === 'delete') {
            await deleteFile(file.fileId || file.id);
        } else if (action === 'download' || action === 'view') {
            if (file.url) window.open(file.url, '_blank');
            else alert('File URL not available');
        }
    };

    const handleUploadClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.onchange = (e) => {
            const selectedFiles = e.target.files;
            if (selectedFiles.length > 0) {
                Array.from(selectedFiles).forEach(file => uploadFile(file));
            }
        };
        input.click();
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">My Files</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-bold mt-1">Manage and organize your secure assets.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all flex items-center gap-2 shadow-sm">
                        <FolderPlus className="w-4 h-4" />
                        <span>New Folder</span>
                    </button>
                    <button
                        onClick={handleUploadClick}
                        className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl shadow-xl shadow-primary-500/20 transition-all active:scale-95 font-black uppercase tracking-widest text-xs flex items-center gap-2"
                    >
                        <Upload className="w-4 h-4" />
                        <span>Upload File</span>
                    </button>
                </div>
            </div>

            <FileList
                files={myFiles}
                onAction={handleAction}
                isLoading={isLoading}
            />
        </div>
    );
};

export default MyFiles;
