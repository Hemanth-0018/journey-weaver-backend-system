
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm, RegisterForm } from '@/components/AuthForms';
import Navigation from '@/components/Navigation';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ArrowRight, Search, MapPin, Calendar, TrendingUp, Plane, Compass } from 'lucide-react';
import { destinationsApi } from '@/services/api';
import DestinationCard from '@/components/DestinationCard';
import { Destination } from '@/types';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [popularDestinations, setPopularDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      setIsLoading(true);
      try {
        const response = await destinationsApi.getPopularDestinations();
        if (response.success && response.data) {
          setPopularDestinations(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch popular destinations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleDestinationClick = (id: string) => {
    navigate(`/destinations/${id}`);
  };

  const handleAddToTrip = (destination: Destination) => {
    if (!user) {
      setIsLogin(true);
      setShowAuthDialog(true);
      return;
    }
    navigate('/trips/new', { state: { destination } });
  };

  const features = [
    {
      icon: <MapPin className="h-10 w-10 text-primary" />,
      title: "Discover Amazing Places",
      description: "Find the perfect destinations that match your interests and travel style."
    },
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: "Smart Itinerary Planning",
      description: "Create customized day-by-day itineraries for your trips with ease."
    },
    {
      icon: <TrendingUp className="h-10 w-10 text-primary" />,
      title: "Personalized Recommendations",
      description: "Get tailored suggestions based on your preferences and past trips."
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80 mix-blend-multiply" />
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')",
              zIndex: -1
            }}
          />
          <div className="relative container mx-auto px-4 py-32 sm:py-40">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 animate-fade-in">
                Plan Your Perfect Journey
              </h1>
              <p className="text-xl mb-8 animate-slide-up">
                Discover amazing destinations, create personalized itineraries, and make your travel dreams come true.
              </p>
              
              <form onSubmit={handleSearch} className="bg-white rounded-md p-2 flex max-w-md animate-slide-up">
                <Input
                  type="text"
                  placeholder="Where do you want to go?"
                  className="border-0 focus-visible:ring-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </form>
              
              <div className="mt-8 flex flex-wrap gap-4 animate-slide-up">
                <Button asChild size="lg">
                  <Link to="/explore">
                    Explore Destinations
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                
                {!user && (
                  <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="lg" className="bg-white/20 hover:bg-white/30 border-white backdrop-blur-sm">
                        {isLogin ? 'Login' : 'Sign Up'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      {isLogin ? (
                        <LoginForm 
                          onSuccess={() => setShowAuthDialog(false)}
                          onSwitchToRegister={() => setIsLogin(false)}
                        />
                      ) : (
                        <RegisterForm 
                          onSuccess={() => setShowAuthDialog(false)}
                          onSwitchToLogin={() => setIsLogin(true)}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* Features */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Plan Your Trip with Confidence
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Popular Destinations */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Popular Destinations</h2>
              <Button variant="outline" asChild>
                <Link to="/explore">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            {isLoading ? (
              <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-lg bg-muted animate-pulse h-80"></div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularDestinations.map((destination) => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                    onViewDetails={handleDestinationClick}
                    onAddToTrip={handleAddToTrip}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-16 bg-primary/10">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <Compass className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-3xl font-bold mb-4">
                Ready to Start Your Adventure?
              </h2>
              <p className="text-xl mb-8 text-muted-foreground">
                Create an account to save your favorite destinations, plan trips, and get personalized recommendations.
              </p>
              
              {user ? (
                <Button asChild size="lg">
                  <Link to="/trips/new">
                    <Plane className="mr-2 h-5 w-5" />
                    Create New Trip
                  </Link>
                </Button>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <RegisterForm 
                      onSwitchToLogin={() => setIsLogin(true)}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-muted py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Smart Travel Planner</span>
            </div>
            
            <div className="flex space-x-6">
              <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
              <Link to="/explore" className="text-muted-foreground hover:text-foreground">Explore</Link>
              <Link to="/trips" className="text-muted-foreground hover:text-foreground">My Trips</Link>
              <Link to="/about" className="text-muted-foreground hover:text-foreground">About</Link>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Smart Travel Planner. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
