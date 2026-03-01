import { useState } from "react";
import { Star, MessageCircle } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/react-app/components/ui/dialog";
import { Textarea } from "@/react-app/components/ui/textarea";

interface ConnectorRatingProps {
  userId: string;
  friendId: string;
  friendName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, review: string) => void;
}

export default function ConnectorRating({
  userId,
  friendId,
  friendName,
  isOpen,
  onClose,
  onSubmit,
}: ConnectorRatingProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setLoading(true);
    try {
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ratedBy: userId,
          ratedUser: friendId,
          rating,
          review: review || undefined,
          category: "overall",
        }),
      });

      if (response.ok) {
        onSubmit(rating, review);
        setRating(0);
        setReview("");
        onClose();
      }
    } catch (error) {
      console.error("Failed to submit rating:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-yellow-500/30 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-yellow-400">Rate {friendName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Star Rating */}
          <div className="flex flex-col items-center space-y-3">
            <p className="text-sm text-slate-400">How would you rate this connector?</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={`${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400 drop-shadow-lg drop-shadow-yellow-400/50"
                        : "text-slate-600"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm font-medium text-yellow-300">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            )}
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <MessageCircle size={16} />
              Add a Review (Optional)
            </label>
            <Textarea
              placeholder={`Tell us about your experience with ${friendName}...`}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              maxLength={500}
              className="min-h-24 resize-none bg-slate-800 border-yellow-500/30 text-white placeholder:text-slate-500"
            />
            <p className="text-xs text-slate-500 text-right">{review.length}/500</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || loading}
              className="flex-1 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white font-semibold shadow-lg shadow-yellow-600/50"
            >
              {loading ? "Submitting..." : "Submit Rating"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
