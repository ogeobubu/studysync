import { Routes, Route } from 'react-router-dom';
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
import StudentRoutes from './StudentRoutes';

import ChatListPage from '../pages/chat/ChatListPage';
import ChatWindowPage from '../pages/chat/ChatWindowPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify" element={<VerifyEmailPage />} />
        <Route path="/resend-verification" element={<ResendVerifyPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/student/*" element={<StudentRoutes />} />
      </Route>

      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Route>

      <Route element={<ProtectedRoute><ChatLayout /></ProtectedRoute>}>
        <Route path="/chats" element={<ChatListPage />} />
        <Route path="/chats/:chatId" element={<ChatWindowPage />} />
      </Route>
    </Routes>
  );
}