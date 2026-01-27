import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            // Check if token exists in localStorage
            const token = localStorage.getItem('cloudspace_token');

            if (!token) {
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
            }

            // Verify with AWS Cognito
            const session = await fetchAuthSession();
            const user = await getCurrentUser();

            if (session.tokens && user) {
                // Update token in localStorage if needed
                const idToken = session.tokens.idToken.toString();
                localStorage.setItem('cloudspace_token', idToken);
                setIsAuthenticated(true);
            } else {
                localStorage.removeItem('cloudspace_token');
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Auth check error:', error);
            localStorage.removeItem('cloudspace_token');
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500 dark:text-slate-400">Verifying authentication...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
