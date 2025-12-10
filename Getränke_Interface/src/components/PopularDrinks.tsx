import React from 'react';
import { ScrollArea } from './ui/scroll-area';
import { DrinkCard } from './DrinkCard';
import { Drink, QuickOrderItem } from '../types';

interface PopularDrinksProps {
  drinks: Drink[];
  onAddToCart?: (drink: Drink) => void;
  onQuickOrder?: (drink: Drink) => void;
  onQuickRemove?: (drink: Drink) => void;
  showQuickOrder?: boolean;
  quickOrderItems?: QuickOrderItem[];
}

export function PopularDrinks({ 
  drinks, 
  onAddToCart, 
  onQuickOrder, 
  onQuickRemove,
  showQuickOrder = false,
  quickOrderItems = []
}: PopularDrinksProps) {
  const popularDrinks = drinks.filter(drink => drink.isPopular).slice(0, 6);

  const getQuickOrderQuantity = (drinkId: string) => {
    const item = quickOrderItems.find(item => item.drink.id === drinkId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Beliebte Getränke</h2>
      
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-2">
          {popularDrinks.map((drink) => (
            <DrinkCard
              key={drink.id}
              drink={drink}
              onAddToCart={onAddToCart}
              onQuickOrder={onQuickOrder}
              onQuickRemove={onQuickRemove}
              showQuickOrder={showQuickOrder}
              quickOrderQuantity={getQuickOrderQuantity(drink.id)}
              className="w-40 flex-shrink-0"
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}