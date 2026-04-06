import { useTheme } from "@/hooks/useToggleTheme";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-layout/10 border border-border hover:bg-primary/10 hover:border-primary/30 transition-all active:scale-95 group"
      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
    >
      {theme === "light" ? (
        <span className="text-lg group-hover:rotate-12 transition-transform">🌙</span>
      ) : (
        <span className="text-lg group-hover:rotate-45 transition-transform">☀️</span>
      )}
    </button>
  );
};

export default ThemeToggle;