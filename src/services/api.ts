
import { ApiResponse, LoginCredentials, RegisterCredentials, User, Trip, Destination, Booking } from '../types';

// This is a mock implementation. In a real app, you would connect to a backend server.
// We're using this to simulate backend functionality for now.

const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.smarttravelplanner.example';
const API_DELAY = 800; // simulate network delay

// Helper to simulate API calls
const mockApiCall = async <T>(data: T, error = null, delay = API_DELAY): Promise<ApiResponse<T>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (error) {
        resolve({ success: false, error });
      } else {
        resolve({ success: true, data });
      }
    }, delay);
  });
};

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<User>> => {
    console.log('Login attempt with:', credentials.email);
    // In a real implementation, you would make an actual API call here
    
    if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
      const user: User = {
        id: 'user-1',
        email: credentials.email,
        name: 'Demo User',
        profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
        preferences: {
          preferredDestinationTypes: ['beach', 'city'],
          budget: { min: 500, max: 5000, currency: 'USD' },
          travelStyle: ['relaxed', 'cultural'],
          accessibility: ['wheelchair-friendly']
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Store in localStorage to persist the session
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', 'mock-jwt-token');
      
      return mockApiCall(user);
    }
    
    return mockApiCall(null, 'Invalid email or password');
  },
  
  register: async (credentials: RegisterCredentials): Promise<ApiResponse<User>> => {
    console.log('Register attempt with:', credentials.email);
    
    // Check if email already exists (simplified mock)
    if (credentials.email === 'demo@example.com') {
      return mockApiCall(null, 'Email already registered');
    }
    
    const user: User = {
      id: `user-${Math.floor(Math.random() * 1000)}`,
      email: credentials.email,
      name: credentials.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', 'mock-jwt-token');
    
    return mockApiCall(user);
  },
  
  logout: async (): Promise<ApiResponse<null>> => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return mockApiCall(null);
  },
  
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      return mockApiCall(null, 'Not authenticated');
    }
    
    const user = JSON.parse(userJson) as User;
    return mockApiCall(user);
  }
};

// Destinations API
export const destinationsApi = {
  getPopularDestinations: async (): Promise<ApiResponse<Destination[]>> => {
    const destinations: Destination[] = [
      {
        id: 'dest-1',
        name: 'Bali, Indonesia',
        description: 'A beautiful island known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs.',
        location: {
          country: 'Indonesia',
          city: 'Bali',
          coordinates: {
            latitude: -8.4095,
            longitude: 115.1889
          }
        },
        images: [
          'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
          'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2'
        ],
        rating: 4.7,
        tags: ['beach', 'cultural', 'tropical', 'temples'],
        priceLevel: 2,
        bestTimeToVisit: ['April', 'May', 'June', 'September'],
        activities: []
      },
      {
        id: 'dest-2',
        name: 'Paris, France',
        description: 'The City of Light draws millions of visitors every year with its unforgettable ambiance.',
        location: {
          country: 'France',
          city: 'Paris',
          coordinates: {
            latitude: 48.8566,
            longitude: 2.3522
          }
        },
        images: [
          'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
          'https://images.unsplash.com/photo-1499856871958-5b9627545d1a'
        ],
        rating: 4.6,
        tags: ['city', 'historic', 'romantic', 'food'],
        priceLevel: 4,
        bestTimeToVisit: ['April', 'May', 'June', 'September', 'October'],
        activities: []
      },
      {
        id: 'dest-3',
        name: 'Kyoto, Japan',
        description: 'A city in Japan known for its numerous classical Buddhist temples, gardens, imperial palaces, and traditional wooden houses.',
        location: {
          country: 'Japan',
          city: 'Kyoto',
          coordinates: {
            latitude: 35.0116,
            longitude: 135.7681
          }
        },
        images: [
          'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
          'https://images.unsplash.com/photo-1528360983277-13d401cdc186'
        ],
        rating: 4.8,
        tags: ['cultural', 'historic', 'temples', 'gardens'],
        priceLevel: 3,
        bestTimeToVisit: ['March', 'April', 'October', 'November'],
        activities: []
      }
    ];
    
    return mockApiCall(destinations);
  },
  
  searchDestinations: async (query: string): Promise<ApiResponse<Destination[]>> => {
    console.log('Searching for:', query);
    
    const allDestinations = await destinationsApi.getPopularDestinations();
    if (!allDestinations.success) return allDestinations;
    
    const destinations = allDestinations.data?.filter(dest => 
      dest.name.toLowerCase().includes(query.toLowerCase()) || 
      dest.location.country.toLowerCase().includes(query.toLowerCase()) ||
      dest.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    
    return mockApiCall(destinations || []);
  },
  
  getDestinationById: async (id: string): Promise<ApiResponse<Destination>> => {
    const allDestinations = await destinationsApi.getPopularDestinations();
    if (!allDestinations.success) return { success: false, error: allDestinations.error };
    
    const destination = allDestinations.data?.find(dest => dest.id === id);
    if (!destination) {
      return mockApiCall(null, 'Destination not found');
    }
    
    return mockApiCall(destination);
  }
};

// Trips API
export const tripsApi = {
  getUserTrips: async (): Promise<ApiResponse<Trip[]>> => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      return mockApiCall(null, 'Not authenticated');
    }
    
    const user = JSON.parse(userJson) as User;
    
    // Mock trips data
    const trips: Trip[] = [
      {
        id: 'trip-1',
        userId: user.id,
        title: 'Summer in Bali',
        description: 'A relaxing two-week getaway',
        destinations: [],
        startDate: '2025-06-15',
        endDate: '2025-06-29',
        budget: { min: 2000, max: 3000, currency: 'USD' },
        itinerary: [],
        status: 'draft',
        createdAt: '2025-01-20T12:00:00Z',
        updatedAt: '2025-01-20T12:00:00Z'
      }
    ];
    
    // If we had destinations loaded already, we could attach them here
    // but for this demo we'll leave it empty
    
    return mockApiCall(trips);
  },
  
  createTrip: async (tripData: Partial<Trip>): Promise<ApiResponse<Trip>> => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      return mockApiCall(null, 'Not authenticated');
    }
    
    const user = JSON.parse(userJson) as User;
    
    const newTrip: Trip = {
      id: `trip-${Math.floor(Math.random() * 1000)}`,
      userId: user.id,
      title: tripData.title || 'Untitled Trip',
      description: tripData.description || '',
      destinations: tripData.destinations || [],
      startDate: tripData.startDate || new Date().toISOString(),
      endDate: tripData.endDate || new Date().toISOString(),
      budget: tripData.budget || { min: 0, max: 0, currency: 'USD' },
      itinerary: tripData.itinerary || [],
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // In a real implementation, this would be saved to a database
    // For now, we'll just return the new trip
    
    return mockApiCall(newTrip);
  },
  
  updateTrip: async (id: string, tripData: Partial<Trip>): Promise<ApiResponse<Trip>> => {
    const userTrips = await tripsApi.getUserTrips();
    if (!userTrips.success) return { success: false, error: userTrips.error };
    
    const tripIndex = userTrips.data?.findIndex(trip => trip.id === id);
    if (tripIndex === undefined || tripIndex === -1) {
      return mockApiCall(null, 'Trip not found');
    }
    
    const updatedTrip = {
      ...(userTrips.data?.[tripIndex] as Trip),
      ...tripData,
      updatedAt: new Date().toISOString()
    };
    
    return mockApiCall(updatedTrip);
  }
};

// Recommendations API
export const recommendationsApi = {
  getPersonalizedDestinations: async (): Promise<ApiResponse<Destination[]>> => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      return mockApiCall(null, 'Not authenticated');
    }
    
    // In a real app, we would use the user's preferences to personalize recommendations
    // For this mock, we'll just return popular destinations
    
    return destinationsApi.getPopularDestinations();
  }
};

// Booking API
export const bookingApi = {
  createBooking: async (bookingData: Partial<Booking>): Promise<ApiResponse<Booking>> => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      return mockApiCall(null, 'Not authenticated');
    }
    
    const user = JSON.parse(userJson) as User;
    
    const newBooking: Booking = {
      id: `booking-${Math.floor(Math.random() * 1000)}`,
      userId: user.id,
      tripId: bookingData.tripId || '',
      type: bookingData.type || 'accommodation',
      itemId: bookingData.itemId || '',
      status: 'pending',
      paymentStatus: 'pending',
      price: bookingData.price || 0,
      currency: bookingData.currency || 'USD',
      bookingDate: new Date().toISOString()
    };
    
    return mockApiCall(newBooking);
  }
};
