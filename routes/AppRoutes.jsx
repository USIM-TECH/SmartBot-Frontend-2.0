import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Import features
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage';
import VerificationPage from '../features/auth/VerificationPage';
import ResetPasswordPage from '../features/auth/ResetPasswordPage';
import StoreSelectionPage from '../features/onboarding/StoreSelectionPage';
import ChatDashboard from '../features/chat/ChatDashboard';


const AppRoutes = ({
  isAuthenticated,
  setIsAuthenticated,
  hasSelectedStores,
  selectedStoreIds,
  setSelectedStoreIds,
}) => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage onLogin={() => setIsAuthenticated(true)} />} />
      <Route path="/register" element={<RegisterPage onRegister={() => setIsAuthenticated(true)} />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-code" element={<VerificationPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      
      {/* Protected Routes - Authenticated only */}
      <Route element={<ProtectedRoute isAllowed={isAuthenticated} redirectTo="/login" />}>
        <Route 
          path="/onboarding" 
          element={
            <StoreSelectionPage 
              onComplete={() => {}} 
              selectedIds={selectedStoreIds}
              setSelectedIds={setSelectedStoreIds}
              onLogout={() => setIsAuthenticated(false)}
            />
          } 
        />
        
        {/* Nested Protected Route - Authenticated AND selected stores */}
        <Route element={<ProtectedRoute isAllowed={hasSelectedStores} redirectTo="/onboarding" />}>
          <Route 
            path="/chat" 
            element={
              <ChatDashboard 
                selectedStoreIds={selectedStoreIds} 
                onLogout={() => setIsAuthenticated(false)}
              />
            } 
          />
        </Route>
      </Route>

      {/* Root redirection */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
