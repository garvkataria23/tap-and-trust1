import { QrCode, Zap, Shield, Clock, MessageCircle, Users, Sparkles, ArrowRight, Scan, Heart } from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';
import Logo from '@/react-app/components/Logo';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '@/react-app/contexts/useAuth';
import { useEffect, useState } from 'react';

const moodTags = [
  { label: 'Chill', color: 'bg-blue-400' },
  { label: 'Looking to Collaborate', color: 'bg-purple-500' },
  { label: 'Just Browsing', color: 'bg-green-400' },
  { label: 'Open to Talk', color: 'bg-amber-400' },
];

const features = [
  {
    icon: MessageCircle,
    title: 'Icebreaker Prompts',
    description: 'Fun conversation starters appear after connecting, making it easy to break the ice.',
    color: 'from-amber-400 to-orange-500',
  },
  {
    icon: Sparkles,
    title: 'Smart Mood Tags',
    description: 'Set your vibe - Chill, Looking to Collaborate, or Open to Talk. Your QR shows your mood.',
    color: 'from-purple-400 to-pink-500',
  },
  {
    icon: Users,
    title: 'Profile Shoutouts',
    description: 'Create mini posters that others can scan. Perfect for artists, creators, and club leaders.',
    color: 'from-cyan-400 to-blue-500',
  },
  {
    icon: Heart,
    title: 'Friend Categories',
    description: 'Organize connections with tags - Event, Classmate, Random Meet, and more.',
    color: 'from-rose-400 to-red-500',
  },
  {
    icon: Clock,
    title: 'Request Expiry',
    description: '24-hour auto-delete for pending requests keeps your app clean and secure.',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'No phone numbers shared. Connect through QR codes with complete privacy.',
    color: 'from-indigo-400 to-violet-500',
  },
];

export default function Home() {
  const { user, isPending } = useAuth();
  const navigate = useNavigate();
  const [visibleFeatures, setVisibleFeatures] = useState<number[]>([]);

  useEffect(() => {
    if (!isPending && user) {
      navigate('/dashboard');
    }
  }, [user, isPending, navigate]);

  // Stagger feature visibility on mount
  useEffect(() => {
    features.forEach((_, index) => {
      setTimeout(() => {
        setVisibleFeatures(prev => [...prev, index]);
      }, index * 100);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/30 overflow-hidden">
      {/* Animated decorative background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 blur-3xl animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-accent/25 to-primary/15 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-40 right-1/4 w-72 h-72 rounded-full bg-gradient-to-br from-primary/20 to-amber-400/15 blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-md bg-background/50 border-b border-border/30 sticky top-0">
        <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <Logo size="md" className="rounded-xl shadow-lg shadow-purple-400/30 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-on-scroll">Tap & Trust</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="hover:bg-accent/10 transition-colors">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 transition-all duration-300 text-white">
              <Link to="/signup">
                Get Started
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-slide-in-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm font-medium hover:border-accent/60 hover:bg-accent/20 transition-all duration-300 group">
              <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              Connect in seconds, not minutes
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
              Make friends with a{' '}
              <span className="relative inline-block">
                <span className="absolute inset-0 blur-lg opacity-75 bg-gradient-to-r from-primary via-accent to-primary animate-shimmer" />
                <span className="relative bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse-glow">
                  single scan
                </span>
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg hover:text-foreground transition-colors duration-300">
              No more awkward number exchanges. Share your unique QR code, connect instantly, and start conversations with fun icebreakers.
            </p>

            {/* Animated mood tags preview */}
            <div className="flex flex-wrap gap-3">
              {moodTags.map((tag, idx) => (
                <span
                  key={tag.label}
                  className={`px-4 py-2 rounded-full text-white text-sm font-semibold ${tag.color} shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
                  style={{
                    animation: `bounce-in 0.5s ease-out ${idx * 0.1}s both`,
                  }}
                >
                  {tag.label}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" asChild className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-xl shadow-primary/40 text-white font-semibold text-lg px-8 hover:shadow-2xl hover:shadow-primary/60 hover:scale-105 transition-all duration-300 group">
                <Link to="/signup">
                  <Scan className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  Start Connecting
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group">
                See How It Works
              </Button>
            </div>
          </div>

          {/* Animated QR Code Preview Card */}
          <div className="relative animate-slide-in-right">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-accent/30 rounded-3xl blur-2xl transform -rotate-3 animate-float" />
            <div className="relative bg-gradient-to-br from-card to-card/80 rounded-3xl p-8 shadow-2xl border border-accent/30 backdrop-blur-xl hover:border-accent/60 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/30 group">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 pointer-events-none" />
              <div className="relative space-y-6">
                <div className="flex items-center gap-4 group/avatar">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-amber-500/40 group-hover/avatar:scale-110 transition-transform duration-300">
                    A
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Alex Chen</h3>
                    <p className="text-muted-foreground text-sm">@alexchen</p>
                  </div>
                  <span className="ml-auto px-3 py-1.5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white text-sm font-medium shadow-lg">
                    Open to Talk
                  </span>
                </div>

                {/* Animated QR Code placeholder */}
                <div className="aspect-square max-w-xs mx-auto bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 flex items-center justify-center border-2 border-dashed border-accent/40 hover:border-accent/70 transition-colors duration-300 group/qr">
                  <div className="grid grid-cols-5 gap-1.5 group-hover/qr:scale-110 transition-transform duration-300">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-sm transition-all duration-300 ${
                          [0, 1, 2, 4, 5, 6, 10, 12, 14, 18, 19, 20, 22, 23, 24].includes(i)
                            ? 'bg-foreground group-hover/qr:bg-primary'
                            : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-center text-muted-foreground hover:text-foreground transition-colors duration-300">
                  Scan to connect with Alex
                </p>

                <div className="flex gap-3">
                  <Button className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 text-white font-semibold hover:scale-105 transition-all duration-300">
                    Share QR
                  </Button>
                  <Button variant="outline" className="flex-1 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group/scan">
                    <Scan className="w-4 h-4 mr-2 group-hover/scan:rotate-12 transition-transform duration-300" />
                    Scan Code
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 bg-gradient-to-b from-secondary/40 to-background py-32 border-y border-border/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center space-y-4 mb-20 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Everything you need to{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-pulse-glow">
                connect better
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto hover:text-foreground transition-colors duration-300">
              From icebreaker prompts to friend categories, we've thought of everything to make real-world connections fun and frictionless.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={feature.title}
                className={`group relative overflow-hidden bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/30 hover:border-accent/60 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-2 cursor-pointer ${
                  visibleFeatures.includes(idx) ? 'animate-scale-in' : 'opacity-0'
                }`}
                style={{
                  animationDelay: `${idx * 100}ms`,
                }}
              >
                {/* Gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative space-y-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-125 group-hover:rotate-6 transition-all duration-300`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300">{feature.description}</p>
                </div>

                {/* Accent border animation on hover */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center space-y-4 mb-20 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Three steps to new connections
            </h2>
            <p className="text-xl text-muted-foreground hover:text-foreground transition-colors duration-300">
              Making friends has never been this simple
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create Your Profile',
                description: 'Set up your profile with a mood tag and personalize your QR code appearance.',
              },
              {
                step: '02',
                title: 'Share or Scan',
                description: 'Show your QR at events or scan others to send instant friend requests.',
              },
              {
                step: '03',
                title: 'Break the Ice',
                description: 'Get fun icebreaker prompts and start meaningful conversations right away.',
              },
            ].map((item, i) => (
              <div key={item.step} className="relative group animate-slide-up" style={{ animationDelay: `${i * 150}ms` }}>
                {i < 2 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-1 bg-gradient-to-r from-primary/50 via-accent/30 to-transparent group-hover:from-primary group-hover:via-accent transition-all duration-500" />
                )}
                <div className="relative text-center space-y-4 p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/30 hover:border-accent/60 transition-all duration-500 hover:bg-card/80 hover:shadow-xl hover:shadow-accent/10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white text-2xl font-bold shadow-xl shadow-primary/30 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-primary/50 transition-all duration-300">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-accent p-12 md:p-16 text-center group hover:shadow-2xl hover:shadow-primary/40 transition-all duration-500">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bTAtMThjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
            
            {/* Floating gradient orbs */}
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-white/10 blur-2xl group-hover:scale-125 transition-transform duration-500" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-white/10 blur-2xl group-hover:scale-125 transition-transform duration-500" />

            <div className="relative space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight group-hover:scale-105 transition-transform duration-300">
                Ready to connect?
              </h2>
              <p className="text-xl text-white/90 max-w-xl mx-auto leading-relaxed">
                Join thousands of students and professionals making meaningful connections at events, meetups, and beyond.
              </p>
              <Button size="lg" variant="secondary" asChild className="text-lg px-8 shadow-xl hover:shadow-2xl group/btn hover:scale-110 transition-all duration-300">
                <Link to="/signup">
                  Create Your QR Code
                  <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <QrCode className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold">Tap & Trust</span>
            </div>
            <p className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-300">
              © 2025 Tap & Trust. Making connections simple and secure.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
