import React, { useState, useEffect } from 'react';
import { X, Download, FileText, Image as ImageIcon, Video, Music, Archive, Loader2 } from 'lucide-react';
import { useFileUpload } from '../context/FileUploadContext';

const FilePreview = ({ file, isOpen, onClose, onDownload }) => {
    const { getFileUrl } = useFileUpload();
    const [fileUrl, setFileUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && file) {
            const fetchUrl = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const url = await getFileUrl(file);
                    setFileUrl(url);
                } catch (err) {
                    console.error('Failed to get file URL:', err);
                    setError('Could not load file preview');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchUrl();
        } else {
            setFileUrl(null);
        }
    }, [isOpen, file, getFileUrl]);

    if (!isOpen || !file) return null;

    const isImage = file.type?.startsWith('image/') || file.fileType?.startsWith('image/');
    const isPDF = file.type === 'application/pdf' || file.fileType === 'application/pdf';
    const isVideo = file.type?.startsWith('video/') || file.fileType?.startsWith('video/');

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-64 text-white">
                    <Loader2 className="w-10 h-10 animate-spin mb-4" />
                    <p>Loading preview...</p>
                </div>
            );
        }

        if (error || !fileUrl) {
            return (
                <div className="text-center p-10 bg-white dark:bg-[#1a1f2e] rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800">
                    <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                        <FileText className="w-12 h-12" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Preview Failed</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs mx-auto">
                        {error || 'Could not load file URL.'}
                    </p>
                    <button
                        onClick={() => onDownload(file)}
                        className="px-8 py-3 bg-primary-600 text-white font-bold rounded-2xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20 flex items-center gap-2 mx-auto"
                    >
                        <Download className="w-5 h-5" />
                        Try Download
                    </button>
                </div>
            );
        }

        if (isImage) {
            return (
                <img
                    src={fileUrl}
                    alt={file.name}
                    className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                />
            );
        }
        if (isPDF) {
            return (
                <iframe
                    src={`${fileUrl}#toolbar=0`}
                    className="w-full h-[80vh] rounded-lg shadow-2xl bg-white"
                    title="PDF Preview"
                />
            );
        }
        if (isVideo) {
            return (
                <video
                    controls
                    className="max-w-full max-h-[80vh] rounded-lg shadow-2xl"
                >
                    <source src={fileUrl} type={file.type || file.fileType} />
                    Your browser does not support the video tag.
                </video>
            );
        }

        // Fallback for other files
        return (
            <div className="text-center p-10 bg-white dark:bg-[#1a1f2e] rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                    <FileText className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Preview Available</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs mx-auto">
                    This file type cannot be previewed directly in the browser. Please download it to view.
                </p>
                <button
                    onClick={() => onDownload(file)}
                    className="px-8 py-3 bg-primary-600 text-white font-bold rounded-2xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20 flex items-center gap-2 mx-auto"
                >
                    <Download className="w-5 h-5" />
                    Download File
                </button>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-6xl flex flex-col items-center">
                {/* Header */}
                <div className="w-full flex items-center justify-between mb-6 text-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                            {isImage ? <ImageIcon className="w-5 h-5" /> : isPDF ? <FileText className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg truncate max-w-md">{file.name || file.fileName}</h3>
                            <p className="text-xs text-white/60">
                                {(file.size / 1024 / 1024).toFixed(2)} MB • {new Date(file.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => onDownload(file)}
                            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-colors text-white"
                            title="Download"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-3 bg-white/10 hover:bg-red-500/80 rounded-xl backdrop-blur-sm transition-colors text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="w-full flex items-center justify-center">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default FilePreview;
