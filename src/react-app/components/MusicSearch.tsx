import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/react-app/components/ui/input';
import { Button } from '@/react-app/components/ui/button';
import { Card } from '@/react-app/components/ui/card';
import { Badge } from '@/react-app/components/ui/badge';

interface MusicResult {
  _id: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  duration?: number;
  imageUrl?: string;
}

export default function MusicSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'all' | 'title' | 'artist'>('all');
  const [results, setResults] = useState<MusicResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/music/search?query=${encodeURIComponent(searchQuery)}&type=${searchType}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '0m';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div>
        <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text mb-4">
          Search Music
        </h2>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or artist..."
              className="bg-slate-800 border-indigo-500/20 text-white placeholder:text-slate-500 py-2 h-auto"
            />
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>

          {/* Search Type Filter */}
          <div className="flex gap-2">
            <label className="text-sm text-indigo-300">Search by:</label>
            {(['all', 'title', 'artist'] as const).map((type) => (
              <Button
                key={type}
                type="button"
                variant={searchType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSearchType(type)}
                className={searchType === type ? 'bg-indigo-600 text-white' : 'border-indigo-500/20 text-indigo-300'}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </form>
      </div>

      {/* Results */}
      {searched && loading && <div className="text-center py-8 text-indigo-300">Searching...</div>}

      {searched && !loading && results.length === 0 && (
        <Card className="bg-slate-800/50 border-indigo-500/20 p-8 text-center">
          <p className="text-indigo-300/60">No results found for "{searchQuery}"</p>
        </Card>
      )}

      {results.length > 0 && (
        <div className="space-y-3">
          <p className="text-indigo-300/60 text-sm">Found {results.length} results</p>
          {results.map((song) => (
            <Card
              key={song._id}
              className="bg-slate-800/50 border-indigo-500/20 p-4 hover:border-indigo-500/40 transition-all flex items-center gap-4"
            >
              {/* Album Art */}
              {song.imageUrl && (
                <img src={song.imageUrl} alt={song.title} className="w-12 h-12 rounded object-cover" />
              )}

              {/* Song Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-indigo-300 font-semibold line-clamp-1">{song.title}</h3>
                <p className="text-indigo-300/60 text-sm line-clamp-1">{song.artist}</p>
                <div className="flex gap-2 mt-2">
                  {song.album && <Badge className="bg-indigo-600/40 text-indigo-300 text-xs">{song.album}</Badge>}
                  {song.genre && <Badge className="bg-blue-600/40 text-blue-300 text-xs">{song.genre}</Badge>}
                </div>
              </div>

              {/* Duration */}
              {song.duration && <span className="text-indigo-300/60 text-sm whitespace-nowrap">{formatDuration(song.duration)}</span>}
            </Card>
          ))}
        </div>
      )}

      {!searched && (
        <Card className="bg-gradient-to-br from-slate-800/50 to-indigo-900/20 border-indigo-500/20 p-8 text-center">
          <Search className="w-12 h-12 text-indigo-500/20 mx-auto mb-4" />
          <p className="text-indigo-300/60">Search for your favorite songs, artists, or albums</p>
        </Card>
      )}
    </div>
  );
}
