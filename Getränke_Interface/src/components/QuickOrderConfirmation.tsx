import React, { useState, useEffect } from 'react';
import { X, Check, Edit3 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { PendingOrder } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface QuickOrderConfirmationProps {
  pendingOrder: PendingOrder | null;
}

export function QuickOrderConfirmation({ pendingOrder }: QuickOrderConfirmationProps) {
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (!pendingOrder) return;

    setTimeLeft(5);
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          pendingOrder.onConfirm();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [pendingOrder]);

  if (!pendingOrder) return null;

  const progressValue = ((5 - timeLeft) / 5) * 100;
  const totalItems = pendingOrder.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Bestellung wird gebucht</h3>
            <p className="text-sm text-muted-foreground">
              Automatisch in {timeLeft} Sekunden
            </p>
          </div>

          {/* Progress Bar */}
          <Progress value={progressValue} className="mb-4" />

          {/* Order Details */}
          <div className="bg-secondary/30 rounded-lg p-4 mb-4">
            <div className="space-y-3">
              {pendingOrder.items.map((item, index) => (
                <div key={`${item.drink.id}-${index}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={item.drink.image}
                        alt={item.drink.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{item.drink.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity}x {item.drink.price.toFixed(2)}€
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {(item.drink.price * item.quantity).toFixed(2)}€
                      </div>
                    </div>
                  </div>
                  {index < pendingOrder.items.length - 1 && (
                    <Separator className="mt-3" />
                  )}
                </div>
              ))}
            </div>
            
            <Separator className="my-3" />
            
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="text-muted-foreground">Gesamt ({totalItems} Stück):</span>
                <div className="font-semibold text-primary">
                  {pendingOrder.total.toFixed(2)}€
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                {pendingOrder.member.name}
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={pendingOrder.onCancel}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <X className="w-4 h-4 mr-1" />
              Abbrechen
            </Button>
            
            <Button
              onClick={pendingOrder.onCancel}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Edit3 className="w-4 h-4 mr-1" />
              Ändern
            </Button>
            
            <Button
              onClick={pendingOrder.onConfirm}
              size="sm"
              className="flex-1"
            >
              <Check className="w-4 h-4 mr-1" />
              Sofort buchen
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}