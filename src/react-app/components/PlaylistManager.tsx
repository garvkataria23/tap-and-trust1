import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Share2 } from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Textarea } from '@/react-app/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/react-app/components/ui/dialog';
import { Card } from '@/react-app/components/ui/card';
import { Badge } from '@/react-app/components/ui/badge';

interface Playlist {
  _id: string;
  name: string;
  description: string;
  coverImage: string;
  isPublic: boolean;
  isCollaborative: boolean;
  songs: Array<{
    musicHistoryId: string;
    title: string;
    artist: string;
    duration: number;
    imageUrl: string;
    addedBy: string;
  }>;
  collaborators: Array<{
    userId: string;
    name: string;
    role: 'editor' | 'viewer';
  }>;
  totalDuration: number;
  plays: number;
  likes: number;
}

interface PlaylistManagerProps {
  userId: string;
}

export default function PlaylistManager({ userId }: PlaylistManagerProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    coverImage: '',
    isPublic: false,
    isCollaborative: false,
  });

  useEffect(() => {
    fetchPlaylists();
  }, [userId]);

  const fetchPlaylists = async () => {
    try {
      const res = await fetch(`/api/playlists/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setPlaylists(data.playlists || []);
      }
    } catch (error) {
      console.error('Failed to fetch playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/playlists/${editingId}` : '/api/playlists';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          ...formData,
        }),
      });

      if (res.ok) {
        fetchPlaylists();
        setFormData({ name: '', description: '', coverImage: '', isPublic: false, isCollaborative: false });
        setEditingId(null);
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Failed to save playlist:', error);
    }
  };

  const handleDelete = async (playlistId: string) => {
    if (!confirm('Are you sure you want to delete this playlist?')) return;

    try {
      const res = await fetch(`/api/playlists/${playlistId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchPlaylists();
      }
    } catch (error) {
      console.error('Failed to delete playlist:', error);
    }
  };

  const handleEdit = (playlist: Playlist) => {
    setFormData({
      name: playlist.name,
      description: playlist.description,
      coverImage: playlist.coverImage,
      isPublic: playlist.isPublic,
      isCollaborative: playlist.isCollaborative,
    });
    setEditingId(playlist._id);
    setIsOpen(true);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  if (loading) {
    return <div className="text-center py-8 text-indigo-300">Loading playlists...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text">
          My Playlists
        </h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingId(null);
                setFormData({ name: '', description: '', coverImage: '', isPublic: false, isCollaborative: false });
              }}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg shadow-indigo-500/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Playlist
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900/95 border border-indigo-500/20">
            <DialogHeader>
              <DialogTitle className="text-indigo-400">{editingId ? 'Edit' : 'Create'} Playlist</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-indigo-300 mb-2 text-sm">Playlist Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter playlist name"
                  className="bg-slate-800 border-indigo-500/20 text-white placeholder:text-slate-500"
                  required
                />
              </div>
              <div>
                <label className="block text-indigo-300 mb-2 text-sm">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add a description"
                  className="bg-slate-800 border-indigo-500/20 text-white placeholder:text-slate-500"
                />
              </div>
              <div>
                <label className="block text-indigo-300 mb-2 text-sm">Cover Image URL</label>
                <Input
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="bg-slate-800 border-indigo-500/20 text-white placeholder:text-slate-500"
                />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-indigo-300">
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span>Public</span>
                </label>
                <label className="flex items-center gap-2 text-indigo-300">
                  <input
                    type="checkbox"
                    checked={formData.isCollaborative}
                    onChange={(e) => setFormData({ ...formData, isCollaborative: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span>Collaborative</span>
                </label>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
              >
                {editingId ? 'Update' : 'Create'} Playlist
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Playlists Grid */}
      {playlists.length === 0 ? (
        <Card className="bg-slate-800/50 border-indigo-500/20 p-8 text-center">
          <p className="text-indigo-300/60 mb-4">No playlists yet. Create one to get started!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist) => (
            <Card
              key={playlist._id}
              className="bg-gradient-to-br from-slate-800/50 to-indigo-900/20 border-indigo-500/20 overflow-hidden hover:border-indigo-500/40 transition-all group"
            >
              {/* Cover Image */}
              <div className="relative h-40 bg-gradient-to-br from-indigo-600/30 to-blue-600/30 overflow-hidden">
                {playlist.coverImage ? (
                  <img src={playlist.coverImage} alt={playlist.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all" />
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-indigo-300 line-clamp-1">{playlist.name}</h3>
                  <p className="text-indigo-300/60 text-xs line-clamp-2">{playlist.description}</p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-2 text-xs text-indigo-300/70">
                  <span>{playlist.songs.length} songs</span>
                  <span>•</span>
                  <span>{formatDuration(playlist.totalDuration)}</span>
                  {playlist.plays > 0 && (
                    <>
                      <span>•</span>
                      <span>{playlist.plays} plays</span>
                    </>
                  )}
                </div>

                {/* Badges */}
                <div className="flex gap-2 flex-wrap">
                  {playlist.isPublic && <Badge className="bg-indigo-600/40 text-indigo-300 text-xs">Public</Badge>}
                  {playlist.isCollaborative && (
                    <Badge className="bg-blue-600/40 text-blue-300 text-xs">
                      <Share2 className="w-3 h-3 mr-1" />
                      {playlist.collaborators.length} collaborators
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-indigo-500/10">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(playlist)}
                    className="flex-1 text-indigo-400 hover:bg-indigo-500/20"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(playlist._id)}
                    className="flex-1 text-red-400 hover:bg-red-500/20"
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
