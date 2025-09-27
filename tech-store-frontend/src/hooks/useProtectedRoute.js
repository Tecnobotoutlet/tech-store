// src/hooks/useProtectedRoute.js
import { useAuth } from '../context/AuthContext';

export const useProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  const requireAuth = (callback, showAuthModal) => {
    if (loading) return false;
    
    if (!isAuthenticated) {
      if (showAuthModal) {
        showAuthModal();
      }
      return false;
    }
    
    if (callback) callback();
    return true;
  };

  return {
    isAuthenticated,
    loading,
    requireAuth
  };
};