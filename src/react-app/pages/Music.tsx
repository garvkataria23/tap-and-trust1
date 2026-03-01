import { useNavigate } from "react-router";
import { ArrowLeft, Music } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import MusicHistory from "@/react-app/components/MusicHistory";
import AlbumManager from "@/react-app/components/AlbumManager";
import PlaylistManager from "@/react-app/components/PlaylistManager";
import MusicSearch from "@/react-app/components/MusicSearch";
import MusicRecommendations from "@/react-app/components/MusicRecommendations";
import BrowseSongs from "@/react-app/components/BrowseSongs";
import DownloadManager from "@/react-app/components/DownloadManager";
import MusicPlayer from "@/react-app/components/MusicPlayer";
import type { PlayableSong } from "@/react-app/components/MusicPlayer";
import { useState, useEffect, useCallback } from "react";

export default function MusicPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [activeTab, setActiveTab] = useState<"history" | "albums" | "playlists" | "search" | "recommendations" | "browse" | "downloads">("browse");

  // Player state
  const [currentSong, setCurrentSong] = useState<PlayableSong | null>(null);
  const [songQueue, setSongQueue] = useState<PlayableSong[]>([]);
  const [queueIndex, setQueueIndex] = useState(-1);
  const [downloadedKeys, setDownloadedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const getUserId = async () => {
      try {
        const res = await fetch("/api/users/me");
        if (res.ok) {
          const data = await res.json();
          setUserId(data.id);
          localStorage.setItem("userId", data.id);
        } else {
          const storedUserId = localStorage.getItem("userId");
          if (storedUserId) {
            setUserId(storedUserId);
          } else {
            const demoId = "user_" + Math.random().toString(36).substr(2, 9);
            setUserId(demoId);
            localStorage.setItem("userId", demoId);
          }
        }
      } catch {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          const demoId = "user_" + Math.random().toString(36).substr(2, 9);
          setUserId(demoId);
          localStorage.setItem("userId", demoId);
        }
      }
    };
    getUserId();
  }, []);

  // Load downloaded song keys for the player's download button
  useEffect(() => {
    if (!userId) return;
    fetch(`/api/downloads/${userId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.downloads) {
          setDownloadedKeys(
            new Set(data.downloads.map((d: { title: string; artist: string }) => `${d.title}__${d.artist}`))
          );
        }
      })
      .catch(() => {});
  }, [userId]);

  const handlePlaySong = useCallback((song: PlayableSong, queue: PlayableSong[]) => {
    setCurrentSong(song);
    setSongQueue(queue);
    const idx = queue.findIndex((s) => s.id === song.id);
    setQueueIndex(idx >= 0 ? idx : 0);
  }, []);

  const handleNext = useCallback(() => {
    if (songQueue.length === 0) return;
    const nextIdx = (queueIndex + 1) % songQueue.length;
    // Skip songs without preview
    let attempts = 0;
    let idx = nextIdx;
    while (!songQueue[idx]?.preview && attempts < songQueue.length) {
      idx = (idx + 1) % songQueue.length;
      attempts++;
    }
    if (songQueue[idx]?.preview) {
      setQueueIndex(idx);
      setCurrentSong(songQueue[idx]);
    }
  }, [songQueue, queueIndex]);

  const handlePrev = useCallback(() => {
    if (songQueue.length === 0) return;
    const prevIdx = (queueIndex - 1 + songQueue.length) % songQueue.length;
    let idx = prevIdx;
    let attempts = 0;
    while (!songQueue[idx]?.preview && attempts < songQueue.length) {
      idx = (idx - 1 + songQueue.length) % songQueue.length;
      attempts++;
    }
    if (songQueue[idx]?.preview) {
      setQueueIndex(idx);
      setCurrentSong(songQueue[idx]);
    }
  }, [songQueue, queueIndex]);

  const handleClosePlayer = useCallback(() => {
    setCurrentSong(null);
    setSongQueue([]);
    setQueueIndex(-1);
  }, []);

  const handleDownloadFromPlayer = useCallback(async (song: PlayableSong) => {
    if (!userId) return;
    try {
      const res = await fetch('/api/downloads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
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
      if (res.ok || res.status === 409) {
        setDownloadedKeys((prev) => new Set(prev).add(`${song.title}__${song.artist}`));
      }
    } catch {
      // Fallback localStorage save
      const key = `${song.title}__${song.artist}`;
      setDownloadedKeys((prev) => new Set(prev).add(key));
    }
  }, [userId]);

  const isSongDownloaded = useCallback((song: PlayableSong) => {
    return downloadedKeys.has(`${song.title}__${song.artist}`);
  }, [downloadedKeys]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-indigo-500/20 bg-gradient-to-r from-slate-950/95 to-indigo-950/50 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/dashboard")}
            className="hover:bg-indigo-500/20 text-indigo-400"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/50">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">My Music</h1>
              <p className="text-indigo-300/60 text-sm">Discover your listening journey</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {userId && (
          <>
            {/* Tabs */}
            <div className="flex gap-2 mb-8 border-b border-indigo-500/20 overflow-x-auto pb-0">
              {[
                { id: "browse", label: "🎵 Browse" },
                { id: "downloads", label: "⬇ Downloads" },
                { id: "history", label: "History" },
                { id: "albums", label: "Albums" },
                { id: "playlists", label: "Playlists" },
                { id: "search", label: "Search" },
                { id: "recommendations", label: "For You" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-4 py-3 font-medium border-b-2 transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-indigo-500 text-indigo-400"
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "browse" && <BrowseSongs userId={userId} onPlaySong={handlePlaySong} />}
            {activeTab === "downloads" && <DownloadManager userId={userId} />}
            {activeTab === "history" && <MusicHistory userId={userId} />}
            {activeTab === "albums" && <AlbumManager userId={userId} />}
            {activeTab === "playlists" && <PlaylistManager userId={userId} />}
            {activeTab === "search" && <MusicSearch />}
            {activeTab === "recommendations" && <MusicRecommendations userId={userId} />}
          </>
        )}
      </div>

      {/* Music Player - fixed at bottom */}
      <MusicPlayer
        song={currentSong}
        queue={songQueue}
        onNext={handleNext}
        onPrev={handlePrev}
        onClose={handleClosePlayer}
        onDownload={handleDownloadFromPlayer}
        isDownloaded={isSongDownloaded}
      />
    </div>
  );
}
