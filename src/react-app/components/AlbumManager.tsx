import { useState, useEffect } from "react";
import { Plus, Music, Edit2, Trash2, Heart, Share2 } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Textarea } from "@/react-app/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/react-app/components/ui/dialog";
import { Badge } from "@/react-app/components/ui/badge";

interface Album {
  _id: string;
  name: string;
  description: string;
  coverImage: string;
  songs: any[];
  isPublic: boolean;
  likes: number;
  likedBy: string[];
  totalDuration: number;
}

interface AlbumManagerProps {
  userId: string;
}

export default function AlbumManager({ userId }: AlbumManagerProps) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    coverImage: "",
    isPublic: false,
  });

  useEffect(() => {
    fetchAlbums();
  }, [userId]);

  const fetchAlbums = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/albums/${userId}`);
      const data = await res.json();
      setAlbums(data.albums || []);
    } catch (error) {
      console.error("Failed to fetch albums:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdateAlbum = async () => {
    if (!formData.name.trim()) {
      alert("Please enter an album name");
      return;
    }

    try {
      if (editingAlbum) {
        // Update existing album
        const res = await fetch(`/api/albums/${editingAlbum._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          alert("Album updated successfully!");
        }
      } else {
        // Create new album
        const res = await fetch("/api/albums", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            ...formData,
          }),
        });
        if (res.ok) {
          alert("Album created successfully!");
        }
      }
      setShowCreateDialog(false);
      resetForm();
      fetchAlbums();
    } catch (error) {
      console.error("Failed to save album:", error);
      alert("Failed to save album. Please try again.");
    }
  };

  const handleDeleteAlbum = async (albumId: string) => {
    if (!confirm("Are you sure you want to delete this album?")) return;

    try {
      const res = await fetch(`/api/albums/${albumId}`, { method: "DELETE" });
      if (res.ok) {
        alert("Album deleted successfully!");
        fetchAlbums();
      }
    } catch (error) {
      console.error("Failed to delete album:", error);
    }
  };

  const handleLikeAlbum = async (albumId: string, isLiked: boolean) => {
    try {
      const endpoint = isLiked ? "unlike" : "like";
      const res = await fetch(`/api/albums/${albumId}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        fetchAlbums();
      }
    } catch (error) {
      console.error("Failed to like/unlike album:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      coverImage: "",
      isPublic: false,
    });
    setEditingAlbum(null);
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return "0s";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return <div className="text-center py-8 text-slate-400">Loading albums...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white">My Albums</h3>
          <p className="text-indigo-300/60 text-sm mt-1">Create and organize your music collections</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowCreateDialog(true);
          }}
          className="gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg shadow-indigo-600/50"
        >
          <Plus size={18} />
          New Album
        </Button>
      </div>

      {/* Create/Edit Album Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl bg-slate-900 border-indigo-500/30">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingAlbum ? "Edit Album" : "Create New Album"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Album Name</label>
              <Input
                placeholder="My Favorite Songs..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-slate-800/50 border-indigo-500/30 text-white placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Description</label>
              <Textarea
                placeholder="What's this album about?..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="min-h-24 bg-slate-800/50 border-indigo-500/30 text-white placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Cover Image URL</label>
              <Input
                placeholder="https://example.com/image.jpg"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                className="bg-slate-800/50 border-indigo-500/30 text-white placeholder:text-slate-500"
              />
              {formData.coverImage && (
                <img src={formData.coverImage} alt="Preview" className="w-24 h-24 mt-2 rounded-lg object-cover" />
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPublic"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                className="w-4 h-4 rounded bg-slate-800 border-indigo-500/30"
              />
              <label htmlFor="isPublic" className="text-sm text-white cursor-pointer">
                Make this album public (visible to others)
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
                className="flex-1 border-slate-600 hover:bg-slate-800/50 text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateOrUpdateAlbum}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
              >
                {editingAlbum ? "Update Album" : "Create Album"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Albums Grid */}
      {albums.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-slate-800/40 to-indigo-900/20 rounded-xl border border-indigo-500/20">
          <Music size={48} className="text-slate-600 mx-auto mb-4" />
          <p className="text-white font-medium">No albums yet</p>
          <p className="text-indigo-300/60 text-sm">Create your first album to organize your favorite songs</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {albums.map((album) => (
            <div
              key={album._id}
              className="p-4 bg-gradient-to-br from-slate-800/40 to-indigo-900/20 rounded-xl border border-indigo-500/20 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/20 transition-all group"
            >
              {/* Album Cover */}
              <div className="relative mb-4">
                {album.coverImage ? (
                  <img
                    src={album.coverImage}
                    alt={album.name}
                    className="w-full h-40 rounded-lg object-cover ring-2 ring-indigo-500/30"
                  />
                ) : (
                  <div className="w-full h-40 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center ring-2 ring-indigo-500/30">
                    <Music size={40} className="text-white" />
                  </div>
                )}
              </div>

              {/* Album Info */}
              <h4 className="font-semibold text-white group-hover:text-indigo-300 transition-colors truncate">
                {album.name}
              </h4>
              <p className="text-sm text-slate-400 truncate mt-1">{album.description}</p>

              {/* Stats */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                  {album.songs.length} songs
                </Badge>
                {album.isPublic && (
                  <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">Public</Badge>
                )}
                {album.totalDuration > 0 && (
                  <span className="text-xs text-slate-400">{formatDuration(album.totalDuration)}</span>
                )}
              </div>

              {/* Likes */}
              <div className="flex items-center gap-2 mt-2">
                <Heart
                  size={16}
                  className={`cursor-pointer transition-colors ${
                    album.likedBy.includes(userId) ? "fill-rose-500 text-rose-500" : "text-slate-400"
                  }`}
                  onClick={() => handleLikeAlbum(album._id, album.likedBy.includes(userId))}
                />
                <span className="text-xs text-slate-400">{album.likes} likes</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex-1 hover:bg-indigo-500/20 text-indigo-300"
                  onClick={() => {
                    setEditingAlbum(album);
                    setFormData({
                      name: album.name,
                      description: album.description || "",
                      coverImage: album.coverImage || "",
                      isPublic: album.isPublic,
                    });
                    setShowCreateDialog(true);
                  }}
                >
                  <Edit2 size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex-1 hover:bg-blue-500/20 text-blue-300"
                >
                  <Share2 size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex-1 hover:bg-red-500/20 text-red-300"
                  onClick={() => handleDeleteAlbum(album._id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
