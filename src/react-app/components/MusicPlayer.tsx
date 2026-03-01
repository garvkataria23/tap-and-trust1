import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Download, Heart, X, Music } from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';

export interface PlayableSong {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  duration?: number;
  imageUrl?: string;
  preview?: string; // 30-second preview MP3 URL
  fileSize?: number;
  popularity?: number;
}

interface Props {
  song: PlayableSong | null;
  queue: PlayableSong[];
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  onDownload?: (song: PlayableSong) => void;
  isDownloaded?: (song: PlayableSong) => boolean;
}

export default function MusicPlayer({ song, queue, onNext, onPrev, onClose, onDownload, isDownloaded }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  // When song changes, load and play
  useEffect(() => {
    if (!song?.preview) {
      setIsPlaying(false);
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    setIsLoading(true);
    audio.src = song.preview;
    audio.volume = isMuted ? 0 : volume;
    audio.load();

    const playPromise = audio.play();
    if (playPromise) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch(() => {
          setIsPlaying(false);
          setIsLoading(false);
        });
    }

    setLiked(false);
  }, [song?.id]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoading(false);
    }
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    if (queue.length > 0) {
      onNext();
    }
  }, [queue.length, onNext]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !song?.preview) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = percent * duration;
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!song) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const downloaded = isDownloaded?.(song) || false;

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="auto"
      />

      {/* Fixed bottom player bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-t border-indigo-500/30 backdrop-blur-xl shadow-2xl shadow-indigo-500/10">
        {/* Progress bar (clickable) */}
        <div
          ref={progressRef}
          onClick={seekTo}
          className="h-1.5 bg-slate-800 cursor-pointer group relative"
        >
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-150 relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* Song info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {song.imageUrl ? (
              <img
                src={song.imageUrl}
                alt={song.title}
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0 shadow-lg"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-indigo-900/50 flex items-center justify-center flex-shrink-0">
                <Music className="w-5 h-5 text-indigo-400" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-white font-medium text-sm truncate">{song.title}</p>
              <p className="text-indigo-300/60 text-xs truncate">{song.artist}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onPrev}
              disabled={queue.length === 0}
              className="text-indigo-300 hover:bg-indigo-500/20 hover:text-white"
            >
              <SkipBack className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlay}
              disabled={!song.preview || isLoading}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white flex items-center justify-center p-0"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onNext}
              disabled={queue.length === 0}
              className="text-indigo-300 hover:bg-indigo-500/20 hover:text-white"
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Time */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-indigo-300/60 w-24 justify-center">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Volume */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
              className="text-indigo-300 hover:bg-indigo-500/20 hidden sm:flex"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }}
              className="w-16 h-1 accent-indigo-500 hidden sm:block"
            />

            {/* Like */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLiked(!liked)}
              className={liked ? 'text-red-400 hover:bg-red-500/20' : 'text-indigo-300 hover:bg-indigo-500/20'}
            >
              <Heart className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} />
            </Button>

            {/* Download */}
            {onDownload && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDownload(song)}
                disabled={downloaded}
                className={downloaded ? 'text-green-400' : 'text-indigo-300 hover:bg-indigo-500/20'}
                title={downloaded ? 'Already downloaded' : 'Download song'}
              >
                <Download className="w-4 h-4" />
              </Button>
            )}

            {/* Close */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { audioRef.current?.pause(); onClose(); }}
              className="text-indigo-300 hover:bg-red-500/20 hover:text-red-400"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Preview notice */}
        {song.preview && (
          <div className="text-center pb-1">
            <span className="text-[10px] text-indigo-400/40">30-second preview · Powered by Deezer</span>
          </div>
        )}
      </div>
    </>
  );
}
