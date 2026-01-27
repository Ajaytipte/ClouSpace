import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Cloud, Mail, Lock, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { signIn } from 'aws-amplify/auth';
import { useTheme } from '../context/ThemeContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const { isSignedIn, nextStep } = await signIn({
                username: email,
                password: password,
            });

            if (isSignedIn) {
                // Get the JWT token and store it
                const { tokens } = await getCurrentSession();
                const idToken = tokens.idToken.toString();
                localStorage.setItem('cloudspace_token', idToken);

                setSuccess('Login successful! Redirecting...');
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } else {
                // Handle additional authentication steps if needed
                if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
                    setError('Please verify your email before signing in.');
                } else if (nextStep.signInStep === 'RESET_PASSWORD') {
                    setError('You need to reset your password.');
                } else {
                    setError('Additional authentication step required: ' + nextStep.signInStep);
                }
            }
        } catch (err) {
            console.error('Login error:', err);

            // User-friendly error messages
            if (err.name === 'UserNotFoundException') {
                setError('No account found with this email.');
            } else if (err.name === 'NotAuthorizedException') {
                setError('Incorrect email or password.');
            } else if (err.name === 'UserNotConfirmedException') {
                setError('Please verify your email before signing in.');
            } else if (err.name === 'InvalidParameterException') {
                setError('Please check your email and password format.');
            } else {
                setError(err.message || 'Login failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Helper function to get current session
    const getCurrentSession = async () => {
        const { fetchAuthSession } = await import('aws-amplify/auth');
        return await fetchAuthSession();
    };

    const { theme } = useTheme();
    const bgClass = theme === 'dark' ? 'bg-[#0b0f1a]' : 'bg-gray-50';

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${bgClass} relative overflow-hidden`}>
            {/* Background blobs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-primary-600 rounded-2xl shadow-xl shadow-primary-500/30 mb-4">
                        <Cloud className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">CloudSpace</h1>
                    <p className="text-slate-500 mt-2">Welcome back! Please enter your details.</p>
                </div>

                <div className="glass p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-900/30 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm rounded-xl border border-green-100 dark:border-green-900/30 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span>{success}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-slate-900 dark:text-slate-100"
                                    placeholder="name@company.com"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                                <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-slate-900 dark:text-slate-100"
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary py-3 rounded-xl shadow-lg shadow-primary-500/30 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span>{isLoading ? 'Signing in...' : 'Sign in'}</span>
                            {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-slate-500">
                            Protected by AWS Cognito Authentication
                        </p>
                    </div>
                </div>

                <p className="text-center mt-8 text-slate-500 text-sm">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-primary-600 font-semibold hover:text-primary-700">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
