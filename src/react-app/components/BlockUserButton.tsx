import { useState } from "react";
import { Ban, AlertCircle } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/react-app/components/ui/dialog";

interface BlockUserButtonProps {
  userId: string;
  friendId: string;
  friendName: string;
  onBlockSuccess?: () => void;
}

export default function BlockUserButton({
  userId,
  friendId,
  friendName,
  onBlockSuccess,
}: BlockUserButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBlock = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}/block/${friendId}`, {
        method: "POST",
      });

      if (response.ok) {
        setIsOpen(false);
        onBlockSuccess?.();
        
        // Show success message
        setTimeout(() => {
          alert(`${friendName} has been blocked. They won't be able to message you.`);
        }, 300);
      }
    } catch (error) {
      console.error("Failed to block user:", error);
      alert("Failed to block user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-lg shadow-red-600/50"
      >
        <Ban size={16} />
        Block
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-slate-900 border-red-500/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <AlertCircle className="text-red-500" size={24} />
              Block User?
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Are you sure you want to block {friendName}?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-red-500/10 rounded-lg p-4 space-y-2 border border-red-500/20">
              <h4 className="font-medium text-red-300">What happens when you block someone?</h4>
              <ul className="text-sm text-red-200/80 space-y-1">
                <li>• They won't be able to send you messages</li>
                <li>• They won't see your online status</li>
                <li>• You won't see them in your friends list</li>
                <li>• All their previous messages will be hidden</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleBlock}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
              >
                {isLoading ? "Blocking..." : "Block User"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
