import React from 'react';
import { Check, ShoppingBasket } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { QuickOrderItem } from '../types';

interface QuickOrderButtonProps {
  items: QuickOrderItem[];
  total: number;
  onConfirm: () => void;
}

export function QuickOrderButton({ items, total, onConfirm }: QuickOrderButtonProps) {
  if (items.length === 0) return null;

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Button
        onClick={onConfirm}
        size="lg"
        className="h-14 px-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl border-2 border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingBasket className="w-5 h-5" />
            <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs bg-secondary text-secondary-foreground border-2 border-white">
              {totalItems}
            </Badge>
          </div>
          
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">Bestellen</span>
            <span className="text-xs opacity-90">{total.toFixed(2)}€</span>
          </div>
          
          <Check className="w-4 h-4 ml-1" />
        </div>
      </Button>
    </div>
  );
}