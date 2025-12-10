import React from 'react';
import { Plus, Check, Minus } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Drink } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DrinkCardProps {
  drink: Drink;
  onAddToCart?: (drink: Drink) => void;
  onQuickOrder?: (drink: Drink) => void;
  onQuickRemove?: (drink: Drink) => void;
  className?: string;
  showQuickOrder?: boolean;
  quickOrderQuantity?: number;
}

export function DrinkCard({ 
  drink, 
  onAddToCart, 
  onQuickOrder,
  onQuickRemove,
  className = '', 
  showQuickOrder = false,
  quickOrderQuantity = 0
}: DrinkCardProps) {
  const handleClick = () => {
    if (showQuickOrder && onQuickOrder) {
      onQuickOrder(drink);
    } else if (onAddToCart) {
      onAddToCart(drink);
    }
    
    // Simple haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickRemove) {
      onQuickRemove(drink);
    }
  };

  const isSelected = quickOrderQuantity > 0;

  return (
    <div 
      className={`group relative bg-card/80 backdrop-blur-md border-2 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] ${
        showQuickOrder ? 'cursor-pointer' : ''
      } ${
        isSelected 
          ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
          : 'border-border/30 hover:border-primary/40'
      } ${className}`}
      onClick={showQuickOrder ? handleClick : undefined}
    >
      <div className="aspect-square relative overflow-hidden">
        <ImageWithFallback
          src={drink.image}
          alt={drink.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {drink.isPopular && (
          <Badge className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs px-2 py-1">
            Beliebt
          </Badge>
        )}
        
        {isSelected && (
          <div className="absolute top-2 right-2">
            <div className="flex items-center gap-1">
              {quickOrderQuantity > 1 && (
                <Button
                  onClick={handleRemove}
                  size="icon"
                  className="w-7 h-7 rounded-full bg-destructive/90 hover:bg-destructive text-destructive-foreground shadow-lg"
                >
                  <Minus className="w-3 h-3" />
                </Button>
              )}
              <div className="w-7 h-7 rounded-full bg-primary/90 text-primary-foreground shadow-lg flex items-center justify-center text-sm font-medium">
                {quickOrderQuantity}
              </div>
            </div>
          </div>
        )}
        
        {!showQuickOrder && onAddToCart && (
          <Button
            onClick={handleClick}
            size="icon"
            className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
          >
            <Plus className="w-4 h-4" />
          </Button>
        )}
        
        {showQuickOrder && !isSelected && (
          <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <div className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
              Antippen zum Hinzufügen
            </div>
          </div>
        )}

        {showQuickOrder && isSelected && (
          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
            <div className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              <Check className="w-4 h-4" />
              Ausgewählt
            </div>
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="text-sm font-medium mb-1 line-clamp-2">{drink.name}</h3>
        
        <div className="flex items-center justify-between">
          <span className={`text-lg font-semibold ${isSelected ? 'text-primary' : 'text-primary'}`}>
            {drink.price.toFixed(2)}€
          </span>
          
          {drink.alcoholContent && (
            <span className="text-xs text-muted-foreground">
              {drink.alcoholContent}% Vol.
            </span>
          )}
        </div>
        
        {drink.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {drink.description}
          </p>
        )}
      </div>
    </div>
  );
}