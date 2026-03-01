import { useState } from 'react';
import { Button } from '@/react-app/components/ui/button';
import { Trash2, Edit2, Pin } from 'lucide-react';

interface MessageFeatureProps {
  senderId: string;
  currentUserId: string;
  content: string;
  isEdited?: boolean;
  reactions?: any[];
  isPinned?: boolean;
  readBy?: any[];
  onEdit?: (newContent: string) => void;
  onDelete?: () => void;
  onPin?: (isPinned: boolean) => void;
  onReact?: (emoji: string) => void;
}

const EMOJI_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🔥', '🎉'];

export function MessageActions({
  senderId,
  currentUserId,
  content,
  isEdited,
  reactions,
  isPinned,
  readBy,
  onEdit,
  onDelete,
  onPin,
  onReact,
}: MessageFeatureProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const isOwn = senderId === currentUserId;

  const handleEdit = () => {
    if (onEdit && editContent.trim()) {
      onEdit(editContent);
      setEditMode(false);
    }
  };

  return (
    <div className="space-y-2">
      {/* Edited indicator */}
      {isEdited && <p className="text-xs text-gray-400">(edited)</p>}

      {/* Edit mode */}
      {editMode ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="flex-1 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
          />
          <Button
            size="sm"
            onClick={handleEdit}
            className="text-xs"
          >
            Save
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setEditMode(false)}
            className="text-xs"
          >
            Cancel
          </Button>
        </div>
      ) : null}

      {/* Reactions */}
      <div className="flex flex-wrap gap-1">
        {reactions?.map((reaction) => (
          <button
            key={reaction.emoji}
            onClick={() => onReact?.(reaction.emoji)}
            className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/20 rounded text-xs flex items-center gap-1 transition-colors"
          >
            <span>{reaction.emoji}</span>
            <span className="text-white/70">{reaction.users?.length || 0}</span>
          </button>
        ))}

        {/* Add reaction button */}
        <div className="relative">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/20 rounded text-xs"
          >
            😊
          </button>

          {showEmojiPicker && (
            <div className="absolute bottom-10 left-0 bg-slate-900 border border-white/20 rounded-lg p-2 grid grid-cols-4 gap-1 z-10">
              {EMOJI_REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onReact?.(emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="w-8 h-8 hover:bg-white/10 rounded text-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Read receipts */}
      {readBy && readBy.length > 0 && (
        <p className="text-xs text-gray-500">
          Read by {readBy.length} {readBy.length === 1 ? 'person' : 'people'}
        </p>
      )}

      {/* Action buttons (only for message owner) */}
      {isOwn && (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setEditMode(true)}
            className="text-xs text-gray-400 hover:text-white"
          >
            <Edit2 className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onPin?.(!isPinned)}
            className="text-xs text-gray-400 hover:text-white"
          >
            <Pin className="w-3 h-3 mr-1" />
            {isPinned ? 'Unpin' : 'Pin'}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onDelete}
            className="text-xs text-red-400 hover:text-red-300"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}
