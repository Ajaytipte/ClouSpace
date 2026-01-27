import React, { useState } from 'react';
import {
    FileText,
    Image as ImageIcon,
    Video,
    Music,
    Archive,
    MoreVertical,
    Star
} from 'lucide-react';
import FileOptionsMenu from './FileOptionsMenu';

const FileCard = ({ file, onAction, isTrash = false }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

    const getFileIcon = (mimeType) => {
        if (!mimeType) return { icon: FileText, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800/50' };
        if (mimeType.includes('image')) return { icon: ImageIcon, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' };
        if (mimeType.includes('video')) return { icon: Video, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' };
        if (mimeType.includes('pdf')) return { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' };
        if (mimeType.includes('audio')) return { icon: Music, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' };
        if (mimeType.includes('zip') || mimeType.includes('rar')) return { icon: Archive, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' };
        return { icon: FileText, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800/50' };
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const { icon: Icon, color, bg } = getFileIcon(file.fileType || file.type);

    const handleMenuClick = (e) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        setMenuPosition({ x: rect.right, y: rect.bottom });
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <div
                onClick={() => onAction('view', file)}
                className="group relative bg-white dark:bg-[#0b0f1a] p-4 rounded-3xl border border-gray-200 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500 cursor-pointer transition-all hover:shadow-lg active:scale-[0.98]"
            >
                <div className="flex items-start justify-between mb-8">
                    <div className={`p-4 rounded-2xl ${bg}`}>
                        <Icon className={`w-8 h-8 ${color}`} />
                    </div>

                    <div className="flex items-center gap-1">
                        {!isTrash && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onAction('star', file); }}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-300 hover:text-yellow-500 transition-colors"
                            >
                                <Star className={`w-5 h-5 ${file.isStarred ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                            </button>
                        )}

                        {!isTrash && (
                            <button
                                onClick={handleMenuClick}
                                className={`p-2 rounded-xl transition-colors ${isMenuOpen ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-200'}`}
                            >
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-1">
                    <h3 className="font-bold text-gray-900 dark:text-white truncate pr-2" title={file.fileName || file.name}>
                        {file.fileName || file.name}
                    </h3>
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                            {formatBytes(file.fileSize || file.size || 0)}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">
                            {file.createdAt ? new Date(file.createdAt).toLocaleDateString() : 'Today'}
                        </span>
                    </div>
                </div>
            </div>

            <FileOptionsMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                onAction={onAction}
                file={file}
                position={menuPosition}
            />
        </>
    );
};

export default FileCard;
