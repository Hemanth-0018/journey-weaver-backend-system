
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Destination } from '@/types';
import { destinationsApi } from '@/services/api';
import DestinationCard from '@/components/DestinationCard';
import { useNavigate } from 'react-router-dom';
import { Filter, Search, Sliders, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Explore = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    types: [] as string[],
    priceLevel: [1, 5],
    sortBy: 'popularity'
  });

  useEffect(() => {
    const fetchDestinations = async () => {
      setIsLoading(true);
      try {
        let response;
        if (initialQuery) {
          response = await destinationsApi.searchDestinations(initialQuery);
        } else {
          response = await destinationsApi.getPopularDestinations();
        }
        
        if (response.success && response.data) {
          setDestinations(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch destinations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinations();
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleDestinationClick = (id: string) => {
    navigate(`/destinations/${id}`);
  };

  const handleAddToTrip = (destination: Destination) => {
    if (!user) {
      navigate('/', { state: { openAuth: true } });
      return;
    }
    navigate('/trips/new', { state: { destination } });
  };

  const handleFilterChange = (filterType: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const destinationTypes = [
    { id: 'beach', label: 'Beach' },
    { id: 'mountain', label: 'Mountain' },
    { id: 'city', label: 'City' },
    { id: 'countryside', label: 'Countryside' },
    { id: 'historic', label: 'Historic' },
    { id: 'cultural', label: 'Cultural' },
    { id: 'adventure', label: 'Adventure' }
  ];

  // For a real implementation, this would apply actual filtering logic
  const filteredDestinations = destinations;

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Explore Destinations</h1>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-grow flex rounded-md border overflow-hidden">
              <div className="relative flex-grow">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search destinations, cities, regions..."
                  className="border-0 pl-10 focus-visible:ring-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" className="rounded-l-none">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Refine Results</SheetTitle>
                </SheetHeader>
                
                <div className="py-4 space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <Sliders className="h-4 w-4" />
                      Sort By
                    </h3>
                    <Select
                      value={filters.sortBy}
                      onValueChange={(value) => handleFilterChange('sortBy', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="popularity">Popularity</SelectItem>
                        <SelectItem value="rating">Rating (High to Low)</SelectItem>
                        <SelectItem value="price_low">Price (Low to High)</SelectItem>
                        <SelectItem value="price_high">Price (High to Low)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Destination Type</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {destinationTypes.map((type) => (
                        <div key={type.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`type-${type.id}`}
                            checked={filters.types.includes(type.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleFilterChange('types', [...filters.types, type.id]);
                              } else {
                                handleFilterChange(
                                  'types',
                                  filters.types.filter(t => t !== type.id)
                                );
                              }
                            }}
                          />
                          <Label htmlFor={`type-${type.id}`}>{type.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Price Level</h3>
                    <div className="px-2">
                      <Slider
                        defaultValue={filters.priceLevel}
                        min={1}
                        max={5}
                        step={1}
                        onValueChange={(value) => handleFilterChange('priceLevel', value)}
                      />
                      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                        <span>Budget</span>
                        <span>Luxury</span>
                      </div>
                    </div>
                  </div>
                  
                  <SheetClose asChild>
                    <Button className="w-full mt-4">Apply Filters</Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(null).map((_, i) => (
              <div key={i} className="rounded-lg bg-muted animate-pulse h-80"></div>
            ))}
          </div>
        ) : filteredDestinations.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                onViewDetails={handleDestinationClick}
                onAddToTrip={handleAddToTrip}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No destinations found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search criteria</p>
            <Button onClick={() => navigate('/explore')}>
              View All Destinations
            </Button>
          </div>
        )}
      </main>
      
      <footer className="bg-muted py-8 mt-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Smart Travel Planner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Explore;
