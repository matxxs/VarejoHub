"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, useData } from './DataContext';
import { generateId, getFromStorage, saveToStorage } from './utils';

// Types
export interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  items: CartItem[];
  clientId?: string;
  clientName?: string;
  operatorId?: string;
  operatorName?: string;
  total: number;
  dateTime: string;
}

// Storage keys
const STORAGE_KEYS = {
  cart: 'vh_cart',
  sales: 'vh_sales',
};

// Context type
export interface SalesContextType {
  cart: CartItem[];
  sales: Sale[];
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  checkout: (clientId?: string, operatorId?: string) => Sale | null;
  cartTotal: number;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Get data for client/employee names
  const { clients, employees } = useData();

  // Load from localStorage on mount
  useEffect(() => {
    setCart(getFromStorage<CartItem[]>(STORAGE_KEYS.cart, []));
    setSales(getFromStorage<Sale[]>(STORAGE_KEYS.sales, []));
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage when changed
  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.cart, cart);
    }
  }, [cart, isLoaded]);

  // Save sales to localStorage when changed
  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.sales, sales);
    }
  }, [sales, isLoaded]);

  // Calculate cart total
  const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);

  // Add product to cart
  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.productId === product.id);
      
      if (existingIndex >= 0) {
        // Update existing item
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          subtotal: newQty * updated[existingIndex].unitPrice,
        };
        return updated;
      }
      
      // Add new item
      const newItem: CartItem = {
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice: product.price,
        subtotal: quantity * product.price,
      };
      return [...prev, newItem];
    });
  }, []);

  // Update quantity of item in cart
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.productId !== productId));
      return;
    }
    
    setCart(prev => {
      const index = prev.findIndex(item => item.productId === productId);
      if (index === -1) return prev;
      
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        quantity,
        subtotal: quantity * updated[index].unitPrice,
      };
      return updated;
    });
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  }, []);

  // Clear cart
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Checkout
  const checkout = useCallback((clientId?: string, operatorId?: string): Sale | null => {
    if (cart.length === 0) {
      return null;
    }

    const client = clientId ? clients.find(c => c.id === clientId) : undefined;
    const operator = operatorId ? employees.find(e => e.id === operatorId) : undefined;

    const sale: Sale = {
      id: generateId(),
      items: [...cart],
      clientId,
      clientName: client?.name,
      operatorId,
      operatorName: operator?.name,
      total: cartTotal,
      dateTime: new Date().toISOString(),
    };

    setSales(prev => [sale, ...prev]);
    setCart([]);

    return sale;
  }, [cart, cartTotal, clients, employees]);

  return (
    <SalesContext.Provider
      value={{
        cart,
        sales,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        checkout,
        cartTotal,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = (): SalesContextType => {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
};
