import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Trophy, Flame, Gamepad2, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/react-app/components/ui/avatar';
import { Badge } from '@/react-app/components/ui/badge';

interface GameSession {
  id: string;
  friendName: string;
  friendAvatar: string;
  game: 'Rock Paper Scissors' | 'Trivia';
  result: 'won' | 'lost' | 'draw';
  score: number;
  timestamp: Date;
  streak: number;
}

interface FriendGameStats {
  friendId: string;
  name: string;
  avatar: string;
  mood: string;
  totalGamesPlayed: number;
  wins: number;
  losses: number;
  currentStreak: number;
  winRate: number;
  lastPlayed: Date;
}

const MOCK_GAME_SESSIONS: GameSession[] = [
  {
    id: '1',
    friendName: 'Alex Chen',
    friendAvatar: 'https://i.pravatar.cc/150?img=33',
    game: 'Rock Paper Scissors',
    result: 'won',
    score: 2,
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    streak: 5,
  },
  {
    id: '2',
    friendName: 'Sarah Johnson',
    friendAvatar: 'https://i.pravatar.cc/150?img=47',
    game: 'Trivia',
    result: 'won',
    score: 3,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    streak: 2,
  },
  {
    id: '3',
    friendName: 'Alex Chen',
    friendAvatar: 'https://i.pravatar.cc/150?img=33',
    game: 'Trivia',
    result: 'lost',
    score: 1,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    streak: 1,
  },
  {
    id: '4',
    friendName: 'Mike Davis',
    friendAvatar: 'https://i.pravatar.cc/150?img=12',
    game: 'Rock Paper Scissors',
    result: 'draw',
    score: 1,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    streak: 0,
  },
];

const MOCK_FRIEND_STATS: FriendGameStats[] = [
  {
    friendId: '1',
    name: 'Alex Chen',
    avatar: 'https://i.pravatar.cc/150?img=33',
    mood: 'Chill',
    totalGamesPlayed: 12,
    wins: 8,
    losses: 4,
    currentStreak: 5,
    winRate: 66.7,
    lastPlayed: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    friendId: '2',
    name: 'Sarah Johnson',
    avatar: 'https://i.pravatar.cc/150?img=47',
    mood: 'Open to Talk',
    totalGamesPlayed: 8,
    wins: 5,
    losses: 3,
    currentStreak: 2,
    winRate: 62.5,
    lastPlayed: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    friendId: '3',
    name: 'Mike Davis',
    avatar: 'https://i.pravatar.cc/150?img=12',
    mood: 'Looking to Collaborate',
    totalGamesPlayed: 5,
    wins: 2,
    losses: 3,
    currentStreak: 0,
    winRate: 40,
    lastPlayed: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

const formatTime = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  if (diffMs < 60000) return 'just now';
  if (diffMs < 3600000) return `${Math.floor(diffMs / 60000)}m ago`;
  if (diffMs < 86400000) return `${Math.floor(diffMs / 3600000)}h ago`;
  
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

export default function MultiplayerGamesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'history' | 'stats'>('history');

  const totalWins = MOCK_GAME_SESSIONS.filter(s => s.result === 'won').length;
  const totalLosses = MOCK_GAME_SESSIONS.filter(s => s.result === 'lost').length;
  const winRate = ((totalWins / MOCK_GAME_SESSIONS.length) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/friends')}
            className="hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-bold">Game Stats</span>
          </div>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Overall Stats */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Gamepad2 className="w-8 h-8 text-purple-400" />
            Your Game Stats
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6 hover:border-green-500/50 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-green-400" />
                <span className="text-sm text-green-300 font-medium">Wins</span>
              </div>
              <p className="text-3xl font-bold text-white">{totalWins}</p>
              <p className="text-xs text-green-300/60">{winRate}% win rate</p>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/30 rounded-2xl p-6 hover:border-red-500/50 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-red-300 font-medium">Losses</span>
              </div>
              <p className="text-3xl font-bold text-white">{totalLosses}</p>
              <p className="text-xs text-red-300/60">{MOCK_GAME_SESSIONS.length} total games</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-2xl p-6 hover:border-yellow-500/50 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-yellow-400" />
                <span className="text-sm text-yellow-300 font-medium">Streak</span>
              </div>
              <p className="text-3xl font-bold text-white">
                {Math.max(...MOCK_GAME_SESSIONS.map(s => s.streak), 0)}
              </p>
              <p className="text-xs text-yellow-300/60">Hot on the board!</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-6 hover:border-blue-500/50 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-blue-300 font-medium">Opponents</span>
              </div>
              <p className="text-3xl font-bold text-white">{MOCK_FRIEND_STATS.length}</p>
              <p className="text-xs text-blue-300/60">Friends to challenge</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/20'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <span className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              Recent Games
            </span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'stats'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/20'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Friend Stats
            </span>
          </button>
        </div>

        {/* Content */}
        {activeTab === 'history' ? (
          <div className="space-y-3">
            {MOCK_GAME_SESSIONS.map((session) => (
              <div
                key={session.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar className="w-12 h-12 border-2 border-purple-500/30">
                      <AvatarImage src={session.friendAvatar} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                        {session.friendName[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                        {session.friendName}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <span>{session.game}</span>
                        <span>•</span>
                        <span>{formatTime(session.timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {session.streak > 0 && (
                      <div className="flex items-center gap-1 px-3 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
                        <Flame className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-semibold text-yellow-400">{session.streak}</span>
                      </div>
                    )}

                    <div className="text-right">
                      <div
                        className={`text-2xl font-bold ${
                          session.result === 'won'
                            ? 'text-green-400'
                            : session.result === 'lost'
                            ? 'text-red-400'
                            : 'text-yellow-400'
                        }`}
                      >
                        {session.result === 'won'
                          ? '✓ Won'
                          : session.result === 'lost'
                          ? '✗ Lost'
                          : '= Draw'}
                      </div>
                      <p className="text-sm text-white/40">{session.score} pts</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {MOCK_FRIEND_STATS.map((friend, idx) => (
              <div
                key={friend.friendId}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="w-14 h-14 border-2 border-purple-500/30">
                        <AvatarImage src={friend.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                          {friend.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      {idx === 0 && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold">🏆</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-lg group-hover:text-purple-300 transition-colors">
                        {friend.name}
                      </h3>
                      <p className="text-sm text-white/40">Last played {formatTime(friend.lastPlayed)}</p>
                    </div>
                  </div>

                  <Badge
                    className={`px-3 py-1.5 ${
                      friend.mood === 'Chill'
                        ? 'bg-blue-500/20 text-blue-400'
                        : friend.mood === 'Open to Talk'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-purple-500/20 text-purple-400'
                    }`}
                  >
                    {friend.mood}
                  </Badge>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-green-400">{friend.wins}</p>
                    <p className="text-xs text-white/40 mt-1">Wins</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-red-400">{friend.losses}</p>
                    <p className="text-xs text-white/40 mt-1">Losses</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-yellow-400">{friend.winRate.toFixed(0)}%</p>
                    <p className="text-xs text-white/40 mt-1">Win Rate</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-purple-400">{friend.totalGamesPlayed}</p>
                    <p className="text-xs text-white/40 mt-1">Games</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
