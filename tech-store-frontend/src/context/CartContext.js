// src/context/CartContext.js - Versión Completa con Soporte de Variantes

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';

// Crear el contexto
const CartContext = createContext();

// Tipos de acciones
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  TOGGLE_WISHLIST: 'TOGGLE_WISHLIST',
  LOAD_CART: 'LOAD_CART'
};

// Estado inicial
const initialState = {
  items: [],
  wishlist: [],
  total: 0,
  itemCount: 0
};

// Función para generar un ID único para items con variantes
const generateCartId = (productId, variants = []) => {
  if (!variants || variants.length === 0) {
    return `${productId}`;
  }
  
  // Ordenar variantes por tipo para consistencia
  const sortedVariants = [...variants].sort((a, b) => a.type.localeCompare(b.type));
  const variantString = sortedVariants.map(v => `${v.type}:${v.value}`).join('|');
  return `${productId}-${variantString}`;
};

// Funciones utilitarias - MOVIDAS FUERA PARA EVITAR RE-CREACIÓN
const calculateTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const calculateItemCount = (items) => {
  return items.reduce((count, item) => count + item.quantity, 0);
};

// Reducer para manejar las acciones con soporte de variantes
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.LOAD_CART: {
      const loadedItems = action.payload.items || [];
      return {
        ...state,
        items: loadedItems,
        total: calculateTotal(loadedItems),
        itemCount: calculateItemCount(loadedItems)
      };
    }

    case CART_ACTIONS.ADD_ITEM: {
      const { selectedVariants, ...product } = action.payload;
      const cartId = generateCartId(product.id, selectedVariants);
      
      const existingItem = state.items.find(item => item.cartId === cartId);
      
      if (existingItem) {
        // Si el producto con estas variantes ya existe, incrementar cantidad
        const updatedItems = state.items.map(item =>
          item.cartId === cartId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems),
          itemCount: calculateItemCount(updatedItems)
        };
      } else {
        // Si es un producto nuevo o con diferentes variantes, agregarlo
        const newItem = {
          ...product,
          cartId,
          selectedVariants: selectedVariants || [],
          quantity: 1,
          addedAt: new Date().toISOString()
        };
        const newItems = [...state.items, newItem];
        return {
          ...state,
          items: newItems,
          total: calculateTotal(newItems),
          itemCount: calculateItemCount(newItems)
        };
      }
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      const updatedItems = state.items.filter(item => item.cartId !== action.payload);
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
        itemCount: calculateItemCount(updatedItems)
      };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { cartId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Si la cantidad es 0 o menos, remover el item
        const updatedItems = state.items.filter(item => item.cartId !== cartId);
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems),
          itemCount: calculateItemCount(updatedItems)
        };
      }

      const updatedItems = state.items.map(item =>
        item.cartId === cartId ? { ...item, quantity } : item
      );
      
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
        itemCount: calculateItemCount(updatedItems)
      };
    }

    case CART_ACTIONS.CLEAR_CART: {
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0
      };
    }

    case CART_ACTIONS.TOGGLE_WISHLIST: {
      const isInWishlist = state.wishlist.some(item => item.id === action.payload.id);
      
      if (isInWishlist) {
        return {
          ...state,
          wishlist: state.wishlist.filter(item => item.id !== action.payload.id)
        };
      } else {
        return {
          ...state,
          wishlist: [...state.wishlist, action.payload]
        };
      }
    }

    default:
      return state;
  }
};

// Hook personalizado para usar el contexto
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
};

// Proveedor del contexto
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Cargar datos del localStorage al iniciar - SOLO UNA VEZ
  useEffect(() => {
    if (isInitialized) return;
    
    try {
      const savedCart = localStorage.getItem('cart');
      const savedWishlist = localStorage.getItem('wishlist');
      
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        if (cartData.items && Array.isArray(cartData.items)) {
          dispatch({ 
            type: CART_ACTIONS.LOAD_CART, 
            payload: { items: cartData.items } 
          });
        }
      }

      if (savedWishlist) {
        const wishlistData = JSON.parse(savedWishlist);
        if (Array.isArray(wishlistData)) {
          wishlistData.forEach(item => {
            dispatch({ type: CART_ACTIONS.TOGGLE_WISHLIST, payload: item });
          });
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    } finally {
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Guardar en localStorage cuando cambie el estado - OPTIMIZADO
  useEffect(() => {
    if (!isInitialized) return;
    
    try {
      localStorage.setItem('cart', JSON.stringify({
        items: state.items,
        total: state.total,
        itemCount: state.itemCount,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [state.items, state.total, state.itemCount, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    
    try {
      localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }, [state.wishlist, isInitialized]);

  // Funciones para las acciones - MEMOIZADAS
  const addToCart = useCallback((product) => {
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: product });
  }, []);

  const removeFromCart = useCallback((cartId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: cartId });
  }, []);

  const updateQuantity = useCallback((cartId, quantity) => {
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { cartId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      dispatch({ type: CART_ACTIONS.CLEAR_CART });
    }
  }, []);

  const toggleWishlist = useCallback((product) => {
    dispatch({ type: CART_ACTIONS.TOGGLE_WISHLIST, payload: product });
  }, []);

  const isInWishlist = useCallback((productId) => {
    return state.wishlist.some(item => item.id === productId);
  }, [state.wishlist]);

  // Función adicional para obtener items del carrito por producto
  const getCartItemsByProduct = useCallback((productId) => {
    return state.items.filter(item => item.id === productId);
  }, [state.items]);

  // Función para obtener el total de un producto específico en el carrito
  const getProductQuantityInCart = useCallback((productId) => {
    return state.items
      .filter(item => item.id === productId)
      .reduce((total, item) => total + item.quantity, 0);
  }, [state.items]);

  // Función para verificar si una variante específica está en el carrito
  const isVariantInCart = useCallback((productId, variants) => {
    const cartId = generateCartId(productId, variants);
    return state.items.some(item => item.cartId === cartId);
  }, [state.items]);

  // CRÍTICO: Memoizar el objeto value para evitar re-renders
  const value = useMemo(() => ({
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleWishlist,
    isInWishlist,
    getCartItemsByProduct,
    getProductQuantityInCart,
    isVariantInCart,
    isInitialized
  }), [
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleWishlist,
    isInWishlist,
    getCartItemsByProduct,
    getProductQuantityInCart,
    isVariantInCart,
    isInitialized
  ]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
