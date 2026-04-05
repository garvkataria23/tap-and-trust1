import { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '@/react-app/contexts/useAuth';
import { Button } from '@/react-app/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/react-app/components/ui/avatar';
import Logo from '@/react-app/components/Logo';
import ThemeSelector from '@/react-app/components/ThemeSelector';
import { 
  Scan, 
  Users, 
  Settings, 
  LogOut, 
  Loader2,
  Sparkles,
  FolderOpen,
  Megaphone,
  QrCode,
  MapPin,
  X,
  Send,
  Trophy,
  Music,
  ArrowRight,
  Zap,
} from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, isPending, logout } = useAuth();
  const [shoutoutOpen, setShoutoutOpen] = useState(false);
  const [shoutoutText, setShoutoutText] = useState('');
  const [taggedConnections, setTaggedConnections] = useState<string[]>([]);
  const [profileData, setProfileData] = useState({
    displayName: '',
    bio: '',
    mood: 'Open to Talk',
    photo: null as string | null,
    interests: [] as string[]
  });

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  useEffect(() => {
    if (!isPending && !user) {
      navigate('/login');
    }
  }, [user, isPending, navigate]);

  useEffect(() => {
    const loadProfileData = () => {
      const saved = localStorage.getItem('profile-data');
      if (saved) {
        try {
          setProfileData(JSON.parse(saved));
        } catch (err) {
          console.error('Failed to parse profile data:', err);
        }
      }
    };

    loadProfileData();
    const handleFocus = () => loadProfileData();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleConnection = (connectionId: string) => {
    setTaggedConnections(prev => 
      prev.includes(connectionId) 
        ? prev.filter(id => id !== connectionId)
        : [...prev, connectionId]
    );
  };

  const mockConnections = [
    { id: '1', name: 'Alex', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
    { id: '2', name: 'Jordan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan' },
    { id: '3', name: 'Sam', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam' },
    { id: '4', name: 'Casey', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Casey' },
  ];

  if (isPending || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const userName = user.name || user.email.split('@')[0];
  const userInitials = userName.slice(0, 2).toUpperCase();

  const navItems = [
    {
      to: '/profile',
      label: 'My Profile',
      description: 'Customize your identity',
      icon: Settings,
      gradient: 'from-amber-400 to-orange-500',
      bgGlow: 'from-amber-500/15 to-orange-600/10',
      borderColor: 'border-amber-500/25 hover:border-amber-400/50',
      shadowColor: 'shadow-amber-500/30',
      span: 'col-span-1',
    },
    {
      to: '/scanner',
      label: 'Scan Code',
      description: 'Connect instantly',
      icon: Scan,
      gradient: 'from-cyan-400 to-blue-500',
      bgGlow: 'from-cyan-500/15 to-blue-600/10',
      borderColor: 'border-cyan-500/25 hover:border-cyan-400/50',
      shadowColor: 'shadow-cyan-500/30',
      span: 'col-span-1',
    },
    {
      to: '/discover',
      label: 'Discover',
      description: 'Find people nearby',
      icon: MapPin,
      gradient: 'from-emerald-400 to-teal-500',
      bgGlow: 'from-emerald-500/15 to-teal-600/10',
      borderColor: 'border-emerald-500/25 hover:border-emerald-400/50',
      shadowColor: 'shadow-emerald-500/30',
      span: 'col-span-1',
    },
    {
      to: '/friends',
      label: 'My Friends',
      description: 'Your connections',
      icon: Users,
      gradient: 'from-violet-400 to-purple-500',
      bgGlow: 'from-violet-500/15 to-purple-600/10',
      borderColor: 'border-violet-500/25 hover:border-violet-400/50',
      shadowColor: 'shadow-violet-500/30',
      span: 'col-span-1',
    },
    {
      to: '/games',
      label: 'Games',
      description: 'Play & compete',
      icon: Trophy,
      gradient: 'from-rose-400 to-red-500',
      bgGlow: 'from-rose-500/15 to-red-600/10',
      borderColor: 'border-rose-500/25 hover:border-rose-400/50',
      shadowColor: 'shadow-rose-500/30',
      span: 'col-span-1',
    },
    {
      to: '/music',
      label: 'Music',
      description: 'Listen & discover',
      icon: Music,
      gradient: 'from-indigo-400 to-blue-500',
      bgGlow: 'from-indigo-500/15 to-blue-600/10',
      borderColor: 'border-indigo-500/25 hover:border-indigo-400/50',
      shadowColor: 'shadow-indigo-500/30',
      span: 'col-span-1',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-2xl">
        <div className="max-w-5xl mx-auto px-3 sm:px-5 py-2 sm:py-3.5 flex items-center justify-between gap-2">
          <Link to="/dashboard" className="flex items-center gap-1.5 sm:gap-2.5 group">
            <Logo size="md" className="rounded-lg sm:rounded-xl shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow flex-shrink-0" />
            <span className="text-sm sm:text-base font-bold tracking-tight text-foreground hidden sm:block">Tap & Trust</span>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeSelector />
            
            <div className="flex items-center gap-1.5 sm:gap-2.5 ml-1 sm:ml-2 pl-1.5 sm:pl-3 border-l border-border">
              <Avatar className="w-8 h-8 ring-1.5 ring-border flex-shrink-0">
                <AvatarImage src={profileData.photo || user.picture || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-xs font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs sm:text-sm font-medium text-foreground/80 hidden md:block">{userName}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="ml-0 sm:ml-1 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 h-8 w-8 p-0 flex-shrink-0"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-3 sm:px-5 py-6 sm:py-8 space-y-8 sm:space-y-10">
        {/* Hero greeting */}
        <div className="relative">
          {/* Decorative glow */}
          <div className="absolute -top-16 left-1/4 w-96 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-12 right-1/4 w-64 h-40 bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                {greeting},{' '}
                <span className="bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 bg-clip-text text-transparent">
                  {userName}
                </span>
              </h1>
              <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
                Share your QR code to start connecting.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden sm:inline">{profileData.mood || 'Open to Talk'}</span><span className="sm:hidden text-xs truncate">{(profileData.mood || 'Open to Talk').split(' ')[0]}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Navigation grid */}
        <section>
          <div className="flex items-center gap-2 mb-3 sm:mb-5">
            <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <h2 className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">Quick Actions</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const inner = (
                <div
                  className={`group relative overflow-hidden rounded-xl sm:rounded-2xl border ${item.borderColor} bg-gradient-to-br ${item.bgGlow} backdrop-blur-sm p-3 sm:p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:${item.shadowColor} cursor-pointer h-full flex flex-col`}
                >
                  {/* Subtle corner glow */}
                  <div className={`absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br ${item.gradient} opacity-[0.08] rounded-full blur-2xl group-hover:opacity-[0.15] transition-opacity duration-500`} />

                  <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg ${item.shadowColor} mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                    <Icon className="w-5 sm:w-5.5 h-5 sm:h-5.5 text-white" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-xs sm:text-sm text-foreground/90 group-hover:text-foreground transition-colors line-clamp-1">
                      {item.label}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 group-hover:text-foreground/60 transition-colors line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              );

              return (
                <Link to={item.to} key={item.label} className={`${item.span} block`}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Bottom section: QR + Feature cards */}
        <div className="grid lg:grid-cols-5 gap-3 sm:gap-4">
          {/* QR Code card */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-xl sm:rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/[0.07] to-indigo-500/[0.04] p-4 sm:p-6">
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl" />
            
            <h2 className="text-sm sm:text-base font-bold mb-3 sm:mb-5 flex items-center gap-2 text-foreground/90">
              <QrCode className="w-4 sm:w-4.5 h-4 sm:h-4.5 text-purple-500 flex-shrink-0" />
              Your QR Profile
            </h2>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <Avatar className="w-9 sm:w-11 h-9 sm:h-11 ring-2 ring-purple-500/30 flex-shrink-0">
                  <AvatarImage src={profileData.photo || user.picture || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-xs sm:text-sm font-bold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h3 className="font-bold text-xs sm:text-sm text-foreground/90 truncate">{userName}</h3>
                </div>
              </div>

              <div className="flex justify-center p-3 bg-white rounded-xl">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`tap-trust://profile/${user?.email || 'user'}`)}`}
                  alt="Your QR Code"
                  width={180}
                  height={180}
                  className="rounded-lg"
                />
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 h-9 text-xs bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-semibold shadow-lg shadow-purple-500/30 border-0">
                  Share QR
                </Button>
                <Button variant="outline" className="flex-1 h-9 text-xs border-border text-muted-foreground hover:text-foreground hover:bg-accent/10 hover:border-border">
                  Download
                </Button>
              </div>
            </div>
          </div>

          {/* Feature cards */}
          <div className="lg:col-span-3 space-y-2 sm:space-y-3">
            <Link to="/profile" className="block group">
              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/[0.07] via-orange-500/[0.04] to-transparent p-3 sm:p-5 hover:border-amber-400/40 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl" />
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xs sm:text-sm font-bold flex items-center gap-2 text-foreground/90 mb-1">
                      <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-amber-500 flex-shrink-0" />
                      Set Your Mood
                    </h2>
                    <p className="text-muted-foreground text-xs mb-2">
                      Let others know your vibe.
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {['😎', '🤝', '👀', '💬'].map((mood) => (
                        <span
                          key={mood}
                          className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-700 dark:text-amber-300/80 border border-amber-500/15"
                        >
                          {mood}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-muted-foreground/30 group-hover:text-amber-400/60 group-hover:translate-x-0.5 transition-all mt-1 flex-shrink-0" />
                </div>
              </div>
            </Link>

            <Link to="/friends" className="block group">
              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/[0.07] via-blue-500/[0.04] to-transparent p-3 sm:p-5 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl" />
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xs sm:text-sm font-bold flex items-center gap-2 text-foreground/90 mb-1">
                      <FolderOpen className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-cyan-500 flex-shrink-0" />
                      Friend Tags
                    </h2>
                    <p className="text-muted-foreground text-xs mb-2">
                      Organize your connections.
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {['👥', '👨‍🎓', '🎲', '💼'].map((cat) => (
                        <span
                          key={cat}
                          className="px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-700 dark:text-cyan-300/80 border border-cyan-500/15"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-muted-foreground/30 group-hover:text-cyan-400/60 group-hover:translate-x-0.5 transition-all mt-1 flex-shrink-0" />
                </div>
              </div>
            </Link>

            <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-rose-500/20 bg-gradient-to-r from-rose-500/[0.07] via-pink-500/[0.04] to-transparent p-3 sm:p-5 hover:border-rose-400/40 hover:shadow-lg hover:shadow-rose-500/10 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl" />
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xs sm:text-sm font-bold flex items-center gap-2 text-foreground/90 mb-1">
                    <Megaphone className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-rose-500 flex-shrink-0" />
                    Shoutout
                  </h2>
                  <p className="text-muted-foreground text-xs mb-2">
                    Share a message with friends.
                  </p>
                  <button 
                    onClick={() => setShoutoutOpen(true)}
                    className="inline-flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-semibold transition-all shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40">
                    <Send className="w-3 h-3" />
                    <span className="hidden sm:inline">Create</span><span className="sm:hidden">+</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Shoutout Modal */}
      {shoutoutOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-card rounded-xl sm:rounded-2xl border border-border shadow-2xl shadow-purple-500/10 max-w-md w-full p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-pink-500 flex-shrink-0" />
                Shoutout
              </h2>
              <button
                onClick={() => setShoutoutOpen(false)}
                className="p-1 hover:bg-muted/30 rounded-lg transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <textarea
              value={shoutoutText}
              onChange={(e) => setShoutoutText(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:border-pink-500/40 focus:outline-none focus:ring-1 focus:ring-pink-500/20 resize-none text-sm"
              rows={4}
              maxLength={280}
            />
            
            {/* Tag Connections */}
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs font-semibold text-foreground mb-3">Tag Connections</p>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {mockConnections.map(connection => (
                  <button
                    key={connection.id}
                    onClick={() => toggleConnection(connection.id)}
                    className={`p-2 rounded-lg transition-all text-sm font-medium flex items-center gap-2 ${
                      taggedConnections.includes(connection.id)
                        ? 'bg-pink-500/30 border border-pink-500/60 text-pink-200'
                        : 'bg-muted/30 border border-border text-muted-foreground hover:border-border/80'
                    }`}
                  >
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={connection.avatar} />
                      <AvatarFallback>{connection.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs truncate">{connection.name}</span>
                  </button>
                ))}
              </div>
              {taggedConnections.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {taggedConnections.map(id => {
                    const connection = mockConnections.find(c => c.id === id);
                    return connection ? (
                      <span key={id} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-pink-500/20 text-pink-300 border border-pink-500/30">
                        @{connection.name}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleConnection(id);
                          }}
                          className="ml-1 hover:text-pink-200"
                        >
                          ×
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </div>
            
            <p className="text-xs text-muted-foreground text-right mt-1.5 sm:mt-2 mb-3 sm:mb-4">{shoutoutText.length}/280</p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShoutoutOpen(false)}
                className="flex-1 h-9 sm:h-10 border-border text-muted-foreground hover:bg-muted/20 hover:text-foreground text-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (shoutoutText.trim()) {
                    const taggedNames = taggedConnections
                      .map(id => mockConnections.find(c => c.id === id)?.name)
                      .filter(Boolean)
                      .join(', ');
                    alert(`Shoutout posted to ${taggedNames || 'your friends'}! 🎉`);
                    setShoutoutText('');
                    setTaggedConnections([]);
                    setShoutoutOpen(false);
                  }
                }}
                className="flex-1 h-10 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold text-sm"
              >
                <Send className="w-3.5 h-3.5 mr-1.5" />
                Post
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
