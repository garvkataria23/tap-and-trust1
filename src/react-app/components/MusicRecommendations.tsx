import { useState, useEffect } from 'react';
import { Sparkles, Music } from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';
import { Card } from '@/react-app/components/ui/card';
import { Badge } from '@/react-app/components/ui/badge';

interface RecommendedSong {
  musicHistoryId: string;
  title: string;
  artist: string;
  score: number;
  reason?: string;
  matchTags?: string[];
}

interface MusicRecommendationsProps {
  userId: string;
}

export default function MusicRecommendations({ userId }: MusicRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RecommendedSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState<string>('');

  const moods = ['happy', 'sad', 'excited', 'calm', 'focused', 'energetic'];

  useEffect(() => {
    fetchRecommendations();
  }, [userId]);

  const fetchRecommendations = async (mood?: string) => {
    setLoading(true);
    try {
      const url = mood
        ? `/api/music/recommendations/${userId}?mood=${mood}`
        : `/api/music/recommendations/${userId}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setRecommendations(data.recommendations || []);
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    fetchRecommendations(mood);
  };

  if (loading && recommendations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-block">
          <Sparkles className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
        <p className="text-indigo-300 mt-4">Finding music for you...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <span className="text-transparent bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text">
            Recommended for You
          </span>
          <Sparkles className="w-6 h-6 text-indigo-500" />
        </h2>
        <p className="text-indigo-300/60 text-sm">Personalized recommendations based on your listening habits</p>
      </div>

      {/* Mood Filter */}
      <div className="space-y-3">
        <p className="text-indigo-300 text-sm">Pick a mood:</p>
        <div className="flex gap-2 flex-wrap">
          {moods.map((mood) => (
            <Button
              key={mood}
              variant={selectedMood === mood ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleMoodSelect(mood)}
              className={
                selectedMood === mood
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white'
                  : 'border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/10'
              }
            >
              {mood.charAt(0).toUpperCase() + mood.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Recommendations List */}
      {loading ? (
        <div className="text-center py-8 text-indigo-300">Loading...</div>
      ) : recommendations.length === 0 ? (
        <Card className="bg-slate-800/50 border-indigo-500/20 p-8 text-center">
          <Music className="w-12 h-12 text-indigo-500/20 mx-auto mb-4" />
          <p className="text-indigo-300/60">No recommendations available yet. Keep listening!</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {recommendations.map((song, idx) => (
            <Card
              key={`${song.musicHistoryId}-${idx}`}
              className="bg-gradient-to-r from-slate-800/50 to-indigo-900/20 border-indigo-500/20 p-4 hover:border-indigo-500/40 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Rank & Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-indigo-500/40">{idx + 1}</span>
                    <div className="min-w-0">
                      <h3 className="text-indigo-300 font-semibold line-clamp-1">{song.title}</h3>
                      <p className="text-indigo-300/60 text-sm line-clamp-1">{song.artist}</p>
                    </div>
                  </div>

                  {/* Reason & Tags */}
                  <div className="space-y-2">
                    {song.reason && (
                      <p className="text-indigo-300/70 text-sm italic">{song.reason}</p>
                    )}
                    {song.matchTags && song.matchTags.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {song.matchTags.map((tag) => (
                          <Badge
                            key={tag}
                            className="bg-blue-600/40 text-blue-300 text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Score */}
                <div className="flex flex-col items-center">
                  <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <span className="text-white font-bold">{song.score}</span>
                  </div>
                  <span className="text-indigo-300/60 text-xs mt-1">match</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Refresh Note */}
      {recommendations.length > 0 && (
        <p className="text-indigo-300/50 text-xs text-center">
          Recommendations are generated based on your listening history and preferred moods
        </p>
      )}
    </div>
  );
}
