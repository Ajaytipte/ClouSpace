import React from 'react';
import { Database, TrendingUp, AlertCircle } from 'lucide-react';

const StorageBar = ({ used = 0, total = 15 * 1024 * 1024 * 1024 }) => {
    const percentage = Math.min((used / total) * 100, 100);
    const isCritical = percentage > 85;

    const formatSize = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    return (
        <div className="group bg-white dark:bg-[#0b0f1a] p-8 rounded-[3rem] border border-gray-200 dark:border-gray-800 space-y-6 relative overflow-hidden shadow-sm">
            {/* Background design glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 blur-[100px] opacity-10 transition-colors duration-1000 ${isCritical ? 'bg-red-500' : 'bg-primary-500'}`}></div>

            <div className="flex items-start justify-between relative z-10">
                <div className="space-y-1">
                    <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Storage Space</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-gray-900 dark:text-white transition-all group-hover:scale-105 inline-block">
                            {formatSize(used).split(' ')[0]}
                        </span>
                        <span className="text-lg font-bold text-gray-500">
                            {formatSize(used).split(' ')[1]} of {formatSize(total)}
                        </span>
                    </div>
                </div>
                <div className={`
                    p-4 rounded-[2rem] shadow-xl transition-all duration-500
                    ${isCritical ? 'bg-red-100 dark:bg-red-900/30 text-red-500' : 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'}
                `}>
                    <Database className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                </div>
            </div>

            <div className="space-y-3 relative z-10">
                <div className="h-4 w-full bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden p-1 shadow-inner border border-gray-100 dark:border-gray-800">
                    <div
                        className={`
                            h-full rounded-full transition-all duration-1000 ease-out relative
                            ${isCritical
                                ? 'bg-gradient-to-r from-red-500 via-pink-500 to-rose-600'
                                : 'bg-gradient-to-r from-primary-600 via-indigo-500 to-primary-400'
                            }
                        `}
                        style={{ width: `${percentage}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    <span className={isCritical ? 'text-red-500' : ''}>{percentage.toFixed(1)}% Used</span>
                    <span>{formatSize(total - used)} Remaining</span>
                </div>
            </div>

            {isCritical && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-2xl animate-in slide-in-from-top-4">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase">Storage almost full</span>
                    <TrendingUp className="w-3 h-3 ml-auto" />
                </div>
            )}

            <button className="w-full mt-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-95 shadow-lg">
                Upgrade Storage
            </button>
        </div>
    );
};

export default StorageBar;
