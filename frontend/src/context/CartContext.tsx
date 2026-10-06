import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '../types';
import { useToast } from './ToastContext';

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  taxAmount: number;
  total: number;
  activeBakeryId: number | null;
  activeBakeryName: string | null;
  maxLeadDays: number;
  addItem: (item: Omit<CartItem, 'id' | 'subtotal'>) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_STORAGE_KEY = 'wl_cart_items';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { success, info } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const activeBakeryId = items.length > 0 ? items[0].bakeryId : null;
  const activeBakeryName = items.length > 0 ? items[0].bakeryName : null;

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = Math.round(items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) * 100) / 100;
  const deliveryFee = items.length > 0 ? 80.00 : 0.00;
  const taxAmount = Math.round(subtotal * 0.05 * 100) / 100; // 5% GST
  const total = Math.round((subtotal + deliveryFee + taxAmount) * 100) / 100;

  const maxLeadDays = items.reduce((max, item) => Math.max(max, item.leadDays || 2), 2);

  const addItem = (itemData: Omit<CartItem, 'id' | 'subtotal'>) => {
    // If cart has items from a different bakery, prompt or replace to maintain single bakery order delivery
    if (activeBakeryId && activeBakeryId !== itemData.bakeryId) {
      if (
        !window.confirm(
          `Your cart currently contains items from "${activeBakeryName}". Adding this item will start a new cart for "${itemData.bakeryName}". Continue?`
        )
      ) {
        return;
      }
      const newItem: CartItem = {
        ...itemData,
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        subtotal: itemData.unitPrice * itemData.quantity,
      };
      setItems([newItem]);
      success(`Added "${itemData.cakeName}" to your fresh cart!`);
      return;
    }

    // Check if duplicate standard prebuilt item exists
    if (!itemData.isCustom && itemData.cakeId) {
      const existingIndex = items.findIndex((it) => it.cakeId === itemData.cakeId && !it.isCustom);
      if (existingIndex > -1) {
        setItems((prev) => {
          const updated = [...prev];
          const newQty = updated[existingIndex].quantity + itemData.quantity;
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newQty,
            subtotal: Math.round(updated[existingIndex].unitPrice * newQty * 100) / 100,
          };
          return updated;
        });
        success(`Updated "${itemData.cakeName}" quantity in your cart.`);
        return;
      }
    }

    const newItem: CartItem = {
      ...itemData,
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      subtotal: Math.round(itemData.unitPrice * itemData.quantity * 100) / 100,
    };

    setItems((prev) => [...prev, newItem]);
    success(`Added "${itemData.cakeName}" to your cart!`);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
              subtotal: Math.round(item.unitPrice * quantity * 100) / 100,
            }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    const item = items.find((i) => i.id === id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (item) {
      info(`Removed "${item.cakeName}" from cart.`);
    }
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        deliveryFee,
        taxAmount,
        total,
        activeBakeryId,
        activeBakeryName,
        maxLeadDays,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
