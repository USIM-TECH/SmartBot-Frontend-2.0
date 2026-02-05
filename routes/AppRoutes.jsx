import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Import features
import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";
import ForgotPasswordPage from "../features/auth/ForgotPasswordPage";
import StoreSelectionPage from "../features/onboarding/StoreSelectionPage";
import ChatDashboard from "../features/chat/ChatDashboard";

import { useAuth } from "../context/AuthContext";
import authService from "../services/authService";

const AppRoutes = ({
  hasSelectedStores,
  selectedStoreIds,
  setSelectedStoreIds,
}) => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage onLogin={() => {}} />} />
      <Route
        path="/register"
        element={<RegisterPage onRegister={() => {}} />}
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected Routes - Authenticated only */}
      <Route
        element={
          <ProtectedRoute isAllowed={isAuthenticated} redirectTo="/login" />
        }
      >
        <Route
          path="/onboarding"
          element={
            <StoreSelectionPage
              onComplete={() => {}}
              selectedIds={selectedStoreIds}
              setSelectedIds={setSelectedStoreIds}
              onLogout={() => authService.logout()}
            />
          }
        />

        {/* Nested Protected Route - Authenticated AND selected stores */}
        <Route
          element={
            <ProtectedRoute
              isAllowed={hasSelectedStores}
              redirectTo="/onboarding"
            />
          }
        >
          <Route
            path="/chat"
            element={
              <ChatDashboard
                selectedStoreIds={selectedStoreIds}
                onLogout={() => authService.logout()}
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
