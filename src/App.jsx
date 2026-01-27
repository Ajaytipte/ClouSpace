import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { FileUploadProvider } from './context/FileUploadContext';
import DashboardLayout from './layouts/DashboardLayout';

// Import AWS Configuration
import './aws-config';

// Auth Components
import Login from './auth/Login';
import Signup from './auth/Signup';
import ProtectedRoute from './auth/ProtectedRoute';

// Pages
import Dashboard from './pages/Dashboard';

// Lazy load other pages for performance
const MyFiles = lazy(() => import('./pages/MyFiles'));
const Recent = lazy(() => import('./pages/Recent'));
const Trash = lazy(() => import('./pages/Trash'));
const BuyStorage = lazy(() => import('./pages/BuyStorage'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  return (
    <ThemeProvider>
      <FileUploadProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Dashboard Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="my-files" element={
                <Suspense fallback={<PageLoader />}>
                  <MyFiles />
                </Suspense>
              } />
              <Route path="recent" element={
                <Suspense fallback={<PageLoader />}>
                  <Recent />
                </Suspense>
              } />
              <Route path="trash" element={
                <Suspense fallback={<PageLoader />}>
                  <Trash />
                </Suspense>
              } />
              <Route path="buy-storage" element={
                <Suspense fallback={<PageLoader />}>
                  <BuyStorage />
                </Suspense>
              } />
              <Route path="profile" element={
                <Suspense fallback={<PageLoader />}>
                  <Profile />
                </Suspense>
              } />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </FileUploadProvider>
    </ThemeProvider>
  );
}

const PageLoader = () => (
  <div className="w-full h-[60vh] flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default App;
