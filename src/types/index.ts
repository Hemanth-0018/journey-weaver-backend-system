
// User types
export interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  preferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  preferredDestinationTypes: string[];
  budget: BudgetRange;
  travelStyle: string[];
  accessibility: string[];
}

export interface BudgetRange {
  min: number;
  max: number;
  currency: string;
}

// Authentication types
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

// Travel entities
export interface Destination {
  id: string;
  name: string;
  description: string;
  location: Location;
  images: string[];
  rating: number;
  tags: string[];
  priceLevel: number; // 1-5
  bestTimeToVisit: string[];
  activities: Activity[];
}

export interface Location {
  country: string;
  city: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  location: Location;
  category: string[];
  availableTimeSlots?: TimeSlot[];
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

// Trip planning
export interface Trip {
  id: string;
  userId: string;
  title: string;
  description?: string;
  destinations: Destination[];
  startDate: string;
  endDate: string;
  budget: BudgetRange;
  itinerary: ItineraryDay[];
  collaborators?: string[]; // User IDs
  status: 'draft' | 'planned' | 'booked' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface ItineraryDay {
  date: string;
  activities: ScheduledActivity[];
  accommodationId?: string;
  transportationDetails?: Transportation[];
  notes?: string;
}

export interface ScheduledActivity {
  activityId: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

export interface Transportation {
  type: 'flight' | 'train' | 'bus' | 'car' | 'ferry' | 'other';
  departureLocation: string;
  departureTime: string;
  arrivalLocation: string;
  arrivalTime: string;
  bookingReference?: string;
  price?: number;
}

// Booking
export interface Booking {
  id: string;
  userId: string;
  tripId: string;
  type: 'accommodation' | 'activity' | 'transportation';
  itemId: string; // ID of the booked item
  status: 'pending' | 'confirmed' | 'canceled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  confirmationCode?: string;
  price: number;
  currency: string;
  bookingDate: string;
}

// Recommendation types
export interface Recommendation {
  destinationId: string;
  score: number;
  reason: string[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
  };
}
