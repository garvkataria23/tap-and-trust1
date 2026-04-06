import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Send, MessageCircle, Lightbulb, Phone, Video, Gamepad2, Search, Menu, X, Star } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/react-app/components/ui/avatar";
import IcebreakerModal from "@/react-app/components/IcebreakerModal";
import BlockUserButton from "@/react-app/components/BlockUserButton";
import ConnectorRating from "@/react-app/components/ConnectorRating";

interface Message {
  id: number;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

interface Friend {
  friend_id: string;
  display_name: string;
  avatar_url: string;
  mood_tag: string;
  bio?: string;
}

const conversationStarters = [
  "What's the most spontaneous thing you've ever done? 🎲",
  "If you could have dinner with anyone, who would it be? 🍽️",
  "What's your go-to karaoke song? 🎤",
  "What's a skill you'd love to learn? 🎯",
  "Describe your perfect weekend in 3 words ✨",
  "What's the best advice you've ever received? 💡",
  "Tell me about your biggest dream 🚀",
  "What makes you laugh the hardest? 😄",
];

export default function ChatPage() {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [friend, setFriend] = useState<Friend | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [showStarters, setShowStarters] = useState(false);
  const [showIcebreaker, setShowIcebreaker] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUserAndFriend();
    if (friendId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
    setLoading(false);
  }, [friendId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchUserAndFriend = async () => {
    try {
      const userRes = await fetch("/api/users/me");
      if (userRes.ok) {
        const userData = await userRes.json();
        setCurrentUserId(userData.id);
      }

      const friendsRes = await fetch("/api/friends");
      if (friendsRes.ok) {
        const friendsData = await friendsRes.json();
        setFriends(friendsData.friends || []);
        if (friendId) {
          const foundFriend = friendsData.friends.find((f: Friend) => f.friend_id === friendId);
          setFriend(foundFriend || null);
        }
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  const fetchMessages = async () => {
    if (!friendId) return;
    try {
      const res = await fetch(`/api/messages/${friendId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiver_id: friendId, content: content.trim() }),
      });
      
      if (res.ok) {
        setNewMessage("");
        setShowStarters(false);
        fetchMessages();
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(newMessage);
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    if (diffMs < 60000) return "just now";
    if (diffMs < 3600000) return `${Math.floor(diffMs / 60000)}m ago`;
    if (diffMs < 86400000) return `${Math.floor(diffMs / 3600000)}h ago`;
    
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 flex">
      {/* Sidebar - Friends List */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900/80 backdrop-blur-xl border-r border-purple-500/20 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-purple-500/20 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Messages</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden hover:bg-purple-500/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-purple-500/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-purple-500/10 border-purple-500/30 focus:border-purple-500/60"
            />
          </div>
        </div>

        {/* Friends List */}
        <div className="flex-1 overflow-y-auto">
          {friends.length === 0 ? (
            <div className="p-6 text-center">
              <MessageCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No friends yet</p>
            </div>
          ) : (
            <div className="space-y-2 p-2">
              {friends
                .filter(f => f.display_name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((f) => (
                  <button
                    key={f.friend_id}
                    onClick={() => {
                      navigate(`/chat/${f.friend_id}`);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      friendId === f.friend_id
                        ? 'bg-gradient-to-r from-purple-600/40 to-violet-600/40 border border-purple-500/60 shadow-lg shadow-purple-500/20'
                        : 'hover:bg-purple-500/10 border border-transparent hover:border-purple-500/30'
                    }`}
                  >
                    <Avatar className="w-10 h-10 border border-purple-500/40 flex-shrink-0">
                      <AvatarImage src={f.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-violet-600 text-white text-sm">
                        {f.display_name?.[0] || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium text-white truncate">{f.display_name}</p>
                      {f.mood_tag && (
                        <p className="text-xs text-purple-300/80 truncate">{f.mood_tag}</p>
                      )}
                    </div>
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-40 flex items-center gap-4 p-4 border-b border-purple-500/20 bg-slate-950/80 backdrop-blur-xl">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden hover:bg-purple-500/20"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="hover:bg-purple-500/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          {friend && (
            <div className="flex items-center gap-3 flex-1">
              <Avatar className="w-10 h-10 border-2 border-purple-500/40">
                <AvatarImage src={friend.avatar_url} />
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-violet-600 text-white">
                  {friend.display_name?.[0] || "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-white">{friend.display_name || "Unknown"}</h2>
                {friend.mood_tag && (
                  <p className="text-xs text-purple-300/80">{friend.mood_tag}</p>
                )}
              </div>
            </div>
          )}
          {!friend && (
            <div className="flex-1">
              <p className="text-muted-foreground text-sm">Select a friend to chat</p>
            </div>
          )}
          {friend && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowRatingModal(true)}
                className="text-yellow-400 hover:bg-yellow-500/20"
                title="Rate this connector"
              >
                <Star className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/games/${friendId}`)}
                className="text-blue-400 hover:bg-blue-500/20"
                title="Play games"
              >
                <Gamepad2 className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                disabled
                className="text-muted-foreground opacity-50"
                title="Voice calls coming soon"
              >
                <Phone className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                disabled
                className="text-muted-foreground opacity-50"
                title="Video calls coming soon"
              >
                <Video className="w-5 h-5" />
              </Button>
              <BlockUserButton
                userId={currentUserId}
                friendId={friendId!}
                friendName={friend.display_name}
                onBlockSuccess={() => navigate("/dashboard")}
              />
            </div>
          )}
        </div>

        {/* Content */}
        {!friend ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg">Select a friend from the list to start chatting</p>
            </div>
          </div>
        ) : (
          <>
            {/* Conversation Starters Panel */}
            {showStarters && (
              <div className="p-4 bg-purple-500/10 border-b border-purple-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-purple-300">Conversation Starters</span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {conversationStarters.map((starter, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(starter)}
                      className="flex-shrink-0 px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-xs text-purple-200 transition-colors whitespace-nowrap"
                    >
                      {starter}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Icebreaker Modal */}
            <IcebreakerModal 
              isOpen={showIcebreaker}
              friendName={friend?.display_name || "Friend"}
              onSelect={(question) => {
                sendMessage(question);
                setShowIcebreaker(false);
              }}
              onClose={() => setShowIcebreaker(false)}
            />

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Start chatting!</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Send a message or use a conversation starter
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setShowStarters(true)}
                    className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Conversation Starters
                  </Button>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.sender_id === currentUserId;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                          isOwn
                            ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-br-sm shadow-lg shadow-purple-600/30"
                            : "bg-purple-500/20 text-white rounded-bl-sm backdrop-blur-sm border border-purple-500/30"
                        }`}
                      >
                        <p className="text-sm break-words">{msg.content}</p>
                        <p className={`text-xs mt-1 ${isOwn ? "text-white/70" : "text-white/60"}`}>
                          {formatTime(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="sticky bottom-0 p-4 border-t border-purple-500/20 bg-slate-950/80 backdrop-blur-xl">
              <div className="flex gap-3 mb-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-purple-500/10 border-purple-500/30 focus:border-purple-500/60 rounded-xl"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowIcebreaker(!showIcebreaker)}
                  className={`text-cyan-400 hover:bg-cyan-500/20 ${showIcebreaker ? "bg-cyan-500/20" : ""}`}
                  title="Icebreaker questions"
                >
                  <Lightbulb className="w-5 h-5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowStarters(!showStarters)}
                  className={`text-violet-400 hover:bg-violet-500/20 ${showStarters ? "bg-violet-500/20" : ""}`}
                  title="Conversation starters"
                >
                  <Lightbulb className="w-5 h-5" />
                </Button>
                <Button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 disabled:opacity-50 text-white font-semibold shadow-lg shadow-purple-600/50"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </>
        )}

        {/* Connector Rating Modal */}
        {friend && (
          <ConnectorRating
            userId={currentUserId}
            friendId={friendId!}
            friendName={friend.display_name}
            isOpen={showRatingModal}
            onClose={() => setShowRatingModal(false)}
            onSubmit={() => {
              // Rating submitted successfully
            }}
          />
        )}
      </div>
    </div>
  );
}

