import { useState } from 'react';
import { Button } from '@/react-app/components/ui/button';
import { Zap } from 'lucide-react';

const ICEBREAKERS = [
  'What\'s your hidden talent?',
  'If you could have dinner with anyone, who would it be?',
  'What\'s the best advice you\'ve ever received?',
  'What\'s on your bucket list?',
  'What\'s your go-to karaoke song?',
  'What\'s the most interesting thing about you?',
  'If you could travel anywhere, where would it be?',
  'What\'s your favorite way to spend a weekend?',
  'What skill would you love to master?',
  'What\'s your favorite podcast or show right now?',
  'What\'s the best concert you\'ve ever been to?',
  'What\'s your guilty pleasure?',
  'If you could switch lives with someone for a day, who would it be?',
  'What\'s the most fun thing you\'ve done recently?',
  'What\'s your favorite food memory?',
];

export default function IcebreakerModal({ 
  isOpen, 
  onClose, 
  onSelect,
  friendName 
}: { 
  isOpen: boolean;
  onClose: () => void;
  onSelect: (breaker: string) => void;
  friendName?: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!isOpen) return null;

  const currentBreaker = ICEBREAKERS[selectedIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl border border-border/50">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Icebreaker</h2>
            {friendName && <p className="text-xs text-muted-foreground">with {friendName}</p>}
          </div>
        </div>

        {/* Icebreaker Card */}
        <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-6 mb-6 border border-primary/30 min-h-32 flex items-center justify-center">
          <p className="text-center text-lg font-semibold leading-relaxed">
            {currentBreaker}
          </p>
        </div>

        {/* Counter */}
        <p className="text-center text-sm text-muted-foreground mb-6">
          {selectedIndex + 1} of {ICEBREAKERS.length}
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => {
              onSelect(currentBreaker);
              onClose();
            }}
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-medium"
          >
            Use This Question
          </Button>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setSelectedIndex((prev) => (prev - 1 + ICEBREAKERS.length) % ICEBREAKERS.length)}
              className="flex-1"
            >
              ← Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedIndex((prev) => (prev + 1) % ICEBREAKERS.length)}
              className="flex-1"
            >
              Next →
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
          >
            Skip
          </Button>
        </div>
      </div>
    </div>
  );
}
