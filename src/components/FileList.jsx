import React, { useState } from 'react';
import { LayoutGrid, List as ListIcon, Search, Archive, FolderPlus } from 'lucide-react';
import FileCard from './FileCard';
import FolderCard from './FolderCard';
import NewFolderModal from './NewFolderModal';
import FilePreview from './FilePreview';
import { useFileUpload } from '../context/FileUploadContext';

const FileList = ({ files, onAction, isLoading, isTrash = false }) => {
    const { folders, createFolder, currentFolder, navigateToFolder, downloadFile } = useFileUpload();
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);

    const filteredFiles = files.filter(file =>
        (file.fileName || file.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredFolders = (folders || []).filter(folder =>
        (folder.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAction = (action, item) => {
        if (action === 'view') {
            setPreviewFile(item);
        } else if (action === 'download') {
            downloadFile(item);
        } else {
            onAction(action, item);
        }
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse p-4">
                {[1, 2, 3, 4, 5, 8].map(i => (
                    <div key={i} className="h-48 bg-gray-200 dark:bg-gray-800 rounded-[2.5rem]"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-2">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                        {currentFolder ? currentFolder.name : (isTrash ? 'Trash' : 'All Files')}
                    </h2>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-black text-gray-500 uppercase">
                        {filteredFiles.length + filteredFolders.length}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Find a file..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-gray-100 dark:bg-gray-900 border-none rounded-2xl py-3 pl-12 pr-6 text-sm focus:ring-2 focus:ring-primary-500 transition-all outline-none w-full sm:w-64 text-gray-900 dark:text-white placeholder:text-gray-500"
                        />
                    </div>

                    {!isTrash && (
                        <button
                            onClick={() => setIsNewFolderModalOpen(true)}
                            className="p-3 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 rounded-2xl hover:bg-primary-600 hover:text-white transition-all shadow-sm"
                            title="New Folder"
                        >
                            <FolderPlus className="w-5 h-5" />
                        </button>
                    )}

                    <div className="flex bg-gray-100 dark:bg-gray-900 p-1.5 rounded-2xl shadow-inner">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-800 shadow-md text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-800 shadow-md text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <ListIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Breadcrumbs (Simple Back Button for now if in folder) */}
            {currentFolder && (
                <button
                    onClick={() => navigateToFolder(null)} // Go to root for now, ideally parentId
                    className="text-sm font-bold text-gray-500 hover:text-primary-600 flex items-center gap-2 px-2"
                >
                    ← Back to Home
                </button>
            )}

            {filteredFiles.length === 0 && filteredFolders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-[#0b0f1a] rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-800 text-center shadow-sm">
                    <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-full mb-6 text-gray-400">
                        <Archive className="w-12 h-12" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Nothing to see here</h3>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 max-w-[200px]">You haven't uploaded any files yet or no results match your search.</p>
                </div>
            ) : (
                <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-2" : "space-y-4"}>
                    {/* Folders Section */}
                    {filteredFolders.map(folder => (
                        <FolderCard
                            key={folder.folderId || folder.id}
                            folder={folder}
                            onOpen={navigateToFolder}
                        />
                    ))}

                    {/* Files Section */}
                    {filteredFiles.map((file) => (
                        <FileCard
                            key={file.fileId || file.id}
                            file={file}
                            onAction={handleAction}
                            isTrash={isTrash}
                        />
                    ))}
                </div>
            )}

            <NewFolderModal
                isOpen={isNewFolderModalOpen}
                onClose={() => setIsNewFolderModalOpen(false)}
                onCreate={createFolder}
            />

            <FilePreview
                file={previewFile}
                isOpen={!!previewFile}
                onClose={() => setPreviewFile(null)}
                onDownload={downloadFile}
            />
        </div>
    );
};

export default FileList;
