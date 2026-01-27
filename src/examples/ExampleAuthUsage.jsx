/**
 * Example Usage of AWS Cognito Authentication
 * 
 * This file demonstrates how to use the authentication system
 * in your components throughout the application.
 */

import React, { useEffect, useState } from 'react';
import { getCurrentUser, getToken, isAuthenticated } from '../auth/authUtils';

const ExampleAuthComponent = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            // Method 1: Get full user object with all details
            const userData = await getCurrentUser();
            setUser(userData);

            console.log('User ID:', userData.userId);
            console.log('Email:', userData.email);
            console.log('Name:', userData.name);
            console.log('Email Verified:', userData.emailVerified);
            console.log('ID Token:', userData.tokens.idToken);
            console.log('Access Token:', userData.tokens.accessToken);
        } catch (error) {
            console.error('User not authenticated:', error);
        } finally {
            setLoading(false);
        }
    };

    // Method 2: Just get the token for API calls
    const makeAuthenticatedAPICall = async () => {
        const token = getToken();

        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await fetch('https://your-api.com/endpoint', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            console.log('API Response:', data);
        } catch (error) {
            console.error('API Error:', error);
        }
    };

    // Method 3: Check if user is authenticated
    const checkAuth = async () => {
        const authenticated = await isAuthenticated();

        if (authenticated) {
            console.log('User is authenticated');
        } else {
            console.log('User is NOT authenticated');
        }
    };

    if (loading) {
        return <div>Loading user data...</div>;
    }

    if (!user) {
        return <div>User not authenticated</div>;
    }

    return (
        <div className="p-6 glass rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Current User Info</h2>

            <div className="space-y-3">
                <div>
                    <label className="text-sm font-semibold text-slate-600">User ID:</label>
                    <p className="text-slate-900">{user.userId}</p>
                </div>

                <div>
                    <label className="text-sm font-semibold text-slate-600">Email:</label>
                    <p className="text-slate-900">{user.email}</p>
                </div>

                <div>
                    <label className="text-sm font-semibold text-slate-600">Name:</label>
                    <p className="text-slate-900">{user.name}</p>
                </div>

                <div>
                    <label className="text-sm font-semibold text-slate-600">Email Verified:</label>
                    <p className="text-slate-900">{user.emailVerified ? 'Yes' : 'No'}</p>
                </div>
            </div>

            <div className="mt-6 flex gap-3">
                <button
                    onClick={makeAuthenticatedAPICall}
                    className="btn-primary px-4 py-2 rounded-lg"
                >
                    Test API Call
                </button>

                <button
                    onClick={checkAuth}
                    className="btn-secondary px-4 py-2 rounded-lg"
                >
                    Check Auth Status
                </button>
            </div>
        </div>
    );
};

export default ExampleAuthComponent;

/**
 * HOW TO USE IN YOUR COMPONENTS:
 * 
 * 1. Import the auth utilities:
 *    import { getCurrentUser, getToken, isAuthenticated, signOutUser } from './auth/authUtils';
 * 
 * 2. Get current user:
 *    const user = await getCurrentUser();
 * 
 * 3. Get token for API calls:
 *    const token = getToken();
 *    fetch('/api/endpoint', {
 *      headers: { 'Authorization': `Bearer ${token}` }
 *    });
 * 
 * 4. Check authentication status:
 *    const authenticated = await isAuthenticated();
 * 
 * 5. Sign out:
 *    await signOutUser();
 *    navigate('/login');
 */
