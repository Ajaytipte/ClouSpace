import React from 'react';
import { FileText, Folder, Share2, TrendingUp } from 'lucide-react';
import { useFileUpload } from '../context/FileUploadContext';
import { getCurrentUser } from '../auth/authUtils';
import UploadBox from '../components/UploadBox';
import FileList from '../components/FileList';
import StorageBar from '../components/StorageBar';

const Dashboard = () => {
    const { myFiles, storage, isLoading, deleteFile } = useFileUpload();
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        getCurrentUser().then(setUser);
    }, []);

    const handleAction = async (action, file) => {
        if (action === 'delete') {
            await deleteFile(file.fileId || file.id);
        } else if (action === 'download' || action === 'view') {
            if (file.url) window.open(file.url, '_blank');
            else alert('File URL not available');
        }
    };

    const stats = [
        { id: 1, label: 'Total Files', value: myFiles.length, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { id: 2, label: 'Active Folders', value: '24', icon: Folder, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
        { id: 3, label: 'Shared Items', value: '5', icon: Share2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' }
    ];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">
                        Hi, {user?.name?.split(' ')[0] || 'CloudSpace'}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-bold mt-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        You're using {((storage.used / storage.total) * 100).toFixed(1)}% of your secure cloud storage.
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                <div className="xl:col-span-8 space-y-10">
                    <UploadBox />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stats.map((stat, i) => (
                            <div key={i} className="bg-white dark:bg-[#0b0f1a] p-6 rounded-[2rem] border border-gray-200 dark:border-gray-800 flex items-center justify-between shadow-sm">
                                <div>
                                    <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                                    <p className="text-3xl font-black text-gray-900 dark:text-white">{stat.value}</p>
                                </div>
                                <div className={`p-4 rounded-2xl ${stat.bg}`}><stat.icon className={`w-6 h-6 ${stat.color}`} /></div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="xl:col-span-4 space-y-10">
                    <StorageBar used={storage.used} total={storage.total} />
                    <div className="bg-white dark:bg-[#0b0f1a] p-8 rounded-[3rem] border border-gray-200 dark:border-gray-800 space-y-6 shadow-sm">
                        <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Workspace Folders</h3>
                        <div className="grid gap-3">
                            {['Company Assets', 'Client Projects', 'Private Raw'].map((folder) => (
                                <div key={folder} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 rounded-2xl transition-all cursor-pointer group">
                                    <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl group-hover:scale-110 transition-transform"><Folder className="w-5 h-5 text-primary-600" /></div>
                                    <span className="text-sm font-black text-gray-700 dark:text-gray-200">{folder}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <section className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500/50 to-transparent rounded-full hidden lg:block" />
                <FileList files={myFiles} onAction={handleAction} isLoading={isLoading} />
            </section>
        </div>
    );
};

export default Dashboard;
