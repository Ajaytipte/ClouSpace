import React, { useState, useEffect, useCallback } from 'react';
import { User, Mail, Shield, Camera, Save, ArrowLeft, Key, Smartphone, Globe, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../auth/authUtils';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        bio: 'Legal professional and tech enthusiast.',
        location: 'Mumbai, India',
        language: 'English (US)',
        avatar: null
    });
    const navigate = useNavigate();
    const fileInputRef = React.useRef(null);

    const loadProfile = useCallback(async () => {
        try {
            setIsLoading(true);
            const userData = await getCurrentUser();
            if (userData) {
                setUser(userData);
                setFormData(prev => ({
                    ...prev,
                    name: userData.name || '',
                    email: userData.email || '',
                    phoneNumber: userData.phoneNumber || '+91 98765 43210'
                }));
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, avatar: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        // Simulate API call to update profile in Cognito or DynamoDB
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert('Profile saved successfully!');
        } catch (error) {
            alert('Failed to save profile');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Loading Profile...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/')}
                        className="p-4 bg-white dark:bg-gray-900 shadow-xl rounded-[1.5rem] hover:scale-110 active:scale-95 transition-all text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-800"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">My Account</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-bold mt-1">Configure your personal cloud presence.</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Statistics & Identity Card */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white dark:bg-[#0b0f1a] p-10 rounded-[3.5rem] border border-gray-200 dark:border-gray-800 text-center relative overflow-hidden group shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                        <div className="relative inline-block mb-8">
                            <div className="absolute inset-0 bg-primary-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <img
                                src={formData.avatar || user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`}
                                alt="User Avatar"
                                className="w-40 h-40 rounded-[3rem] object-cover border-8 border-white dark:border-gray-950 shadow-2xl relative z-10 transition-transform group-hover:scale-105 duration-500"
                            />
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleAvatarChange}
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute -bottom-2 -right-2 p-4 bg-primary-600 text-white rounded-[1.5rem] shadow-2xl hover:bg-primary-700 transition-all active:scale-90 z-20 border-4 border-white dark:border-gray-950"
                            >
                                <Camera className="w-6 h-6" />
                            </button>
                        </div>

                        <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">{formData.name || 'User'}</h2>
                        <p className="text-sm font-bold text-primary-600 dark:text-primary-400 mt-2">{formData.email}</p>

                        <div className="grid grid-cols-2 gap-4 mt-10 pt-10 border-t border-gray-100 dark:border-gray-800">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">Total Files</p>
                                <p className="text-2xl font-black text-gray-900 dark:text-white">124</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">Membership</p>
                                <p className="text-2xl font-black text-primary-600">PRO</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#0b0f1a] p-8 rounded-[2.5rem] border border-gray-200 dark:border-gray-800 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-2xl">
                                <Shield className="w-5 h-5 text-amber-500" />
                            </div>
                            <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Security Overview</h3>
                        </div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 leading-relaxed">Your account is currently protected by Multi-Factor Authentication.</p>
                        <button type="button" className="w-full py-4 border border-gray-200 dark:border-gray-800 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                            Manage Security
                        </button>
                    </div>
                </div>

                {/* Main Identity Form */}
                <div className="lg:col-span-8">
                    <form onSubmit={handleSave} className="bg-white dark:bg-[#0b0f1a] p-12 rounded-[3.5rem] border border-gray-200 dark:border-gray-800 space-y-10 relative shadow-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] ml-2">Full Legal Name</label>
                                <div className="relative group">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-primary-500 transition-colors" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter your name"
                                        className="w-full bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-100 dark:border-gray-800 rounded-[1.5rem] py-5 pl-14 pr-6 focus:border-primary-500 transition-all outline-none font-bold text-gray-800 dark:text-white text-lg"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] ml-2">Primary Email</label>
                                <div className="relative group opacity-50">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        readOnly
                                        disabled
                                        className="w-full bg-gray-200 dark:bg-gray-800 border-2 border-transparent rounded-[1.5rem] py-5 pl-14 pr-6 cursor-not-allowed font-bold text-gray-600 dark:text-gray-400 text-lg"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] ml-2">Phone Identifier</label>
                                <div className="relative group">
                                    <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-primary-500 transition-colors" />
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        placeholder="+91 00000 00000"
                                        className="w-full bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-100 dark:border-gray-800 rounded-[1.5rem] py-5 pl-14 pr-6 focus:border-primary-500 transition-all outline-none font-bold text-gray-800 dark:text-white text-lg"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] ml-2">Display Language</label>
                                <div className="relative group">
                                    <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-primary-500 transition-colors" />
                                    <select
                                        name="language"
                                        value={formData.language}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-100 dark:border-gray-800 rounded-[1.5rem] py-5 pl-14 pr-6 focus:border-primary-500 transition-all outline-none font-bold text-gray-800 dark:text-white text-lg appearance-none"
                                    >
                                        <option value="English (US)">English (US)</option>
                                        <option value="English (UK)">English (UK)</option>
                                        <option value="Marathi">Marathi</option>
                                        <option value="Hindi">Hindi</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] ml-2">Personal Biography</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                rows={4}
                                placeholder="Tell us about yourself..."
                                className="w-full bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-100 dark:border-gray-800 rounded-[2rem] p-6 focus:border-primary-500 transition-all outline-none font-bold text-gray-800 dark:text-white text-lg resize-none"
                            ></textarea>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 pt-10 border-t border-gray-100 dark:border-gray-800">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex-1 px-10 py-6 bg-primary-600 hover:bg-primary-700 text-white rounded-[2rem] shadow-2xl shadow-primary-500/40 transition-all active:scale-95 font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5 text-white/50" />
                                        Update Profile
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                className="px-10 py-6 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-3"
                            >
                                <Key className="w-5 h-5 text-gray-300" />
                                Secure Pass
                            </button>
                        </div>

                        <div className="absolute top-6 right-10 flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest bg-gray-50 dark:bg-gray-900 px-4 py-2 rounded-full border border-gray-100 dark:border-gray-800">
                            <Info className="w-3 h-3" />
                            Cloud Identity
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
