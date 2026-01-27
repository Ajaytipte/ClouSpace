import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useTheme } from '../context/ThemeContext';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { theme } = useTheme();

    // Dynamically apply background and text colors based on theme state to guarantee it always works
    const bgClass = theme === 'dark' ? 'bg-[#0b0f1a]' : 'bg-gray-50';
    const textClass = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';

    return (
        <div className={`min-h-screen transition-colors duration-300 ${bgClass} ${textClass}`}>
            <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className="pt-16 lg:pl-64 transition-all duration-300 min-h-screen">
                <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
