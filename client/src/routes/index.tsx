
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import RegisterPage from '../pages/auth/RegisterPage';
import VerifyEmailPage from '../pages/auth/VerifyEmailPage';
import ResendVerifyPage from '../pages/auth/ResendVerifyPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import LoginPage from '../pages/auth/LoginPage';

import ProtectedRoute from '../components/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import ChatLayout from '../layouts/ChatLayout';

import AdminRoutes from './AdminRoutes';
import AdvisorRoutes from './AdvisorRoutes';
import StudentRoutes from './StudentRoutes';

import ChatListPage from '../pages/chat/ChatListPage';
import ChatWindowPage from '../pages/chat/ChatWindowPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify" element={<VerifyEmailPage />} />
        <Route path="/resend-verification" element={<ResendVerifyPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected Routes with Main Layout */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/student/*" element={<StudentRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/advisor/*" element={<AdvisorRoutes />} />
      </Route>

      {/* Chat Routes with Chat Layout */}
      <Route element={<ProtectedRoute><ChatLayout /></ProtectedRoute>}>
        <Route path="/chats" element={<ChatListPage />} />
        <Route path="/chats/:chatId" element={<ChatWindowPage />} />
      </Route>

      {/* Unauthorized route */}
      <Route path="/unauthorized" element={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
            <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
            <a href="/login" className="text-blue-600 hover:underline">Return to Login</a>
          </div>
        </div>
      } />

      {/* 404 route */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
            <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
            <a href="/login" className="text-blue-600 hover:underline">Return to Login</a>
          </div>
        </div>
      } />
    </Routes>
  );
}