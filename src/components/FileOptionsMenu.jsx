import React, { useEffect, useRef } from 'react';
import { Eye, Download, Edit2, Trash2, FolderInput, MoreVertical } from 'lucide-react';

const FileOptionsMenu = ({ isOpen, onClose, onAction, file, position }) => {
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Adjust position to prevent overflow
    const style = {
        top: position.y + 10,
        left: position.x - 160, // Shift left to align with the button
    };

    return (
        <div
            ref={menuRef}
            style={style}
            className="fixed z-50 w-48 bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 py-2 animate-in fade-in zoom-in-95 duration-200"
        >
            <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</p>
            </div>

            <button
                onClick={() => { onAction('view', file); onClose(); }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors"
            >
                <Eye className="w-4 h-4 text-blue-500" />
                View
            </button>

            <button
                onClick={() => { onAction('download', file); onClose(); }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors"
            >
                <Download className="w-4 h-4 text-green-500" />
                Download
            </button>

            <button
                onClick={() => { onAction('rename', file); onClose(); }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors"
            >
                <Edit2 className="w-4 h-4 text-orange-500" />
                Rename
            </button>

            {/* <button
                onClick={() => { onAction('move', file); onClose(); }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors"
            >
                <FolderInput className="w-4 h-4 text-purple-500" />
                Move to Folder
            </button> */}

            <div className="h-px bg-gray-100 dark:bg-gray-800 my-1" />

            <button
                onClick={() => { onAction('delete', file); onClose(); }}
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors"
            >
                <Trash2 className="w-4 h-4" />
                Delete
            </button>
        </div>
    );
};

export default FileOptionsMenu;
