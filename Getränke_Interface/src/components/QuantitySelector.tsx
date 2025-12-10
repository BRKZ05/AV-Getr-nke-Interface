import React, { useState } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Drink, Member } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface QuantitySelectorProps {
  drink: Drink | null;
  member: Member | null;
  onOrder: (drink: Drink, quantity: number) => void;
  onClose: () => void;
}

export function QuantitySelector({ drink, member, onOrder, onClose }: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(1);

  if (!drink || !member) return null;

  const total = drink.price * quantity;

  const handleOrder = () => {
    onOrder(drink, quantity);
    onClose();
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(20, prev + delta)));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl">
        <div className="p-6">
          {/* Drink Info */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <ImageWithFallback
                src={drink.image}
                alt={drink.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{drink.name}</h3>
              <p className="text-sm text-muted-foreground">{drink.price.toFixed(2)}€ / Stück</p>
              {drink.alcoholContent && (
                <p className="text-xs text-muted-foreground">{drink.alcoholContent}% Vol.</p>
              )}
            </div>
          </div>

          {/* Member Info */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Für:</span>
              <Badge variant="secondary">{member.name}</Badge>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={() => handleQuantityChange(-1)}
                variant="outline"
                size="icon"
                className="w-12 h-12 rounded-full"
                disabled={quantity <= 1}
              >
                <Minus className="w-5 h-5" />
              </Button>

              <div className="text-center">
                <div className="text-3xl font-bold">{quantity}</div>
                <div className="text-xs text-muted-foreground">Stück</div>
              </div>

              <Button
                onClick={() => handleQuantityChange(1)}
                variant="outline"
                size="icon"
                className="w-12 h-12 rounded-full"
                disabled={quantity >= 20}
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Total */}
          <div className="mb-6 text-center">
            <div className="text-2xl font-bold text-primary">{total.toFixed(2)}€</div>
            <div className="text-sm text-muted-foreground">Gesamt</div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Abbrechen
            </Button>
            
            <Button
              onClick={handleOrder}
              className="flex-1"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Bestellen
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}