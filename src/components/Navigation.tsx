
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, X, LogOut, User, Briefcase, PlusCircle, Home, Globe, Map, Heart, Settings, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { LoginForm, RegisterForm } from './AuthForms';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [openSearch, setOpenSearch] = useState(false);
  const [openAuth, setOpenAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setOpenSearch(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { label: 'Home', path: '/', icon: <Home className="h-5 w-5" /> },
    { label: 'Explore', path: '/explore', icon: <Globe className="h-5 w-5" /> },
    { label: 'My Trips', path: '/trips', icon: <Briefcase className="h-5 w-5" /> },
    { label: 'Saved', path: '/saved', icon: <Heart className="h-5 w-5" /> },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Smart Travel Planner</SheetTitle>
                </SheetHeader>
                <nav className="mt-8 flex flex-col gap-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-2 py-2 rounded-md transition-colors ${
                        isActive(item.path)
                          ? 'bg-accent font-medium'
                          : 'hover:bg-accent/50'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            
            <Link to="/" className="flex items-center space-x-2">
              <Map className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl hidden md:inline">Smart Travel Planner</span>
              <span className="font-bold text-xl md:hidden">STP</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'bg-accent font-medium'
                    : 'hover:bg-accent/50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="text-muted-foreground"
              onClick={() => setOpenSearch(true)}
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
            
            {user ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="hidden md:flex"
                  onClick={() => navigate('/trips/new')}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Trip
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profileImage} alt={user.name} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      <div>
                        <p>{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/trips')}>
                      <Briefcase className="mr-2 h-4 w-4" />
                      My Trips
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Dialog open={openAuth} onOpenChange={setOpenAuth}>
                <DialogTrigger asChild>
                  <Button>Login</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  {isLogin ? (
                    <LoginForm 
                      onSuccess={() => setOpenAuth(false)}
                      onSwitchToRegister={() => setIsLogin(false)}
                    />
                  ) : (
                    <RegisterForm 
                      onSuccess={() => setOpenAuth(false)}
                      onSwitchToLogin={() => setIsLogin(true)}
                    />
                  )}
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </header>

      <Dialog open={openSearch} onOpenChange={setOpenSearch}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSearch}>
            <div className="flex items-center border rounded-md overflow-hidden">
              <Input
                className="border-0 focus-visible:ring-0 text-sm"
                placeholder="Search destinations, cities, activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" variant="ghost" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navigation;
