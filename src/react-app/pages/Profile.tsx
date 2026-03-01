import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '@/react-app/contexts/useAuth';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/react-app/components/ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/react-app/components/ui/dropdown-menu';
import { 
  QrCode, 
  ArrowLeft,
  Loader2,
  Sparkles,
  Heart,
  X,
  Plus,
  Check,
  MessageCircle,
  UserCheck,
  Share2,
  Camera,
  Edit3,
  Download,
  MoreVertical
} from 'lucide-react';

const MOOD_TAGS = [
  { label: 'Chill', color: 'bg-blue-400', emoji: '😎' },
  { label: 'Looking to Collaborate', color: 'bg-purple-500', emoji: '🤝' },
  { label: 'Just Browsing', color: 'bg-gray-400', emoji: '👀' },
  { label: 'Open to Talk', color: 'bg-green-400', emoji: '💬' },
];

const SUGGESTED_INTERESTS = [
  'Music', 'Gaming', 'Photography', 'Art', 'Sports', 'Coding', 
  'Reading', 'Travel', 'Food', 'Movies', 'Fitness', 'Dancing',
  'Anime', 'Fashion', 'Tech', 'Nature', 'Cooking', 'Writing'
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isPending } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [moodTag, setMoodTag] = useState('Open to Talk');
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const [saved, setSaved] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);

  useEffect(() => {
    if (!isPending && !user) {
      navigate('/login');
    }
  }, [user, isPending, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      // Load from localStorage
      const savedProfile = localStorage.getItem('profile-data');
      if (savedProfile) {
        const data = JSON.parse(savedProfile);
        setDisplayName(data.displayName || user?.name || '');
        setBio(data.bio || '');
        setMoodTag(data.mood || 'Open to Talk');
        setInterests(data.interests || []);
        setProfilePhoto(data.photo || null);
      } else {
        setDisplayName(user?.name || '');
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setDisplayName(user?.name || '');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save to localStorage
      const profileData = {
        displayName,
        bio,
        mood: moodTag,
        interests,
        photo: profilePhoto
      };
      localStorage.setItem('profile-data', JSON.stringify(profileData));
      
      // Update user object in localStorage to keep it in sync
      if (user) {
        const updatedUser = {
          ...user,
          picture: profilePhoto || user.picture
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      setSaved(true);
      setIsEditMode(false);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save profile:', err);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setProfilePhoto(base64);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Failed to upload photo:', err);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const addInterest = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !interests.includes(trimmed) && interests.length < 12) {
      setInterests([...interests, trimmed]);
    }
    setNewInterest('');
  };

  const removeInterest = (tag: string) => {
    setInterests(interests.filter(i => i !== tag));
  };

  if (isPending || loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const userInitials = (displayName || user.email).slice(0, 2).toUpperCase();
  const moodEmoji = MOOD_TAGS.find(m => m.label === moodTag)?.emoji || '😎';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-1 sm:gap-2 text-white/60 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium hidden sm:inline">Back</span>
          </Link>
          
          <span className="font-bold text-white text-base sm:text-lg truncate">{displayName || 'Profile'}</span>

          <DropdownMenu open={optionsOpen} onOpenChange={setOptionsOpen}>
            <DropdownMenuTrigger asChild>
              <button className="w-9 h-9 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors">
                <MoreVertical className="w-5 h-5 text-white/60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-900 border border-white/10 rounded-lg shadow-lg">
              <DropdownMenuItem 
                onClick={() => {
                  setIsEditMode(true);
                  setOptionsOpen(false);
                }}
                className="text-white focus:bg-white/10 cursor-pointer"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        {/* Avatar Section */}
        <div className="relative px-4 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 mb-6 relative z-20">
            <div className="relative group">
              <Avatar className="w-28 sm:w-40 h-28 sm:h-40 ring-4 ring-slate-950 shadow-2xl">
                <AvatarImage src={profilePhoto || user.picture || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-4xl sm:text-6xl">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              
              {isEditMode && (
                <label className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer group-hover:backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-1">
                    <Camera className="w-6 h-6 text-white" />
                    <span className="text-xs text-white font-medium">Change</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="flex-1 w-full sm:w-auto">
              {isEditMode ? (
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-500/50 rounded-lg h-10 sm:h-12 text-xl sm:text-2xl font-bold"
                  maxLength={50}
                />
              ) : (
                <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">{displayName || 'Unnamed'}</h1>
              )}
            </div>
          </div>

          {/* Stats Section */}
          {!isEditMode && (
            <div className="inline-flex items-center gap-2 mb-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur rounded-xl p-3 border border-purple-500/30">
              <span className="text-2xl font-bold text-white">{interests.length}</span>
              <span className="text-white/70">Interests</span>
            </div>
          )}

          {/* Action Buttons */}
          {!isEditMode && (
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6 w-full">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-10 sm:h-11 rounded-lg font-semibold text-white text-xs sm:text-sm transition-all duration-200 shadow-lg hover:shadow-blue-500/50 border border-blue-500/30">
                <MessageCircle className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Message</span><span className="sm:hidden">Chat</span>
              </Button>
              <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-10 sm:h-11 rounded-lg font-semibold text-white text-xs sm:text-sm transition-all duration-200 shadow-lg hover:shadow-green-500/50 border border-green-500/30">
                <UserCheck className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Connect</span><span className="sm:hidden">Add</span>
              </Button>
              <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 h-10 sm:h-11 rounded-lg font-semibold text-white text-xs sm:text-sm transition-all duration-200 shadow-lg hover:shadow-cyan-500/50 border border-cyan-500/30">
                <Share2 className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Share</span><span className="sm:hidden">Send</span>
              </Button>
            </div>
          )}

          {/* Bio Section */}
          {isEditMode && (
            <div className="mb-6 bg-white/5 border border-white/10 rounded-2xl p-4">
              <label className="block text-sm font-semibold mb-2 text-white/90">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell people about yourself..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-purple-500/50 focus:outline-none resize-none"
                rows={3}
                maxLength={200}
              />
              <p className="text-xs text-white/50 mt-1 text-right">{bio.length}/200</p>
            </div>
          )}

          {!isEditMode && bio && (
            <p className="text-white/80 text-base mb-6 leading-relaxed">{bio}</p>
          )}

          {/* Mood Tag */}
          {!isEditMode && (
            <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 bg-white/5 backdrop-blur rounded-xl p-3 sm:p-4 w-fit border border-white/10">
              <span className="text-xl sm:text-2xl">{moodEmoji}</span>
              <div>
                <p className="text-xs text-white/60">Current Mood</p>
                <p className="text-white font-semibold text-sm">{moodTag}</p>
              </div>
            </div>
          )}

          {/* Mood Selection - Edit Mode */}
          {isEditMode && (
            <div className="mb-6 sm:mb-8 bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2 text-white">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Set Your Mood
              </h2>
              
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {MOOD_TAGS.map((mood) => (
                  <button
                    key={mood.label}
                    onClick={() => setMoodTag(mood.label)}
                    className={`relative p-3 sm:p-4 rounded-xl text-left transition-all duration-300 text-sm sm:text-base ${
                      moodTag === mood.label
                        ? `${mood.color} text-white shadow-xl scale-105 ring-2 ring-offset-2 ring-offset-slate-950`
                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="text-2xl mb-1 block">{mood.emoji}</span>
                    <span className="font-semibold text-sm">{mood.label}</span>
                    {moodTag === mood.label && (
                      <Check className="absolute top-2 right-2 w-5 h-5" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Interests Section */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <Heart className="w-5 h-5 text-pink-400" />
              {isEditMode ? 'Edit Interests' : 'Interests'}
            </h2>

            {/* Current Interests */}
            <div className="flex flex-wrap gap-2 mb-4">
              {interests.map((interest) => (
                <div
                  key={interest}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white text-sm font-medium border border-purple-500/20 hover:border-purple-500/50 transition-all group"
                >
                  {interest}
                  {isEditMode && (
                    <button
                      onClick={() => removeInterest(interest)}
                      className="w-4 h-4 rounded-full bg-white/10 group-hover:bg-red-500/50 flex items-center justify-center transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
              {interests.length === 0 && (
                <span className="text-white/50 text-sm italic">No interests yet</span>
              )}
            </div>

            {/* Add Custom Interest */}
            {isEditMode && (
              <>
                <div className="flex gap-2 mb-4">
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Add interest..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-500/50 rounded-lg"
                    maxLength={20}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addInterest(newInterest);
                      }
                    }}
                  />
                  <Button
                    onClick={() => addInterest(newInterest)}
                    disabled={!newInterest.trim() || interests.length >= 12}
                    size="icon"
                    className="shrink-0 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>

                {/* Suggestions */}
                <div>
                  <p className="text-xs font-semibold text-white/40 mb-2">SUGGESTIONS</p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_INTERESTS.filter(s => !interests.includes(s)).slice(0, 10).map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => addInterest(suggestion)}
                        disabled={interests.length >= 12}
                        className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-purple-500/30 text-white/70 hover:text-white text-sm transition-all border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        + {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {interests.length > 0 && (
              <p className="text-xs text-white/50 mt-4">{interests.length}/12 interests</p>
            )}
          </div>

          {/* QR Code Section */}
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <QrCode className="w-5 h-5 text-green-400" />
              Your Code
            </h2>

            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              {/* QR Code */}
              <div className="bg-white p-4 rounded-2xl shadow-lg border-4 border-green-500/30 shrink-0">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`tap-trust://add-friend/${user.id || user.email}`)}`}
                  alt="QR Code"
                  width={200}
                  height={200}
                  className="rounded"
                />
              </div>

              {/* QR Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="font-semibold text-white mb-3">How to share:</h3>
                  <ol className="space-y-2 text-sm text-white/70">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 font-bold shrink-0">1</span>
                      <span>Friends scan your code</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 font-bold shrink-0">2</span>
                      <span>You're added to their list</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 font-bold shrink-0">3</span>
                      <span>Start chatting & playing games</span>
                    </li>
                  </ol>
                </div>

                <Button
                  onClick={() => {
                    window.open(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`tap-trust://add-friend/${user.id || user.email}`)}`, '_blank');
                  }}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold h-11 rounded-lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Code
                </Button>
              </div>
            </div>
          </div>

          {/* Edit/Save Buttons */}
          {isEditMode && (
            <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-8">
              <Button
                variant="outline"
                onClick={() => setIsEditMode(false)}
                className="flex-1 h-10 sm:h-12 rounded-lg font-semibold border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 h-10 sm:h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg text-sm sm:text-base"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 sm:w-5 h-4 sm:h-5 animate-spin mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Saving...</span>
                    <span className="sm:hidden">Save</span>
                  </>
                ) : saved ? (
                  <>
                    <Check className="w-4 sm:w-5 h-4 sm:h-5 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Saved!</span>
                    <span className="sm:hidden">OK</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Save Changes</span>
                    <span className="sm:hidden">Save</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
