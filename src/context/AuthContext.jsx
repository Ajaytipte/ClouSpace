import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // In a real app, you'd verify the token with an API call
            // For now, we'll assume the token is valid if it exists
            const savedUser = JSON.parse(localStorage.getItem('user'));
            setUser(savedUser);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            // Mock API call
            // const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, { email, password });

            // Simulating response
            const mockResponse = {
                data: {
                    token: 'mock-jwt-token',
                    user: { id: '1', name: 'John Doe', email, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' }
                }
            };

            const { token, user } = mockResponse.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Login failed' };
        }
    };

    const signup = async (name, email, password) => {
        try {
            // Mock API call
            // await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/signup`, { name, email, password });

            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Signup failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
