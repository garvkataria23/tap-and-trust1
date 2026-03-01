import { useState, useEffect, useCallback } from 'react';
import {
  Music, Plus, Heart, Download, Search, TrendingUp,
  Globe, Radio, CheckCircle, AlertTriangle, Play, Loader2,
} from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Card } from '@/react-app/components/ui/card';
import { Badge } from '@/react-app/components/ui/badge';
import type { PlayableSong } from './MusicPlayer';

interface Genre {
  id: number;
  name: string;
}

interface Props {
  userId?: string;
  onPlaySong?: (song: PlayableSong, queue: PlayableSong[]) => void;
}

const GENRES: Genre[] = [
  { id: 14, name: 'Pop' },
  { id: 21, name: 'Rock' },
  { id: 18, name: 'Hip-Hop' },
  { id: 11, name: 'Jazz' },
  { id: 7, name: 'Electronic' },
  { id: 20, name: 'Alternative' },
  { id: 15, name: 'R&B' },
  { id: 6, name: 'Country' },
  { id: 5, name: 'Classical' },
  { id: 12, name: 'Latin' },
  { id: 51, name: 'K-Pop' },
  { id: 17, name: 'Dance' },
  { id: 2, name: 'Blues' },
  { id: 24, name: 'Reggae' },
];

export default function BrowseSongs({ userId, onPlaySong }: Props) {
  const [songs, setSongs] = useState<PlayableSong[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<'trending' | 'search' | 'genre'>('trending');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set());
  const [downloadedSongs, setDownloadedSongs] = useState<Set<string>>(new Set());
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadMessage, setDownloadMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [hasApiAccess, setHasApiAccess] = useState(true);

  const currentUserId = userId || localStorage.getItem('userId') || '';

  // Load downloaded songs set
  useEffect(() => {
    if (currentUserId) {
      fetch(`/api/downloads/${currentUserId}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.downloads) {
            setDownloadedSongs(
              new Set(data.downloads.map((d: { title: string; artist: string }) => `${d.title}__${d.artist}`))
            );
          }
        })
        .catch(() => {});
    }
  }, [currentUserId]);

  // Fetch trending on mount
  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/itunes/trending?limit=30');
      if (res.ok) {
        const data = await res.json();
        if (data.songs?.length) {
          setSongs(data.songs);
          setHasApiAccess(true);
          setLoading(false);
          return;
        }
      }
      // Try fallback: search for popular music
      const fallback = await fetch('/api/itunes/search?q=top+hits+2024&limit=30');
      if (fallback.ok) {
        const data = await fallback.json();
        if (data.songs?.length) {
          setSongs(data.songs);
          setHasApiAccess(true);
          setLoading(false);
          return;
        }
      }
      throw new Error('No data from API');
    } catch {
      setHasApiAccess(false);
      loadDemoSongs();
    } finally {
      setLoading(false);
    }
  }, []);

  const searchSongs = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setCategory('search');
    setSelectedGenre('');
    try {
      const res = await fetch(`/api/itunes/search?q=${encodeURIComponent(query)}&limit=30`);
      if (res.ok) {
        const data = await res.json();
        if (data.songs) {
          setSongs(data.songs);
          setHasApiAccess(true);
          setLoading(false);
          return;
        }
      }
      throw new Error('No data');
    } catch {
      setHasApiAccess(false);
      loadDemoSongs();
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGenreTracks = useCallback(async (genreName: string) => {
    setLoading(true);
    setCategory('genre');
    try {
      const res = await fetch(`/api/itunes/genre/${encodeURIComponent(genreName)}?limit=25`);
      if (res.ok) {
        const data = await res.json();
        if (data.songs?.length) {
          setSongs(data.songs);
          setHasApiAccess(true);
          setLoading(false);
          return;
        }
      }
      throw new Error('No data');
    } catch {
      setHasApiAccess(false);
      loadDemoSongs();
    } finally {
      setLoading(false);
    }
  }, []);

  // Demo songs fallback when backend is unreachable
  const loadDemoSongs = () => {
    const demo: PlayableSong[] = [
      { id: 'd-1', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', genre: 'Pop', duration: 200, popularity: 98, fileSize: 3200000, imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=128&h=128' },
      { id: 'd-2', title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', genre: 'Pop', duration: 203, popularity: 95, fileSize: 3250000, imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=128&h=128' },
      { id: 'd-3', title: 'Stay', artist: 'The Kid LAROI ft. Justin Bieber', album: 'F*CK LOVE 3', genre: 'Pop', duration: 141, popularity: 94, fileSize: 2260000, imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=128&h=128' },
      { id: 'd-4', title: 'Heat Waves', artist: 'Glass Animals', album: 'Dreamland', genre: 'Indie', duration: 238, popularity: 93, fileSize: 3810000, imageUrl: 'https://images.unsplash.com/photo-1533684476305-fb6f4f5f6a4b?w=128&h=128' },
      { id: 'd-5', title: 'As It Was', artist: 'Harry Styles', album: "Harry's House", genre: 'Pop', duration: 167, popularity: 99, fileSize: 2670000, imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=128&h=128' },
      { id: 'd-6', title: 'Anti-Hero', artist: 'Taylor Swift', album: 'Midnights', genre: 'Pop', duration: 200, popularity: 97, fileSize: 3200000, imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=128&h=128' },
      { id: 'd-7', title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', genre: 'Rock', duration: 355, popularity: 99, fileSize: 5680000, imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=128&h=128' },
      { id: 'd-8', title: 'HUMBLE.', artist: 'Kendrick Lamar', album: 'DAMN.', genre: 'Hip-Hop', duration: 177, popularity: 96, fileSize: 2830000, imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=128&h=128' },
    ];
    setSongs(demo);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    searchSongs(searchQuery);
  };

  const handleGenreClick = (genreName: string) => {
    setSelectedGenre(genreName);
    setSearchQuery('');
    fetchGenreTracks(genreName);
  };

  const playSong = (song: PlayableSong) => {
    if (onPlaySong) {
      onPlaySong(song, songs);
    }
  };

  const toggleLike = (songId: string) => {
    setLikedSongs((prev) => {
      const n = new Set(prev);
      n.has(songId) ? n.delete(songId) : n.add(songId);
      return n;
    });
  };

  const downloadSong = async (song: PlayableSong) => {
    if (!currentUserId) return;
    const key = `${song.title}__${song.artist}`;
    if (downloadedSongs.has(key)) return;

    setDownloadingId(song.id);
    setDownloadMessage(null);

    try {
      const res = await fetch('/api/downloads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          title: song.title,
          artist: song.artist,
          album: song.album,
          genre: song.genre,
          duration: song.duration,
          imageUrl: song.imageUrl,
          fileSize: song.fileSize || (song.duration ? song.duration * 16000 : 4 * 1024 * 1024),
          sourceUrl: song.preview || '',
        }),
      });

      if (res.ok) {
        setDownloadedSongs((prev) => new Set(prev).add(key));
        setDownloadMessage({ type: 'success', text: `Downloaded "${song.title}"` });
      } else if (res.status === 507) {
        setDownloadMessage({ type: 'error', text: 'Storage full! Delete some songs to make room.' });
      } else if (res.status === 409) {
        setDownloadedSongs((prev) => new Set(prev).add(key));
        setDownloadMessage({ type: 'success', text: 'Already downloaded!' });
      } else {
        throw new Error('Download failed');
      }
    } catch {
      // Fallback: save to localStorage
      const stored = JSON.parse(localStorage.getItem(`downloads_${currentUserId}`) || '[]');
      const fileSize = song.fileSize || (song.duration ? song.duration * 16000 : 4 * 1024 * 1024);
      const totalSize = stored.reduce((s: number, d: { fileSize?: number }) => s + (d.fileSize || 0), 0);
      const limit = 500 * 1024 * 1024;

      if (totalSize + fileSize > limit) {
        setDownloadMessage({ type: 'error', text: 'Storage full! Delete some songs to make room.' });
      } else {
        stored.push({
          _id: song.id,
          title: song.title,
          artist: song.artist,
          album: song.album,
          genre: song.genre,
          duration: song.duration,
          imageUrl: song.imageUrl,
          fileSize,
          downloadedAt: new Date().toISOString(),
          isOfflineAvailable: true,
        });
        localStorage.setItem(`downloads_${currentUserId}`, JSON.stringify(stored));
        setDownloadedSongs((prev) => new Set(prev).add(key));
        setDownloadMessage({ type: 'success', text: `Downloaded "${song.title}"` });
      }
    } finally {
      setDownloadingId(null);
      setTimeout(() => setDownloadMessage(null), 3000);
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isSongDownloaded = (song: PlayableSong) => downloadedSongs.has(`${song.title}__${song.artist}`);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text mb-2">
          Discover Music
        </h2>
        <p className="text-indigo-300/60 text-sm mb-6">
          <Globe className="w-4 h-4 inline mr-1" />
          {hasApiAccess
            ? 'Stream & download real music · 30-second previews powered by iTunes'
            : 'Browse and download songs (start backend for live music)'}
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search any song, artist, or album..."
            className="bg-slate-800 border-indigo-500/20 text-white placeholder:text-slate-500 py-2 h-auto"
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6"
          >
            <Search className="w-4 h-4" />
          </Button>
        </form>

        {/* Category Buttons */}
        <div className="flex gap-2 flex-wrap mb-4">
          <Button
            variant={category === 'trending' && !selectedGenre ? 'default' : 'outline'}
            size="sm"
            onClick={() => { setCategory('trending'); setSelectedGenre(''); setSearchQuery(''); fetchTrending(); }}
            className={
              category === 'trending' && !selectedGenre
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white'
                : 'border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/10'
            }
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            Trending
          </Button>
        </div>
      </div>

      {/* Genre Filter */}
      <div className="space-y-3">
        <p className="text-indigo-300 text-sm flex items-center gap-1">
          <Radio className="w-3 h-3" /> Browse by genre:
        </p>
        <div className="flex gap-2 flex-wrap">
          {GENRES.map((genre) => (
            <Button
              key={genre.id}
              variant={selectedGenre === genre.name ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleGenreClick(genre.name)}
              className={
                selectedGenre === genre.name
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white'
                  : 'border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/10'
              }
            >
              {genre.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Download notification */}
      {downloadMessage && (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
            downloadMessage.type === 'success'
              ? 'bg-green-600/20 border border-green-500/30 text-green-300'
              : 'bg-red-600/20 border border-red-500/30 text-red-300'
          }`}
        >
          {downloadMessage.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {downloadMessage.text}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-8 flex items-center justify-center gap-2 text-indigo-300">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading music...</span>
        </div>
      )}

      {/* No results */}
      {!loading && songs.length === 0 && category === 'search' && (
        <Card className="bg-slate-800/50 border-indigo-500/20 p-8 text-center">
          <p className="text-indigo-300/60">No songs found. Try a different search.</p>
        </Card>
      )}

      {/* Songs List */}
      {songs.length > 0 && !loading && (
        <div className="space-y-2">
          <p className="text-indigo-300/60 text-sm">
            {songs.length} songs {hasApiAccess && '· Live from iTunes'}
          </p>

          {songs.map((song, index) => (
            <Card
              key={song.id}
              className="bg-gradient-to-r from-slate-800/50 to-indigo-900/20 border-indigo-500/20 p-3 hover:border-indigo-500/40 transition-all group"
            >
              <div className="flex items-center gap-3">
                {/* Play + Album Art */}
                <div
                  className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                  onClick={() => playSong(song)}
                >
                  {song.imageUrl ? (
                    <img src={song.imageUrl} alt={song.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-indigo-900/50 flex items-center justify-center">
                      <Music className="w-5 h-5 text-indigo-500/40" />
                    </div>
                  )}
                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {song.preview ? (
                      <Play className="w-5 h-5 text-white" fill="white" />
                    ) : (
                      <Music className="w-4 h-4 text-white/60" />
                    )}
                  </div>
                </div>

                {/* Number */}
                {category === 'trending' && (
                  <span className="text-lg font-bold text-indigo-500/40 w-6 text-center flex-shrink-0">
                    {index + 1}
                  </span>
                )}

                {/* Song Info */}
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => playSong(song)}>
                  <h3 className="text-indigo-200 font-semibold text-sm truncate">{song.title}</h3>
                  <p className="text-indigo-300/50 text-xs truncate">{song.artist}</p>
                  <div className="flex gap-1.5 mt-1 flex-wrap">
                    {song.album && (
                      <Badge className="bg-indigo-600/30 text-indigo-300 text-[10px] px-1.5 py-0">{song.album}</Badge>
                    )}
                    {song.genre && (
                      <Badge className="bg-purple-600/30 text-purple-300 text-[10px] px-1.5 py-0">{song.genre}</Badge>
                    )}
                    {song.preview && (
                      <Badge className="bg-green-600/20 text-green-400 text-[10px] px-1.5 py-0">
                        ▶ Preview
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Duration & Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="text-indigo-300/40 text-xs mr-1 hidden sm:inline">
                    {formatDuration(song.duration)}
                  </span>

                  {/* Play button */}
                  {song.preview && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => playSong(song)}
                      className="text-green-400 hover:bg-green-500/20 h-8 w-8 p-0"
                      title="Play preview"
                    >
                      <Play className="w-4 h-4" fill="currentColor" />
                    </Button>
                  )}

                  {/* Like */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLike(song.id)}
                    className={`h-8 w-8 p-0 ${likedSongs.has(song.id) ? 'text-red-400 hover:bg-red-500/20' : 'text-indigo-400 hover:bg-indigo-500/20'}`}
                  >
                    <Heart className="w-3.5 h-3.5" fill={likedSongs.has(song.id) ? 'currentColor' : 'none'} />
                  </Button>

                  {/* Download */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => downloadSong(song)}
                    disabled={downloadingId === song.id || isSongDownloaded(song)}
                    className={`h-8 w-8 p-0 ${isSongDownloaded(song) ? 'text-green-400' : 'text-indigo-400 hover:bg-indigo-500/20'}`}
                    title={isSongDownloaded(song) ? 'Downloaded' : `Download (${formatSize(song.fileSize)})`}
                  >
                    {downloadingId === song.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : isSongDownloaded(song) ? (
                      <CheckCircle className="w-3.5 h-3.5" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                  </Button>

                  {/* Add to playlist */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-indigo-400 hover:bg-indigo-500/20 h-8 w-8 p-0"
                    title="Add to playlist"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Initial empty state */}
      {!loading && songs.length === 0 && category !== 'search' && (
        <Card className="bg-gradient-to-br from-slate-800/50 to-indigo-900/20 border-indigo-500/20 p-8 text-center">
          <Globe className="w-12 h-12 text-indigo-500/20 mx-auto mb-4" />
          <p className="text-indigo-300/60">
            Search for any song, artist, or album to discover music
          </p>
        </Card>
      )}

      {/* Bottom padding for player */}
      <div className="h-24" />
    </div>
  );
}
