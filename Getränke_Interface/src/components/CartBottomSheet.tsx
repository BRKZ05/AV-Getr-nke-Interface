import React from 'react';
import { Minus, Plus, Trash2, ShoppingCart, CreditCard } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from './ui/sheet';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { CartState, CartItem } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CartBottomSheetProps {
  cart: CartState;
  onUpdateQuantity: (drinkId: string, quantity: number) => void;
  onRemoveItem: (drinkId: string) => void;
  onCheckout: () => void;
  onToggleCart: () => void;
}

export function CartBottomSheet({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onToggleCart
}: CartBottomSheetProps) {
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.items.length === 0) {
    return null;
  }

  return (
    <>
      {/* Persistent Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-t border-border/50 p-4">
        <Sheet open={cart.isOpen} onOpenChange={onToggleCart}>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-all duration-200 hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Zur Kasse</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
                    {totalItems} {totalItems === 1 ? 'Artikel' : 'Artikel'}
                  </Badge>
                  <span className="text-lg font-semibold">
                    {cart.total.toFixed(2)}€
                  </span>
                </div>
              </div>
            </Button>
          </SheetTrigger>

          <SheetContent side="bottom" className="h-[80vh] bg-background/95 backdrop-blur-xl border-border/50">
            <SheetHeader className="pb-4">
              <SheetTitle className="text-left">Warenkorb</SheetTitle>
              <SheetDescription className="text-left">
                Überprüfe deine ausgewählten Getränke und gehe zur Kasse
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-col h-full">
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {cart.items.map((item) => (
                  <CartItemComponent
                    key={item.drink.id}
                    item={item}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemoveItem={onRemoveItem}
                  />
                ))}
              </div>

              <Separator className="my-4" />

              {/* Total and Checkout */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Gesamt:</span>
                  <span>{cart.total.toFixed(2)}€</span>
                </div>

                <Button
                  onClick={onCheckout}
                  size="lg"
                  className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Bezahlen ({cart.total.toFixed(2)}€)
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

interface CartItemComponentProps {
  item: CartItem;
  onUpdateQuantity: (drinkId: string, quantity: number) => void;
  onRemoveItem: (drinkId: string) => void;
}

const CartItemComponent = React.forwardRef<HTMLDivElement, CartItemComponentProps>(
  ({ item, onUpdateQuantity, onRemoveItem }, ref) => {
    const { drink, quantity } = item;
    const itemTotal = drink.price * quantity;

    return (
      <div 
        ref={ref}
        className="flex items-center gap-3 p-3 bg-card/50 backdrop-blur-sm rounded-xl border border-border/30"
      >
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          <ImageWithFallback
            src={drink.image}
            alt={drink.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium truncate">{drink.name}</h4>
          <p className="text-xs text-muted-foreground">{drink.price.toFixed(2)}€ / Stück</p>
          <p className="text-sm font-semibold text-primary">{itemTotal.toFixed(2)}€</p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            onClick={() => onUpdateQuantity(drink.id, Math.max(0, quantity - 1))}
            size="icon"
            variant="outline"
            className="w-8 h-8 rounded-full"
          >
            <Minus className="w-3 h-3" />
          </Button>

          <span className="w-8 text-center text-sm font-medium">{quantity}</span>

          <Button
            onClick={() => onUpdateQuantity(drink.id, quantity + 1)}
            size="icon"
            variant="outline"
            className="w-8 h-8 rounded-full"
          >
            <Plus className="w-3 h-3" />
          </Button>

          <Button
            onClick={() => onRemoveItem(drink.id)}
            size="icon"
            variant="ghost"
            className="w-8 h-8 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    );
  }
);

CartItemComponent.displayName = "CartItemComponent";