import React, { useState, useRef, useEffect } from 'react';
import { Search, User, QrCode } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Member } from '../types';
import { mockMembers } from '../data/mockData';

interface SearchHeaderProps {
  selectedMember: Member | null;
  onMemberSelect: (member: Member | null) => void;
}

export function SearchHeader({ selectedMember, onMemberSelect }: SearchHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Member[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = mockMembers.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMemberSelect = (member: Member) => {
    onMemberSelect(member);
    setSearchQuery(member.name);
    setShowSuggestions(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (!value.trim()) {
      onMemberSelect(null);
    }
  };

  return (
    <div className="relative z-50 px-4 pt-4 pb-2 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 w-10 h-10 rounded-full bg-secondary/50 hover:bg-secondary"
        >
          <User className="w-5 h-5" />
        </Button>

        <div ref={searchRef} className="relative flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Deinen Namen eingeben…"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              className="pl-10 pr-4 h-12 bg-secondary/50 border-0 rounded-full backdrop-blur-md placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            />
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((member) => (
                <button
                  key={member.id}
                  onClick={() => handleMemberSelect(member)}
                  className="w-full px-4 py-3 text-left hover:bg-secondary/50 transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl border-b border-border/30 last:border-b-0"
                >
                  <div className="text-sm">{member.name}</div>
                  {member.email && (
                    <div className="text-xs text-muted-foreground">{member.email}</div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 w-10 h-10 rounded-full bg-secondary/50 hover:bg-secondary"
        >
          <QrCode className="w-5 h-5" />
        </Button>
      </div>

      {selectedMember && (
        <div className="mt-3 px-3 py-2 bg-primary/10 rounded-lg border border-primary/20">
          <div className="text-sm">Eingeloggt als: <span className="font-medium">{selectedMember.name}</span></div>
        </div>
      )}
    </div>
  );
}