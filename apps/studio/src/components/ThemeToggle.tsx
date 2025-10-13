import { useTheme } from "../theme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-emerald-400 hover:text-emerald-500 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:border-emerald-400/60 dark:hover:text-emerald-200"
      aria-label={`切换到${isDark ? "浅色" : "深色"}主题`}
    >
      <span role="img" aria-hidden="true">
        {isDark ? "🌞" : "🌙"}
      </span>
      <span className="hidden sm:inline">{isDark ? "浅色模式" : "深色模式"}</span>
    </button>
  );
}
