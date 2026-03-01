import { useState, useEffect, useCallback } from 'react';
import { Download, Trash2, HardDrive, AlertTriangle, Music, RefreshCw } from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';
import { Card } from '@/react-app/components/ui/card';
import { Badge } from '@/react-app/components/ui/badge';
import { Progress } from '@/react-app/components/ui/progress';

interface DownloadedSong {
  _id: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  duration?: number;
  imageUrl?: string;
  fileSize: number;
  downloadedAt: string;
  isOfflineAvailable: boolean;
}

interface StorageInfo {
  storageUsed: number;
  storageLimit: number;
  storagePercent: number;
  songCount: number;
  remaining: number;
}

interface Props {
  userId: string;
}

export default function DownloadManager({ userId }: Props) {
  const [downloads, setDownloads] = useState<DownloadedSong[]>([]);
  const [storage, setStorage] = useState<StorageInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchDownloads = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/downloads/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setDownloads(data.downloads || []);
        setStorage({
          storageUsed: data.storageUsed,
          storageLimit: data.storageLimit,
          storagePercent: data.storagePercent,
          songCount: data.count,
          remaining: data.storageLimit - data.storageUsed,
        });
      }
    } catch (error) {
      console.error('Failed to fetch downloads:', error);
      // Use localStorage fallback
      const stored = localStorage.getItem(`downloads_${userId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setDownloads(parsed);
        const totalSize = parsed.reduce((s: number, d: DownloadedSong) => s + (d.fileSize || 0), 0);
        const limit = 500 * 1024 * 1024;
        setStorage({
          storageUsed: totalSize,
          storageLimit: limit,
          storagePercent: Math.round((totalSize / limit) * 100),
          songCount: parsed.length,
          remaining: limit - totalSize,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchDownloads();
  }, [fetchDownloads]);

  const deleteSong = async (downloadId: string) => {
    setDeleting(downloadId);
    try {
      const res = await fetch(`/api/downloads/${downloadId}`, { method: 'DELETE' });
      if (res.ok) {
        setDownloads((prev) => prev.filter((d) => d._id !== downloadId));
        fetchDownloads(); // Refresh storage info
      }
    } catch (error) {
      console.error('Failed to delete download:', error);
      // Fallback: remove locally
      setDownloads((prev) => {
        const updated = prev.filter((d) => d._id !== downloadId);
        localStorage.setItem(`downloads_${userId}`, JSON.stringify(updated));
        return updated;
      });
    } finally {
      setDeleting(null);
    }
  };

  const clearAllDownloads = async () => {
    if (!confirm('Delete all downloaded songs? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/downloads/${userId}/all`, { method: 'DELETE' });
      if (res.ok) {
        setDownloads([]);
        setStorage((prev) =>
          prev ? { ...prev, storageUsed: 0, storagePercent: 0, songCount: 0, remaining: prev.storageLimit } : null
        );
      }
    } catch (error) {
      console.error('Failed to clear downloads:', error);
      setDownloads([]);
      localStorage.removeItem(`downloads_${userId}`);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-2" />
        <p className="text-indigo-300/60">Loading downloads...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Storage Overview */}
      <Card className="bg-gradient-to-r from-slate-800/80 to-indigo-900/30 border-indigo-500/20 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
            <HardDrive className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Storage</h3>
            <p className="text-indigo-300/60 text-sm">
              {storage ? `${formatSize(storage.storageUsed)} of ${formatSize(storage.storageLimit)} used` : 'Calculating...'}
            </p>
          </div>
          {storage && storage.storagePercent >= 80 && (
            <Badge className="ml-auto bg-yellow-600/40 text-yellow-300">
              <AlertTriangle className="w-3 h-3 mr-1" />
              {storage.storagePercent >= 90 ? 'Almost full' : 'Running low'}
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <Progress value={storage?.storagePercent || 0} className="h-3" />
          <div className="flex justify-between text-xs text-indigo-300/60">
            <span>{storage?.songCount || 0} songs downloaded</span>
            <span>{storage ? formatSize(storage.remaining) : '—'} remaining</span>
          </div>
        </div>

        {downloads.length > 0 && (
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllDownloads}
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Clear All
            </Button>
          </div>
        )}
      </Card>

      {/* Downloaded Songs */}
      {downloads.length === 0 ? (
        <Card className="bg-gradient-to-br from-slate-800/50 to-indigo-900/20 border-indigo-500/20 p-8 text-center">
          <Download className="w-12 h-12 text-indigo-500/20 mx-auto mb-4" />
          <h3 className="text-indigo-300/80 font-semibold mb-2">No Downloads Yet</h3>
          <p className="text-indigo-300/40 text-sm">
            Browse songs and tap the download button to save them for offline listening.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-indigo-300">Downloaded Songs</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchDownloads}
              className="text-indigo-400 hover:bg-indigo-500/20"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          {downloads.map((song) => (
            <Card
              key={song._id}
              className="bg-gradient-to-r from-slate-800/50 to-indigo-900/20 border-indigo-500/20 p-4 hover:border-indigo-500/40 transition-all"
            >
              <div className="flex items-center gap-4">
                {/* Album Art */}
                {song.imageUrl ? (
                  <img
                    src={song.imageUrl}
                    alt={song.title}
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-indigo-900/50 flex items-center justify-center flex-shrink-0">
                    <Music className="w-6 h-6 text-indigo-500/40" />
                  </div>
                )}

                {/* Song Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-indigo-300 font-semibold line-clamp-1">{song.title}</h4>
                  <p className="text-indigo-300/60 text-sm line-clamp-1">{song.artist}</p>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {song.genre && (
                      <Badge className="bg-blue-600/30 text-blue-300 text-xs">{song.genre}</Badge>
                    )}
                    <span className="text-indigo-300/40 text-xs">{formatSize(song.fileSize)}</span>
                    <span className="text-indigo-300/40 text-xs">
                      {formatDate(song.downloadedAt)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-indigo-300/60 text-sm">{formatDuration(song.duration)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteSong(song._id)}
                    disabled={deleting === song._id}
                    className="text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
