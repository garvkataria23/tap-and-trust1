import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Trophy } from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';

interface LeaderboardEntry {
  _id: string;
  userId: string;
  userName: string;
  gameType: string;
  wins: number;
  losses: number;
  totalScore: number;
  rank?: number;
}

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const [leaderboards, setLeaderboards] = useState<Record<string, LeaderboardEntry[]>>({});
  const [selectedGame, setSelectedGame] = useState('rockpaperscissors');
  const [loading, setLoading] = useState(true);

  const GAMES = [
    { id: 'rockpaperscissors', name: '🪨 Rock Paper Scissors' },
    { id: 'trivia', name: '🧠 Quick Trivia' },
    { id: 'tictactoe', name: '⭕ Tic Tac Toe' },
    { id: 'wordguess', name: '🎤 Guess the Word' },
    { id: 'numberguess', name: '🔢 Number Guess' },
    { id: 'memory', name: '🧩 Memory Game' },
  ];

  useEffect(() => {
    fetchLeaderboards();
  }, []);

  const fetchLeaderboards = async () => {
    try {
      const leaderboardsData: Record<string, LeaderboardEntry[]> = {};
      
      for (const game of GAMES) {
        const res = await fetch(`/api/leaderboard/${game.id}`);
        if (res.ok) {
          const data = await res.json();
          leaderboardsData[game.id] = data.leaderboard || [];
        }
      }
      
      setLeaderboards(leaderboardsData);
    } catch (err) {
      console.error('Failed to fetch leaderboards:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentLeaderboard = leaderboards[selectedGame] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="hover:bg-white/10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              Leaderboards
            </h1>
            <p className="text-sm text-white/60">See who's the best player</p>
          </div>
        </div>

        {/* Game Selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {GAMES.map((game) => (
            <button
              key={game.id}
              onClick={() => setSelectedGame(game.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
                selectedGame === game.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
              }`}
            >
              {game.name}
            </button>
          ))}
        </div>

        {/* Leaderboard Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : currentLeaderboard.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No scores yet for this game</p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentLeaderboard.map((player, index) => (
              <div
                key={player._id}
                className={`p-4 rounded-2xl flex items-center justify-between ${
                  index === 0
                    ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                    : index === 1
                    ? 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border border-gray-400/30'
                    : index === 2
                    ? 'bg-gradient-to-r from-orange-700/20 to-orange-800/20 border border-orange-700/30'
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Rank Badge */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-lg">
                    {index === 0 ? '🏆' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                  </div>

                  {/* Player Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white">{player.userName || 'Anonymous'}</h3>
                    <p className="text-sm text-white/60">{player.wins} wins</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-400">{player.totalScore || player.wins}</p>
                    <p className="text-xs text-white/60">score</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Legend */}
        <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="font-semibold text-white mb-3">How it works</h3>
          <ul className="text-sm text-white/70 space-y-2">
            <li>🏆 Ranked by total wins and score</li>
            <li>📊 Each game has its own leaderboard</li>
            <li>⚡ Top scores reset monthly</li>
            <li>🎯 Challenge friends to climb the ranks</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
