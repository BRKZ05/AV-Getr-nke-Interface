import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { DrinkCard } from './DrinkCard';
import { Drink, QuickOrderItem } from '../types';
import { drinkCategories } from '../data/mockData';

interface DrinksListProps {
  drinks: Drink[];
  onAddToCart?: (drink: Drink) => void;
  onQuickOrder?: (drink: Drink) => void;
  onQuickRemove?: (drink: Drink) => void;
  showQuickOrder?: boolean;
  quickOrderItems?: QuickOrderItem[];
}

export function DrinksList({ 
  drinks, 
  onAddToCart, 
  onQuickOrder, 
  onQuickRemove,
  showQuickOrder = false,
  quickOrderItems = []
}: DrinksListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDrinks = useMemo(() => {
    let filtered = drinks;

    // Filter by category
    if (selectedCategory !== 'Alle') {
      filtered = filtered.filter(drink => drink.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(drink =>
        drink.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drink.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [drinks, selectedCategory, searchQuery]);

  const getQuickOrderQuantity = (drinkId: string) => {
    const item = quickOrderItems.find(item => item.drink.id === drinkId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="px-4 pb-20">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Alle Getränke</h2>
        
        {/* Category Filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {drinkCategories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className={`whitespace-nowrap rounded-full transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-secondary/50 hover:bg-secondary border-border/50'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
        
        {/* Search Field */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Getränk suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary/50 border-border/50 rounded-full"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          {filteredDrinks.length} {filteredDrinks.length === 1 ? 'Getränk' : 'Getränke'} gefunden
        </p>
      </div>

      {/* Drinks Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredDrinks.map((drink) => (
          <DrinkCard
            key={drink.id}
            drink={drink}
            onAddToCart={onAddToCart}
            onQuickOrder={onQuickOrder}
            onQuickRemove={onQuickRemove}
            showQuickOrder={showQuickOrder}
            quickOrderQuantity={getQuickOrderQuantity(drink.id)}
          />
        ))}
      </div>

      {filteredDrinks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Keine Getränke gefunden</p>
          <p className="text-sm text-muted-foreground mt-1">
            Versuche einen anderen Suchbegriff oder wähle eine andere Kategorie
          </p>
        </div>
      )}
    </div>
  );
}