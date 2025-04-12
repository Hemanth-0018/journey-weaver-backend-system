
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Explore from "./pages/Explore";
import TripDetails from "./pages/TripDetails";
import MyTrips from "./pages/MyTrips";
import DestinationDetails from "./pages/DestinationDetails";
import NewTrip from "./pages/NewTrip";
import UserProfile from "./pages/UserProfile";
import SavedDestinations from "./pages/SavedDestinations";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/trips" element={<MyTrips />} />
            <Route path="/trips/new" element={<NewTrip />} />
            <Route path="/trips/:id" element={<TripDetails />} />
            <Route path="/destinations/:id" element={<DestinationDetails />} />
            <Route path="/saved" element={<SavedDestinations />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
