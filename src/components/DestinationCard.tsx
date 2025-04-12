
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Destination } from '@/types';
import { MapPin, Star, Calendar } from 'lucide-react';

interface DestinationCardProps {
  destination: Destination;
  onViewDetails?: (id: string) => void;
  onAddToTrip?: (destination: Destination) => void;
}

const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  onViewDetails,
  onAddToTrip,
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={destination.images[0]} 
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute bottom-2 right-2">
          <Badge className="bg-yellow-500 text-white flex items-center gap-1">
            <Star className="h-3 w-3" fill="white" />
            {destination.rating.toFixed(1)}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{destination.name}</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            {'$'.repeat(destination.priceLevel)}
          </Badge>
        </div>
        <div className="flex items-center text-muted-foreground text-sm mt-1">
          <MapPin className="h-4 w-4 mr-1" />
          {destination.location.city}, {destination.location.country}
        </div>
      </CardHeader>
      
      <CardContent className="py-2 flex-grow">
        <CardDescription className="line-clamp-2 mb-3">
          {destination.description}
        </CardDescription>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {destination.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {destination.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{destination.tags.length - 3}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-1" />
          <span>Best time: {destination.bestTimeToVisit.slice(0, 2).join(', ')}</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <div className="flex gap-2 w-full">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onViewDetails && onViewDetails(destination.id)}
          >
            Details
          </Button>
          <Button 
            className="flex-1"
            onClick={() => onAddToTrip && onAddToTrip(destination)}
          >
            Add to Trip
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DestinationCard;
