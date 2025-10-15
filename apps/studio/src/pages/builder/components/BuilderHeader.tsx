import { Link } from "react-router-dom";
import { ThemeToggle } from "../../../components/ThemeToggle";

export function BuilderHeader() {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-8 py-5 text-sm text-slate-600 backdrop-blur dark:border-white/5 dark:bg-slate-950/60 dark:text-slate-400">
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Link
          to="/"
          className="rounded-full border border-slate-200 px-3 py-1 text-emerald-600 transition hover:border-emerald-500/60 hover:text-emerald-500 dark:border-transparent dark:text-emerald-300 dark:hover:border-emerald-500/40 dark:hover:text-emerald-200"
        >
          返回首页
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden text-xs uppercase text-slate-500 dark:text-slate-500 sm:block">
          画布尺寸
        </span>
        <nav className="flex items-center gap-1 rounded-full border border-slate-200 bg-white/70 p-1 text-xs dark:border-white/5 dark:bg-slate-900/70">
          {[
            { id: "desktop", label: "Desktop" },
            { id: "tablet", label: "Tablet" },
            { id: "mobile", label: "Mobile" }
          ].map((viewport) => (
            <button
              key={viewport.id}
              className="rounded-full px-3 py-1 text-slate-600 transition hover:bg-emerald-500/20 hover:text-emerald-800 dark:text-slate-300 dark:hover:text-white"
              type="button"
            >
              {viewport.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-700"
        >
          保存
        </button>
        <button
          type="button"
          className="rounded-full bg-emerald-600 px-4 py-2 text-white transition hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
        >
          发布
        </button>
      </div>
    </header>
  );
}
