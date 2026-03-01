import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, MessageCircle, Search, Users, Sparkles, Clock, RotateCw, Trophy } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/react-app/components/ui/avatar";
import { Badge } from "@/react-app/components/ui/badge";

interface Friend {
  friend_id: string;
  display_name: string;
  avatar_url: string;
  mood_tag: string;
  bio: string;
  category: string;
  streak_days: number;
  expires_at?: string;
}

const moodColors: Record<string, string> = {
  "Chill": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Looking to Collaborate": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Just Browsing": "bg-gray-500/20 text-gray-400 border-gray-500/30",
  "Open to Talk": "bg-green-500/20 text-green-400 border-green-500/30",
};

const getTimeRemaining = (expiresAt: string | undefined) => {
  if (!expiresAt) return null;
  
  const now = new Date();
  const expires = new Date(expiresAt);
  const diff = expires.getTime() - now.getTime();
  
  if (diff <= 0) return "expired";
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

const getExpiryStatus = (expiresAt: string | undefined) => {
  if (!expiresAt) return null;
  
  const now = new Date();
  const expires = new Date(expiresAt);
  const diff = expires.getTime() - now.getTime();
  
  if (diff <= 0) return "expired";
  if (diff < 1000 * 60 * 60 * 3) return "expiring"; // Less than 3 hours
  return "active";
};

export default function FriendsPage() {
  const navigate = useNavigate();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [extending, setExtending] = useState<string | null>(null);

  const CATEGORIES = ['Event', 'Classmate', 'Random Meet', 'Work'];

  useEffect(() => {
    fetchFriends();
    const interval = setInterval(fetchFriends, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchFriends = async () => {
    try {
      const res = await fetch("/api/friends");
      if (res.ok) {
        const data = await res.json();
        setFriends(data.friends);
      }
    } catch (err) {
      console.error("Failed to fetch friends:", err);
    } finally {
      setLoading(false);
    }
  };

  const extendFriendship = async (friendId: string) => {
    setExtending(friendId);
    try {
      const res = await fetch(`/api/friends/${friendId}/extend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      if (res.ok) {
        fetchFriends();
      }
    } catch (err) {
      console.error("Failed to extend friendship:", err);
    } finally {
      setExtending(null);
    }
  };

  const filteredFriends = friends.filter(f => {
    const matchesSearch = f.display_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || f.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const activeFriends = filteredFriends.filter(f => getExpiryStatus(f.expires_at) !== "expired");
  const expiredFriends = filteredFriends.filter(f => getExpiryStatus(f.expires_at) === "expired");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="hover:bg-white/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Friends</h1>
              <p className="text-sm text-white/60">{activeFriends.length} active connections</p>
            </div>
          </div>
          <Link to="/game-stats">
            <Button size="icon" variant="outline" className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30 hover:border-yellow-500/50 hover:bg-yellow-500/30">
              <Trophy className="w-5 h-5 text-yellow-400" />
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 focus:border-purple-500/50"
          />
        </div>

        {/* Categories Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
              selectedCategory === null
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Active Friends List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : activeFriends.length > 0 ? (
          <div>
            <h2 className="text-sm font-semibold text-purple-400 uppercase mb-3">Active Friendships</h2>
            <div className="space-y-3 mb-6">
              {activeFriends.map((friend) => {
                const status = getExpiryStatus(friend.expires_at);
                const timeRemaining = getTimeRemaining(friend.expires_at);
                
                return (
                  <div
                    key={friend.friend_id}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="relative">
                        <Avatar className="w-14 h-14 border-2 border-purple-500/30">
                          <AvatarImage src={friend.avatar_url} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                            {friend.display_name?.[0] || "?"}
                          </AvatarFallback>
                        </Avatar>
                        {friend.streak_days > 0 && (
                          <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                            🔥{friend.streak_days}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white truncate">{friend.display_name || "Unknown"}</h3>
                          {friend.mood_tag && (
                            <Badge variant="outline" className={`text-xs ${moodColors[friend.mood_tag] || ""}`}>
                              {friend.mood_tag}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{friend.bio || "No bio yet"}</p>
                      </div>
                      <Link to={`/chat/${friend.friend_id}`}>
                        <Button variant="ghost" size="icon" className="text-purple-400 hover:text-purple-300">
                          <MessageCircle className="w-5 h-5" />
                        </Button>
                      </Link>
                    </div>

                    {/* Expiry info and extend button */}
                    {friend.expires_at && (
                      <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/10">
                        <div className={`flex items-center gap-1 text-xs ${
                          status === "expiring" ? "text-amber-400" : "text-green-400"
                        }`}>
                          <Clock className="w-3.5 h-3.5" />
                          <span>Expires in {timeRemaining}</span>
                        </div>
                        {status === "expiring" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => extendFriendship(friend.friend_id)}
                            disabled={extending === friend.friend_id}
                            className={`text-xs ${extending === friend.friend_id ? "opacity-50" : ""}`}
                          >
                            {extending === friend.friend_id ? (
                              <>
                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1" />
                                Extending...
                              </>
                            ) : (
                              <>
                                <RotateCw className="w-3.5 h-3.5 mr-1" />
                                Extend 24h
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Expired Friends Section */}
        {expiredFriends.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase mb-3">Expired Friendships</h2>
            <div className="space-y-2 mb-6">
              {expiredFriends.map((friend) => (
                <div
                  key={friend.friend_id}
                  className="p-3 rounded-xl bg-white/5 border border-red-500/20 opacity-60"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border-2 border-red-500/20">
                        <AvatarImage src={friend.avatar_url} />
                        <AvatarFallback className="bg-gray-700 text-white text-xs">
                          {friend.display_name?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-semibold text-white text-sm">{friend.display_name}</p>
                        <p className="text-xs text-red-400">Friendship expired</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => extendFriendship(friend.friend_id)}
                      disabled={extending === friend.friend_id}
                    >
                      {extending === friend.friend_id ? (
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <RotateCw className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {activeFriends.length === 0 && expiredFriends.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Users className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No friends yet</h3>
            <p className="text-muted-foreground mb-6">
              Scan someone's QR code or share yours to start connecting!
            </p>
            <Link to="/dashboard">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Sparkles className="w-4 h-4 mr-2" />
                Start Connecting
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
