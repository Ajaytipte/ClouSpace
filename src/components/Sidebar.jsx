import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import {
    Home,
    Files,
    Clock,
    Trash2,
    ShieldCheck,
    HardDrive,
    Plus,
    ArrowUpCircle
} from 'lucide-react';
import { useFileUpload } from '../context/FileUploadContext';
import { storageUsage } from '../api';

const Sidebar = ({ isOpen, onClose }) => {
    const { uploadFile } = useFileUpload();
    const [storage, setStorage] = React.useState({ used: 0, total: 15 * 1024 * 1024 * 1024 });

    React.useEffect(() => {
        loadStorage();
        // Listen for upload completion to refresh storage
        window.addEventListener('file-uploaded', loadStorage);
        return () => window.removeEventListener('file-uploaded', loadStorage);
    }, []);

    const loadStorage = async () => {
        try {
            const data = await storageUsage();
            setStorage(data);
        } catch (error) {
            console.error('Error loading storage:', error);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            uploadFile(file);
        }
    };

    const menuItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Files, label: 'My Files', path: '/my-files' },
        { icon: Clock, label: 'Recent', path: '/recent' },
        { icon: Trash2, label: 'Trash', path: '/trash' },
    ];

    const storageUsed = storage.used / (1024 * 1024 * 1024); // Convert to GB
    const storageTotal = storage.total / (1024 * 1024 * 1024); // Convert to GB
    const storagePercentage = (storageUsed / storageTotal) * 100;

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`
        fixed top-16 bottom-0 left-0 z-40 w-64 bg-white dark:bg-[#0b0f1a] border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="flex flex-col h-full p-4">
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <button
                        onClick={() => document.getElementById('file-upload').click()}
                        className="flex items-center justify-center gap-2 w-full py-3 mb-6 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl shadow-lg shadow-primary-500/30 transition-all active:scale-95 group"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        <span className="font-semibold">New Upload</span>
                    </button>

                    <nav className="flex-1 space-y-1">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.label}
                                to={item.path}
                                onClick={onClose}
                                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
                  ${isActive
                                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'}
                `}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    <div className="mt-auto border-t border-gray-100 dark:border-gray-800 pt-6">
                        <div className="px-4 mb-4">
                            <div className="flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                <span>Storage</span>
                                <span className="text-gray-900 dark:text-gray-300">{storagePercentage.toFixed(1)}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary-500 transition-all duration-1000"
                                    style={{ width: `${storagePercentage}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                <span className="font-bold text-gray-700 dark:text-gray-300">{storageUsed.toFixed(1)} GB</span> of {storageTotal} GB used
                            </p>
                        </div>

                        <NavLink
                            to="/buy-storage"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ring-1 ring-gray-200 dark:ring-gray-700"
                        >
                            <ArrowUpCircle className="w-5 h-5 text-primary-500" />
                            <div className="flex flex-col">
                                <span className="text-sm font-bold">Buy Storage</span>
                                <span className="text-[10px] text-gray-500">Upgrade your plan</span>
                            </div>
                        </NavLink>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
