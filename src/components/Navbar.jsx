import React, { useState, useEffect } from 'react';
import { Search, User, LogOut, Menu, Bell, Settings, Cloud } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, signOutUser } from '../auth/authUtils';
import { useFileUpload } from '../context/FileUploadContext';

const Navbar = ({ onToggleSidebar }) => {
    const { theme, toggleTheme } = useTheme();
    const { notifications, setNotifications } = useFileUpload();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const unreadCount = notifications.filter(n => n.unread).length;

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const userData = await getCurrentUser();
            setUser(userData);
        } catch (error) {
            console.error('Error loading user:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOutUser();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            navigate('/login');
        }
    };

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    };

    const handleNotificationClick = () => {
        setShowNotifications(!showNotifications);
        setShowProfileMenu(false);
        if (!showNotifications && unreadCount > 0) {
            // Optional: mark as read when list opens
            // markAllRead();
        }
    };

    return (
        <nav className="h-16 fixed top-0 left-0 right-0 z-50 px-4 flex items-center justify-between border-b bg-white/80 dark:bg-[#0b0f1a]/80 backdrop-blur-md border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <div className="flex items-center gap-4">
                <button onClick={onToggleSidebar} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg lg:hidden transition-colors text-gray-600 dark:text-gray-400">
                    <Menu className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate('/')}>
                    <div className="bg-primary-600 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-primary-500/20">
                        <Cloud className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-black bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent hidden sm:block tracking-tighter">CloudSpace</span>
                </div>
            </div>

            <div className="flex-1 max-w-2xl px-8 hidden md:block">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    <input type="text" placeholder="Search your library..." className="w-full bg-gray-100 dark:bg-gray-900 border-none rounded-2xl py-3 pl-12 pr-6 focus:ring-2 focus:ring-primary-500 transition-all outline-none text-gray-900 dark:text-white placeholder:text-gray-500" />
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                <button onClick={toggleTheme} className="p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-2xl transition-all active:scale-95 text-gray-600 dark:text-gray-400">
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>

                <div className="relative">
                    <button onClick={handleNotificationClick} className="p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-2xl transition-all active:scale-95 relative text-gray-600 dark:text-gray-400">
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center animate-bounce">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-4 w-80 bg-white dark:bg-[#0b0f1a] border border-gray-200 dark:border-gray-800 rounded-[2rem] shadow-2xl py-4 z-50 animate-in fade-in slide-in-from-top-4">
                            <div className="px-6 py-2 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between mb-2">
                                <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Notifications</h3>
                                <button onClick={markAllRead} className="text-[10px] font-black text-primary-600 uppercase hover:underline">Mark all read</button>
                            </div>
                            <div className="max-h-80 overflow-y-auto space-y-1 px-2">
                                {notifications.length === 0 ? (
                                    <p className="p-8 text-center text-xs font-bold text-gray-400">Your cloud is quiet...</p>
                                ) : notifications.map(n => (
                                    <div key={n.id} className={`p-4 rounded-3xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer relative ${n.unread ? 'bg-primary-50/30 dark:bg-primary-900/10' : ''}`}>
                                        <div className="flex items-start gap-3">
                                            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.unread ? 'bg-primary-500' : 'bg-transparent'}`}></div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-black text-gray-900 dark:text-white">{n.title}</p>
                                                <p className="text-[10px] font-medium text-gray-600 dark:text-gray-400 leading-relaxed">{n.message}</p>
                                                <p className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase mt-1">{n.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="relative">
                    <button onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }} className="flex items-center gap-3 p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-2xl transition-all active:scale-95">
                        <img src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} alt="Avatar" className="w-8 h-8 rounded-xl object-cover" />
                        <span className="text-sm font-black hidden lg:block text-gray-700 dark:text-gray-200 pr-2">{user?.name?.split(' ')[0] || 'Member'}</span>
                    </button>
                    {showProfileMenu && (
                        <div className="absolute right-0 mt-4 w-64 bg-white dark:bg-[#0b0f1a] border border-gray-200 dark:border-gray-800 rounded-[2rem] shadow-2xl py-4 z-50 animate-in fade-in slide-in-from-top-4 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 mb-2">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Signed in as</p>
                                <p className="text-sm font-black text-gray-900 dark:text-white truncate">{user?.name || 'User'}</p>
                                <p className="text-[10px] font-bold text-gray-600 dark:text-gray-400 truncate mt-0.5">{user?.email}</p>
                            </div>
                            <div className="px-2 space-y-1">
                                <button onClick={() => { navigate('/profile'); setShowProfileMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition-all">
                                    <User className="w-4 h-4" /> Profile Settings
                                </button>
                                <button className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition-all">
                                    <Settings className="w-4 h-4" /> Preferences
                                </button>
                                <div className="border-t border-gray-100 dark:border-gray-800 my-2"></div>
                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all">
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
