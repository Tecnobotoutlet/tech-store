import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';

// Crear el contexto
const CartContext = createContext();

// Tipos de acciones
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  TOGGLE_WISHLIST: 'TOGGLE_WISHLIST'
};

// Estado inicial
const initialState = {
  items: [],
  wishlist: [],
  total: 0,
  itemCount: 0
};

// Funciones utilitarias - MOVIDAS FUERA PARA EVITAR RE-CREACIÓN
const calculateTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const calculateItemCount = (items) => {
  return items.reduce((count, item) => count + item.quantity, 0);
};

// Reducer para manejar las acciones
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        // Si el producto ya existe, incrementar cantidad
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
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
        // Si es un producto nuevo, agregarlo
        const newItems = [...state.items, { ...action.payload, quantity: 1 }];
        return {
          ...state,
          items: newItems,
          total: calculateTotal(newItems),
          itemCount: calculateItemCount(newItems)
        };
      }
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
        itemCount: calculateItemCount(updatedItems)
      };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Si la cantidad es 0 o menos, remover el item
        const updatedItems = state.items.filter(item => item.id !== id);
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems),
          itemCount: calculateItemCount(updatedItems)
        };
      }

      const updatedItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
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

  // Cargar datos del localStorage al iniciar - SOLO UNA VEZ
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
    
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        cartData.items.forEach(item => {
          for (let i = 0; i < item.quantity; i++) {
            dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: item });
          }
        });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }

    if (savedWishlist) {
      try {
        const wishlistData = JSON.parse(savedWishlist);
        wishlistData.forEach(item => {
          dispatch({ type: CART_ACTIONS.TOGGLE_WISHLIST, payload: item });
        });
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      }
    }
  }, []); // Sin dependencias - solo se ejecuta una vez

  // Guardar en localStorage cuando cambie el estado - OPTIMIZADO
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify({
      items: state.items,
      total: state.total,
      itemCount: state.itemCount
    }));
  }, [state.items, state.total, state.itemCount]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
  }, [state.wishlist]);

  // Funciones para las acciones - MEMOIZADAS
  const addToCart = useCallback((product) => {
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: product });
  }, []);

  const removeFromCart = useCallback((productId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: productId });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { id: productId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  }, []);

  const toggleWishlist = useCallback((product) => {
    dispatch({ type: CART_ACTIONS.TOGGLE_WISHLIST, payload: product });
  }, []);

  const isInWishlist = useCallback((productId) => {
    return state.wishlist.some(item => item.id === productId);
  }, [state.wishlist]);

  // CRÍTICO: Memoizar el objeto value para evitar re-renders
  const value = useMemo(() => ({
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleWishlist,
    isInWishlist
  }), [
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleWishlist,
    isInWishlist
  ]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
