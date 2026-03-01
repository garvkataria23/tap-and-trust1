import { useState, useEffect, useRef } from "react";
import { Music, Play, Search, MoreVertical } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/react-app/components/ui/dropdown-menu";

interface Song {
  _id: string;
  title: string;
  artist?: string;
  album?: string;
  duration?: number;
  imageUrl?: string;
  source: string;
  playedAt: string;
}

interface MusicHistoryProps {
  userId: string;
  onSongSelect?: (song: Song) => void;
}

export default function MusicHistory({ userId, onSongSelect }: MusicHistoryProps) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [topArtists, setTopArtists] = useState<any[]>([]);
  const [topSongs, setTopSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "recent" | "top-songs" | "top-artists">("recent");
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    fetchMusicData();
  }, [userId, filter]);

  const fetchMusicData = async () => {
    setLoading(true);
    try {
      if (filter === "recent") {
        const res = await fetch(`/api/music/recent/${userId}`);
        const data = await res.json();
        setSongs(data.recentSongs || []);
      } else if (filter === "all") {
        const res = await fetch(`/api/music/history/${userId}?limit=100`);
        const data = await res.json();
        setSongs(data.musicHistory || []);
      } else if (filter === "top-artists") {
        const res = await fetch(`/api/music/top-artists/${userId}`);
        const data = await res.json();
        setTopArtists(data.topArtists || []);
      } else if (filter === "top-songs") {
        const res = await fetch(`/api/music/top-songs/${userId}`);
        const data = await res.json();
        setTopSongs(data.topSongs || []);
      }
    } catch (error) {
      console.error("Failed to fetch music data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "";
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const togglePlay = (songId: string) => {
    if (currentlyPlaying === songId) {
      audioRef.current?.pause();
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(songId);
      // In a real app, you'd load the actual audio here
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
          <Music size={28} className="text-indigo-400" />
          My Music
        </h2>
        <p className="text-indigo-300/60 text-sm mt-2">Browse your song history and favorites</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: "recent", label: "Recent Plays" },
          { id: "all", label: "All Songs" },
          { id: "top-songs", label: "Top Songs" },
          { id: "top-artists", label: "Top Artists" },
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={filter === tab.id ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(tab.id as any)}
            className={`whitespace-nowrap ${
              filter === tab.id
                ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/50"
                : "bg-slate-900/50 border-indigo-500/30 text-slate-300 hover:border-indigo-500/60"
            }`}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Search Bar */}
      {(filter === "all" || filter === "recent") && (
        <div className="relative">
          <Search size={18} className="absolute left-3 top-3 text-slate-500" />
          <Input
            placeholder="Search songs or artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-900/50 border-indigo-500/30 text-white placeholder:text-slate-500 focus:border-indigo-500/60"
          />
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-800/50 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* Recent/All Songs List */}
          {(filter === "recent" || filter === "all") && (
            <div className="space-y-3">
              {filteredSongs.length === 0 ? (
                <div className="text-center py-12">
                  <Music size={48} className="text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500">No songs found</p>
                </div>
              ) : (
                filteredSongs.map((song) => (
                  <div
                    key={song._id}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-800/40 to-indigo-900/20 rounded-xl border border-indigo-500/20 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/20 transition-all group"
                  >
                    {/* Album Art */}
                    <div className="relative">
                      {song.imageUrl ? (
                        <img
                          src={song.imageUrl}
                          alt={song.title}
                          className="w-14 h-14 rounded-lg object-cover ring-2 ring-indigo-500/30"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center ring-2 ring-indigo-500/30">
                          <Music size={24} className="text-white" />
                        </div>
                      )}
                      <button
                        onClick={() => togglePlay(song._id)}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                      >
                        <Play size={24} className="text-white fill-white drop-shadow-lg" />
                      </button>
                    </div>

                    {/* Song Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">{song.title}</p>
                      <p className="text-sm text-slate-400 truncate">{song.artist || "Unknown Artist"}</p>
                    </div>

                    {/* Duration & Source */}
                    <div className="hidden sm:flex items-center gap-3">
                      {song.duration && (
                        <span className="text-xs text-slate-400 bg-slate-900/50 px-2 py-1 rounded-lg">{formatDuration(song.duration)}</span>
                      )}
                      <span className="text-xs bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-lg border border-indigo-500/30">
                        {song.source}
                      </span>
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="hover:bg-indigo-500/20 text-indigo-400">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700">
                        <DropdownMenuItem onClick={() => onSongSelect?.(song)} className="cursor-pointer hover:bg-indigo-500/20">
                          Add to Favorites
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-indigo-500/20">Share with Friend</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 cursor-pointer hover:bg-red-500/20">Remove</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Top Songs */}
          {filter === "top-songs" && (
            <div className="space-y-3">
              {topSongs.length === 0 ? (
                <div className="text-center py-12">
                  <Music size={48} className="text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500">No top songs yet</p>
                </div>
              ) : (
                topSongs.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-800/40 to-indigo-900/20 rounded-xl border border-indigo-500/20 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/20 transition-all">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-indigo-500/50">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white">{item._id.title}</p>
                      <p className="text-sm text-slate-400">{item._id.artist}</p>
                    </div>
                    <span className="text-sm text-indigo-300 bg-indigo-500/20 px-4 py-1 rounded-lg border border-indigo-500/30 font-medium">
                      {item.count} plays
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Top Artists */}
          {filter === "top-artists" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {topArtists.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Music size={48} className="text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500">No artist data yet</p>
                </div>
              ) : (
                topArtists.map((artist, index) => (
                  <div
                    key={index}
                    className="p-6 bg-gradient-to-br from-slate-800/40 to-indigo-900/20 rounded-xl border border-indigo-500/20 text-center hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/20 transition-all group"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/50">
                      <Music size={36} className="text-white" />
                    </div>
                    <p className="font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">{artist._id}</p>
                    <p className="text-sm text-slate-400 mt-1">{artist.count} songs</p>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}

      <audio ref={audioRef} />
    </div>
  );
}
