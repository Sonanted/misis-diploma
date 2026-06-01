import { Monitor, Moon, Sun } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { applyTheme, Theme } from '@/lib/theme';

const THEME_OPTIONS: { value: Theme; label: string; icon: React.ElementType }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) ?? 'system';
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (theme === 'system') applyTheme('system');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  return { theme, setTheme };
}

export function ThemeSwitcherCompact({ theme, onChange }: { theme: Theme; onChange: (t: Theme) => void }) {
  return (
    <div className="flex gap-1">
      {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
        <Button
          key={value}
          type="button"
          size="xs"
          variant={theme === value ? 'default' : 'outline'}
          onClick={() => onChange(value)}
          aria-label={label}
          className={cn('px-1.5 py-1 h-7 w-7 flex items-center justify-center', theme === value ? '' : 'bg-transparent')}
        >
          <Icon className="size-4" />
        </Button>
      ))}
    </div>
  );
}
