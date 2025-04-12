
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';

const NewTrip: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    navigate('/');
    return null;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate('/trips')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Trips
        </Button>
        
        <h1 className="text-3xl font-bold mb-8">Create New Trip</h1>
        
        <div className="p-12 text-center bg-muted rounded-lg">
          <p className="text-xl mb-4">This page is under construction</p>
          <p className="text-muted-foreground">Trip creation form will be here</p>
        </div>
      </main>
      
      <footer className="bg-muted py-8 mt-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Smart Travel Planner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default NewTrip;
