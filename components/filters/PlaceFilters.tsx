'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Filter, X } from 'lucide-react';
import { MapFilters } from '@/types';

interface PlaceFiltersProps {
  filters: MapFilters;
  onFiltersChange: (filters: MapFilters) => void;
  onSearchChange: (search: string) => void;
  searchTerm: string;
  availableCounties: string[];
  availableCuisines: string[];
  availableTags: string[];
  className?: string;
}

const PlaceFilters: React.FC<PlaceFiltersProps> = ({
  filters,
  onFiltersChange,
  onSearchChange,
  searchTerm,
  availableCounties,
  availableCuisines,
  availableTags,
  className,
}) => {
  const handleFilterChange = (key: keyof MapFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleMultiSelectChange = (key: 'counties' | 'cuisines' | 'tags', value: string) => {
    const currentValues = filters[key] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    
    handleFilterChange(key, newValues);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      counties: [],
      cuisines: [],
      tags: [],
      priceRange: [1, 4],
      rating: 0,
      featured: false,
      verified: false,
    });
  };

  const hasActiveFilters = 
    filters.counties.length > 0 ||
    filters.cuisines.length > 0 ||
    filters.tags.length > 0 ||
    filters.priceRange[0] !== 1 ||
    filters.priceRange[1] !== 4 ||
    filters.rating > 0 ||
    filters.featured ||
    filters.verified;

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-8 px-2"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search places, cities, counties..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* County Filter */}
        {availableCounties.length > 0 && (
          <div>
            <label className="text-sm font-medium mb-2 block">County</label>
            <Select
              value={filters.counties[0] || 'all'}
              onValueChange={(value) => handleFilterChange('counties', value === 'all' ? [] : [value])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select county" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Counties</SelectItem>
                {availableCounties.map((county) => (
                  <SelectItem key={county} value={county}>
                    {county}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Cuisine Filter */}
        {availableCuisines.length > 0 && (
          <div>
            <label className="text-sm font-medium mb-2 block">Cuisine</label>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar">
              {availableCuisines.map((cuisine) => {
                const isSelected = filters.cuisines.includes(cuisine);
                return (
                  <button
                    key={cuisine}
                    type="button"
                    onClick={() => handleMultiSelectChange('cuisines', cuisine)}
                    className={`filter-chip px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      isSelected
                        ? 'pill-active text-white bg-gradient-to-r from-[#FF6A00] to-[#FF8C42] border border-[#FF6A00]/50 shadow-lg'
                        : 'bg-secondary/50 text-secondary-foreground border border-border hover:bg-secondary hover:border-primary/30'
                    }`}
                  >
                    {cuisine}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tags Filter */}
        {availableTags.length > 0 && (
          <div>
            <label className="text-sm font-medium mb-2 block">Features</label>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar">
              {availableTags.map((tag) => {
                const isSelected = filters.tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleMultiSelectChange('tags', tag)}
                    className={`filter-chip px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      isSelected
                        ? 'pill-active text-white bg-gradient-to-r from-[#FF6A00] to-[#FF8C42] border border-[#FF6A00]/50 shadow-lg'
                        : 'bg-secondary/50 text-secondary-foreground border border-border hover:bg-secondary hover:border-primary/30'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Price Range */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Price Range: {filters.priceRange[0]} - {filters.priceRange[1]}
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="1"
              max="4"
              value={filters.priceRange[0]}
              onChange={(e) =>
                handleFilterChange('priceRange', [
                  parseInt(e.target.value),
                  filters.priceRange[1],
                ])
              }
              className="w-full"
            />
            <input
              type="range"
              min="1"
              max="4"
              value={filters.priceRange[1]}
              onChange={(e) =>
                handleFilterChange('priceRange', [
                  filters.priceRange[0],
                  parseInt(e.target.value),
                ])
              }
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>$</span>
            <span>$$</span>
            <span>$$$</span>
            <span>$$$$</span>
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Minimum Rating: {filters.rating.toFixed(1)}
          </label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={filters.rating}
            onChange={(e) => handleFilterChange('rating', parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0</span>
            <span>5</span>
          </div>
        </div>

        {/* Special Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleFilterChange('featured', !filters.featured)}
            className={`filter-chip px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              filters.featured
                ? 'pill-active text-white bg-gradient-to-r from-yellow-500/90 to-orange-500/90 border border-yellow-500/50 shadow-lg'
                : 'bg-secondary/50 text-secondary-foreground border border-border hover:bg-secondary hover:border-yellow-500/30'
            }`}
          >
            ⭐ Featured Only
          </button>
          <button
            type="button"
            onClick={() => handleFilterChange('verified', !filters.verified)}
            className={`filter-chip px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              filters.verified
                ? 'pill-active text-white bg-gradient-to-r from-blue-500/90 to-cyan-500/90 border border-blue-500/50 shadow-lg'
                : 'bg-secondary/50 text-secondary-foreground border border-border hover:bg-secondary hover:border-blue-500/30'
            }`}
          >
            ✓ Verified Only
          </button>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="pt-2 border-t">
            <div className="text-sm text-muted-foreground mb-2">Active filters:</div>
            <div className="flex flex-wrap gap-1">
              {filters.counties.map((county) => (
                <span
                  key={county}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                >
                  {county}
                </span>
              ))}
              {filters.cuisines.map((cuisine) => (
                <span
                  key={cuisine}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                >
                  {cuisine}
                </span>
              ))}
              {filters.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {filters.featured && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  Featured
                </span>
              )}
              {filters.verified && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Verified
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlaceFilters;
