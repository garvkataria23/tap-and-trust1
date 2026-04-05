import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '@/react-app/contexts/useAuth';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Loader2, Users, MessageCircle, Music, ArrowRight } from 'lucide-react';
import Logo from '@/react-app/components/Logo';

type AuthMode = 'signup' | 'login';

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, login, isPending } = useAuth();
  const [mode, setMode] = useState<AuthMode>('signup');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user && !isPending) {
      navigate('/dashboard');
    }
  }, [user, isPending, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (!name || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      // Generate email from name if not provided
      const generatedEmail = `${name.toLowerCase().replace(/\s+/g, '.')}@tap-trust.local`;
      login(generatedEmail, name);
      navigate('/dashboard');
    } catch (err) {
      setError('Authentication failed. Please try again.');
      setIsLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex">
      {/* Left side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12">
        <Link to="/" className="flex items-center gap-3 w-fit group">
          <Logo size="md" />
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Tap & Trust
          </span>
        </Link>

        <div className="space-y-12">
          <div>
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              Connect, Chat &amp; Share with Friends
            </h1>
            <p className="text-xl text-white/70">
              Discover a new way to build meaningful connections. Chat instantly, share music, and enjoy games with friends nearby.
            </p>
          </div>

          <div className="space-y-6">
            {[
              { icon: Users, title: 'Meet Friends', desc: 'Scan QR codes to connect instantly' },
              { icon: MessageCircle, title: 'Real-time Chat', desc: 'Share thoughts and moments together' },
              { icon: Music, title: 'Music Sync', desc: 'Discover and share your favorite songs' },
            ].map((feature, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-white/60">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/10">
            <div className="flex gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-white/10" />
              ))}
            </div>
            <p className="text-sm text-white/70 mt-4">Join 10K+ users building their network every day</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-white/40">Available on iOS, Android & Web</p>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-8">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-2 group">
              <Logo size="lg" showText={true} />
            </Link>
          </div>

          {/* Auth Card */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-8">
            {/* Tabs */}
            <div className="flex gap-4 bg-slate-900 p-1 rounded-xl">
              {(['signup', 'login'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m);
                    setError('');
                  }}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all duration-200 ${
                    mode === m
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {m === 'signup' ? 'Sign Up' : 'Sign In'}
                </button>
              ))}
            </div>

            {/* Header */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {mode === 'signup' ? 'Get Started' : 'Welcome Back'}
              </h2>
              <p className="text-sm text-white/60">
                {mode === 'signup'
                  ? 'Join thousands of users connecting instantly'
                  : 'Sign in to continue to your account'}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 space-y-1">
                <p className="text-sm font-semibold text-red-400">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2.5">
                  {mode === 'signup' ? 'Full Name' : 'Name'}
                </label>
                <Input
                  type="text"
                  placeholder={mode === 'signup' ? 'John Doe' : 'Your Name'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/20 disabled:opacity-50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2.5">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/20 disabled:opacity-50 transition-all"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {mode === 'signup' ? 'Creating account...' : 'Signing in...'}
                  </>
                ) : (
                  <>
                    {mode === 'signup' ? 'Create Account' : 'Sign In'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="text-center text-xs text-white/50 pt-4 border-t border-white/10">
              <p>
                By continuing, you agree to our{' '}
                <a href="#" className="text-purple-400 hover:underline">
                  Terms
                </a>{' '}
                and{' '}
                <a href="#" className="text-purple-400 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>

          {/* Bottom text */}
          <p className="text-center text-sm text-white/60 mt-6">
            {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => {
                setMode(mode === 'signup' ? 'login' : 'signup');
                setError('');
              }}
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
            >
              {mode === 'signup' ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
