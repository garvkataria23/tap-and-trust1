import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { MapPin, Heart, Users, Loader2 } from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/react-app/components/ui/avatar';
import { Badge } from '@/react-app/components/ui/badge';
import Logo from '@/react-app/components/Logo';
import { useAuth } from '@/react-app/contexts/useAuth';

interface NearbyUser {
  id: string;
  name: string;
  avatar_url: string;
  mood_tag: string;
  distance: number;
  interests: string[];
}

export default function DiscoverPage() {
  const navigate = useNavigate();
  const { user, isPending } = useAuth();
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!isPending && !user) {
      navigate('/login');
    }
  }, [user, isPending, navigate]);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          fetchNearbyUsers();
        },
        () => {
          // Demo mode - use default location
          setLocation({ lat: 40.7128, lng: -74.0060 });
          fetchNearbyUsers();
        }
      );
    }
  }, []);

  const fetchNearbyUsers = () => {
    // Mock data for nearby users - in future will use real geolocation
    const mockUsers: NearbyUser[] = [
      {
        id: '1',
        name: 'Sarah Chen',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        mood_tag: 'Open to Talk',
        distance: 0.3,
        interests: ['Music', 'Coffee', 'Art'],
      },
      {
        id: '2',
        name: 'Marcus Johnson',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
        mood_tag: 'Looking to Collaborate',
        distance: 0.5,
        interests: ['Tech', 'Gaming', 'Hiking'],
      },
      {
        id: '3',
        name: 'Emma Wilson',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
        mood_tag: 'Chill',
        distance: 0.7,
        interests: ['Photography', 'Travel', 'Food'],
      },
      {
        id: '4',
        name: 'Alex Rodriguez',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        mood_tag: 'Open to Talk',
        distance: 1.2,
        interests: ['Sports', 'Movies', 'Cooking'],
      },
    ];
    setNearbyUsers(mockUsers);
    setLoading(false);
  };

  const moodColors: Record<string, string> = {
    'Open to Talk': 'bg-green-500/20 text-green-400',
    'Chill': 'bg-blue-500/20 text-blue-400',
    'Looking to Collaborate': 'bg-purple-500/20 text-purple-400',
    'Just Browsing': 'bg-gray-500/20 text-gray-400',
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link to="/dashboard" className="flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity">
            <Logo size="md" />
            <span className="text-lg font-bold">Tap & Trust</span>
          </Link>
          <h1 className="text-3xl font-bold">Discover Nearby</h1>
          {location && (
            <p className="text-sm text-muted-foreground mt-2">
              📍 Finding amazing people near {location.lat.toFixed(2)}°, {location.lng.toFixed(2)}°
            </p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-12 h-12 animate-spin text-cyan-400 mb-4" />
            <p className="text-white/60">Searching for nearby users...</p>
          </div>
        ) : nearbyUsers.length === 0 ? (
          <div className="text-center py-16 space-y-4 bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
            <Users className="w-16 h-16 text-white/30 mx-auto" />
            <p className="text-white/80">No one nearby at the moment</p>
            <p className="text-sm text-white/50">Check back later or scan a QR code to add friends</p>
            <Link to="/dashboard">
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold">Back to Dashboard</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Grid of nearby users */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {nearbyUsers.map((person) => (
                <div
                  key={person.id}
                  className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-6 border border-white/20 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer transform hover:scale-105"
                >
                  {/* Gradient border effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/0 via-transparent to-purple-400/0 group-hover:from-cyan-400/30 group-hover:to-purple-400/30 transition-all duration-300 pointer-events-none" />
                  
                  <div className="relative space-y-4">
                    {/* User Info */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Avatar className="w-14 h-14 border-2 border-cyan-400/30 group-hover:border-cyan-400 transition-all shadow-lg">
                          <AvatarImage src={person.avatar_url} />
                          <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white font-bold">
                            {person.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold text-white text-lg">{person.name}</h3>
                          <p className="text-sm text-white/60 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-cyan-400" />
                            {person.distance} km away
                          </p>
                        </div>
                      </div>
                      <Heart className="w-5 h-5 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Mood Tag */}
                    <Badge className={`w-fit font-semibold ${moodColors[person.mood_tag] || 'bg-cyan-500/30 text-cyan-300'}`}>
                      {person.mood_tag}
                    </Badge>

                    {/* Interests */}
                    <div>
                      <p className="text-xs text-white/50 mb-2 font-semibold uppercase tracking-wider">Interests</p>
                      <div className="flex flex-wrap gap-2">
                        {person.interests.map((interest) => (
                          <span
                            key={interest}
                            className="px-3 py-1 rounded-full bg-white/10 hover:bg-cyan-500/30 text-white/80 hover:text-cyan-300 text-xs transition-all font-medium"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-4">
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg"
                        onClick={() => navigate(`/chat/${person.id}`)}
                      >
                        💬 Message
                      </Button>
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg"
                        onClick={() => navigate(`/friends`)}
                      >
                        ⭐ Connect
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-br from-cyan-500/20 via-transparent to-blue-500/20 backdrop-blur rounded-2xl p-6 border border-cyan-400/30 space-y-4 mt-8">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                🌍 Discovery Tips
              </h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>Users are sorted by distance from your location</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>Enable location access for better discoveries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>Check mood tags to find people with similar vibes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>Connect with people nearby for real local friendships</span>
                </li>
              </ul>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
