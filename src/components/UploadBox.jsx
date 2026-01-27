import React, { useState, useRef } from 'react';
import { Upload, Cloud, Plus } from 'lucide-react';
import { useFileUpload } from '../context/FileUploadContext';

const UploadBox = () => {
    const [isDragging, setIsDragging] = useState(false);
    const { uploadFile } = useFileUpload();
    const fileInputRef = useRef(null);

    const onDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleUpload(files);
        }
    };

    const handleFileSelect = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            handleUpload(files);
        }
    };

    const handleUpload = (files) => {
        Array.from(files).forEach(file => uploadFile(file));
    };

    return (
        <div
            className={`
                relative p-10 bg-white dark:bg-[#0b0f1a] rounded-[2.5rem] border-2 border-dashed transition-all duration-300 group shadow-sm
                ${isDragging
                    ? 'border-primary-500 bg-primary-50/30 dark:bg-primary-900/10 scale-[1.01]'
                    : 'border-gray-200 dark:border-gray-800 hover:border-primary-400 dark:hover:border-primary-700'
                }
            `}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            <div className="flex flex-col items-center text-center space-y-6">
                <div className={`
                    w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-3xl flex items-center justify-center transition-all duration-500
                    ${isDragging ? 'rotate-12 scale-110 shadow-xl' : 'group-hover:scale-105'}
                `}>
                    <Cloud className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                        {isDragging ? 'Drop it like it\'s hot!' : 'Upload Files'}
                    </h2>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 max-w-[240px]">
                        Drag and drop your files anywhere or click the button below to browse.
                    </p>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    onChange={handleFileSelect}
                />

                <button
                    onClick={() => fileInputRef.current.click()}
                    className="flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl shadow-xl shadow-primary-500/20 transition-all active:scale-95 font-black uppercase tracking-widest text-xs"
                >
                    <Plus className="w-4 h-4" />
                    New Upload
                </button>
            </div>

            {/* Subtle background flair */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-40 h-40 bg-primary-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
        </div>
    );
};

export default UploadBox;
