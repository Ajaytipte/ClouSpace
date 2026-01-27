import React, { useState } from 'react';
import { Folder, MoreVertical } from 'lucide-react';

const FolderCard = ({ folder, onOpen }) => {
    return (
        <div
            onClick={() => onOpen(folder)}
            className="group relative bg-white dark:bg-[#0b0f1a] p-4 rounded-3xl border border-gray-200 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500 cursor-pointer transition-all hover:shadow-lg active:scale-95"
        >
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-500">
                    <Folder className="w-6 h-6 fill-current" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-white truncate" title={folder.name}>
                        {folder.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {folder.itemCount || 0} items
                    </p>
                </div>
                {/* Future: Add folder actions menu here */}
                {/* <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                </button> */}
            </div>
        </div>
    );
};

export default FolderCard;
