import { useLocalStorage } from './useLocalStorage';
import { Theme } from '../types';

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', { isDark: false });

  const toggleTheme = () => {
    setTheme(prev => ({ isDark: !prev.isDark }));
  };

  return { theme, toggleTheme };
}