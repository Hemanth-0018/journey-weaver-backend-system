
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trip } from '@/types';
import { tripsApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { LoginForm } from '@/components/AuthForms';
import { CalendarIcon, MapPinIcon, PlusCircle, LuggageIcon } from 'lucide-react';
import { formatDistance } from 'date-fns';

const MyTrips: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    const fetchTrips = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const response = await tripsApi.getUserTrips();
        if (response.success && response.data) {
          setTrips(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch trips:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, [user]);

  useEffect(() => {
    // If no user is logged in, show login dialog
    if (!user && !showLoginDialog) {
      setShowLoginDialog(true);
    }
  }, [user, showLoginDialog]);

  const handleCreateTrip = () => {
    navigate('/trips/new');
  };

  const handleTripClick = (id: string) => {
    navigate(`/trips/${id}`);
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
    const startDay = start.getDate();
    const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
    const endDay = end.getDate();
    const year = start.getFullYear();
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay}-${endDay}, ${year}`;
    }
    
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  };

  const getTripDuration = (startDate: string, endDate: string) => {
    return formatDistance(new Date(endDate), new Date(startDate), { addSuffix: false });
  };

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        
        <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center max-w-md">
            <LuggageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">My Trips</h1>
            <p className="text-muted-foreground mb-8">
              Sign in to view your trips and create new travel plans.
            </p>
            
            <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
              <DialogTrigger asChild>
                <Button size="lg">Sign In</Button>
              </DialogTrigger>
              <DialogContent>
                <LoginForm onSuccess={() => setShowLoginDialog(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </main>
        
        <footer className="bg-muted py-8">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Smart Travel Planner. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Trips</h1>
          <Button onClick={handleCreateTrip}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Trip
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-muted rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : trips.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <Card 
                key={trip.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleTripClick(trip.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{trip.title}</CardTitle>
                    <div className="px-2 py-1 text-xs rounded-full bg-muted">
                      {trip.status}
                    </div>
                  </div>
                  <CardDescription>
                    {trip.description || 'No description'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                      {formatDateRange(trip.startDate, trip.endDate)}
                      <span className="mx-2 text-muted-foreground">•</span>
                      {getTripDuration(trip.startDate, trip.endDate)}
                    </div>
                    
                    {trip.destinations && trip.destinations.length > 0 ? (
                      <div className="flex items-center text-sm">
                        <MapPinIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                        {trip.destinations.map(d => d.name).join(', ')}
                      </div>
                    ) : (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        No destinations added yet
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={(e) => {
                    e.stopPropagation();
                    handleTripClick(trip.id);
                  }}>
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-2">You don't have any trips yet</h2>
            <p className="text-muted-foreground mb-6">
              Create your first trip and start planning your adventure
            </p>
            <Button onClick={handleCreateTrip}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Trip
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

export default MyTrips;
