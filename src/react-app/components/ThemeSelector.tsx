import { useState } from 'react';
import { Moon, Sun, Check } from 'lucide-react';
import { useTheme } from '@/react-app/contexts/useTheme';

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { id: 'dark', name: 'Dark', icon: Moon, description: 'Dark theme with purple accents' },
    { id: 'light', name: 'Light', icon: Sun, description: 'Light theme for daytime' },
  ];

  const handleThemeChange = (themeId: string) => {
    setTheme(themeId as 'dark' | 'light');
    setIsOpen(false);
  };

  return (
    <>
      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
        title="Toggle theme"
      >
        {theme === 'dark' && <Moon className="w-5 h-5 text-blue-400" />}
        {theme === 'light' && <Sun className="w-5 h-5 text-amber-400" />}
      </button>

      {/* Theme Dropdown Menu */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900/95 backdrop-blur border border-white/10 rounded-xl shadow-2xl p-3 z-50">
            <div className="space-y-2">
              {themes.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleThemeChange(t.id)}
                    className={`w-full p-3 rounded-lg text-left transition-all border flex items-center gap-3 ${
                      theme === t.id
                        ? 'bg-gradient-to-r from-purple-600/40 to-pink-600/40 border-purple-500/50'
                        : 'bg-slate-800/30 border-slate-700 hover:bg-slate-800/60 hover:border-slate-600'
                    }`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${
                      theme === t.id ? 'text-purple-300' : 'text-white/60'
                    }`} />
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${theme === t.id ? 'text-white' : 'text-white/80'}`}>
                        {t.name}
                      </p>
                      <p className="text-xs text-white/40">{t.description}</p>
                    </div>
                    {theme === t.id && (
                      <Check className="w-5 h-5 text-purple-300 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}
