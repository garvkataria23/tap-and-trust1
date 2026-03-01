import { useState } from 'react';
import { Moon, Sun, X, Check } from 'lucide-react';
import { useTheme } from '@/react-app/contexts/useTheme';
import { Button } from '@/react-app/components/ui/button';

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { id: 'dark', name: 'Dark', icon: Moon, description: 'Dark theme with purple accents' },
    { id: 'light', name: 'Light', icon: Sun, description: 'Light theme for daytime' },
  ];

  const handleThemeChange = (themeId: string) => {
    setTheme(themeId as 'dark' | 'light');
  };

  return (
    <>
      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-lg hover:bg-white/10 transition-colors group"
        title="Theme settings"
      >
        {theme === 'dark' && <Moon className="w-5 h-5 text-blue-400" />}
        {theme === 'light' && <Sun className="w-5 h-5 text-amber-400" />}
      </button>

      {/* Theme Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6 animate-in fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                Theme Settings
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white/60" />
              </button>
            </div>

            {/* Theme Selection */}
            <div className="space-y-3 mb-6">
              {themes.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleThemeChange(t.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all border-2 flex items-start gap-3 ${
                      theme === t.id
                        ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-purple-500'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 cursor-pointer'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${
                      theme === t.id ? 'text-purple-400' : 'text-white/60'
                    }`} />
                    <div className="flex-1">
                      <p className={`font-semibold ${theme === t.id ? 'text-white' : 'text-white/80'}`}>
                        {t.name}
                      </p>
                      <p className="text-xs text-white/50">{t.description}</p>
                    </div>
                    {theme === t.id && (
                      <Check className="w-5 h-5 text-purple-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Action Button */}
            <Button
              onClick={() => setIsOpen(false)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold h-10"
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
