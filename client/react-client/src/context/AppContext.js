import React, { createContext, useContext, useState, useEffect } from 'react';
import { getGuestCartItemsCount, mergeGuestCartToUser } from '../utils/guestCart';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe usarse dentro de AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  // Obtener usuario del localStorage al cargar
  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');
    
    if (userData && token) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        // Cargar cantidad de items del carrito
        if (parsedUser.id) {
          loadCartItemsCount(parsedUser.id);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        clearAuth();
      }
    }
  }, []);

  // Función para actualizar contador del carrito invitado
  const updateGuestCartCount = () => {
    const count = getGuestCartItemsCount();
    setCartItemsCount(count);
  };

  // Función para cargar cantidad de items del carrito
  const loadCartItemsCount = async (usuarioId) => {
    try {
      const { carritoAPI } = await import('../services/api');
      const response = await carritoAPI.obtener(usuarioId);
      const carrito = response.data;
      const count = carrito?.items?.length || 0;
      setCartItemsCount(count);
    } catch (error) {
      console.error('Error al cargar carrito:', error);
      setCartItemsCount(0);
    }
  };

  // Función para actualizar cantidad del carrito
  const updateCartItemsCount = (count) => {
    setCartItemsCount(count);
  };

  // Función para refrescar cantidad del carrito
  const refreshCart = async () => {
    if (user?.id) {
      await loadCartItemsCount(user.id);
    } else {
      updateGuestCartCount();
    }
  };

  // Función para limpiar autenticación
  const clearAuth = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setCartItemsCount(0);
  };

  // Función para establecer usuario autenticado y fusionar carrito
  const setAuthenticatedUser = async (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    
    if (userData.id) {
      try {
        // Fusionar carrito invitado con carrito del usuario
        const { carritoAPI } = await import('../services/api');
        await mergeGuestCartToUser(userData.id, carritoAPI);
        
        // Cargar cantidad actualizada del carrito
        await loadCartItemsCount(userData.id);
      } catch (error) {
        console.error('Error al fusionar carrito:', error);
        // Continuar aunque falle la fusión
        await loadCartItemsCount(userData.id);
      }
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    cartItemsCount,
    setLoading,
    setError,
    setAuthenticatedUser,
    clearAuth,
    updateCartItemsCount,
    refreshCart,
    updateGuestCartCount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

