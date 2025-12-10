import { useState, useCallback } from 'react';
import { CartState, CartItem, Drink } from '../types';

export function useCart() {
  const [cart, setCart] = useState<CartState>({
    items: [],
    total: 0,
    isOpen: false
  });

  const calculateTotal = useCallback((items: CartItem[]) => {
    return items.reduce((sum, item) => sum + (item.drink.price * item.quantity), 0);
  }, []);

  const addToCart = useCallback((drink: Drink) => {
    setCart(prevCart => {
      const existingItem = prevCart.items.find(item => item.drink.id === drink.id);
      
      let newItems: CartItem[];
      if (existingItem) {
        newItems = prevCart.items.map(item =>
          item.drink.id === drink.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...prevCart.items, { drink, quantity: 1 }];
      }

      return {
        ...prevCart,
        items: newItems,
        total: calculateTotal(newItems)
      };
    });
  }, [calculateTotal]);

  const updateQuantity = useCallback((drinkId: string, quantity: number) => {
    setCart(prevCart => {
      let newItems: CartItem[];
      
      if (quantity === 0) {
        newItems = prevCart.items.filter(item => item.drink.id !== drinkId);
      } else {
        newItems = prevCart.items.map(item =>
          item.drink.id === drinkId
            ? { ...item, quantity }
            : item
        );
      }

      return {
        ...prevCart,
        items: newItems,
        total: calculateTotal(newItems)
      };
    });
  }, [calculateTotal]);

  const removeItem = useCallback((drinkId: string) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.drink.id !== drinkId);
      
      return {
        ...prevCart,
        items: newItems,
        total: calculateTotal(newItems)
      };
    });
  }, [calculateTotal]);

  const toggleCart = useCallback(() => {
    setCart(prevCart => ({
      ...prevCart,
      isOpen: !prevCart.isOpen
    }));
  }, []);

  const clearCart = useCallback(() => {
    setCart({
      items: [],
      total: 0,
      isOpen: false
    });
  }, []);

  return {
    cart,
    addToCart,
    updateQuantity,
    removeItem,
    toggleCart,
    clearCart
  };
}