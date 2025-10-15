import { Link } from "react-router-dom";
import { NixoraButton } from "@nixora/ui";
import { ThemeToggle } from "../components/ThemeToggle";

export function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-50">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 md:px-12 md:py-16">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 text-lg font-semibold text-emerald-500 dark:text-emerald-300">
              NX
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Studio
              </p>
              <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Nixora Studio
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/builder"
              className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-500 dark:text-emerald-300 dark:hover:text-emerald-200"
            >
              进入页面搭建器
            </Link>
            <NixoraButton variant="ghost">Log in</NixoraButton>
            <NixoraButton>Create workspace</NixoraButton>
          </div>
        </header>
        <div className="mt-16 grid flex-1 gap-16 md:grid-cols-[1.15fr_0.85fr] md:items-center">
          <section className="space-y-6">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Meet your experience platform
              </p>
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                Launch campaigns, collaborate, and ship production builds from
                one studio.
              </h1>
              <p className="max-w-xl text-lg text-slate-600 dark:text-slate-300">
                Nixora Studio combines a visual builder, content operations, and
                deployment automation so your team can go from concept to live
                experience without context switching.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <NixoraButton className="flex-1 sm:flex-none">
                Create workspace
              </NixoraButton>
              <NixoraButton variant="outline" className="flex-1 sm:flex-none">
                Log in to existing workspace
              </NixoraButton>
            </div>
            <dl className="grid gap-6 sm:grid-cols-3">
              <div>
                <dt className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Teams onboarded
                </dt>
                <dd className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                  120+
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Average launch time
                </dt>
                <dd className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                  48 hrs
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Projects delivered
                </dt>
                <dd className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                  3.5k
                </dd>
              </div>
            </dl>
          </section>
          <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-2xl shadow-emerald-500/10 dark:border-slate-800 dark:bg-slate-900/70">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Workspace quickstart
            </h2>
            <ol className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                  1
                </span>
                Invite your teammates and assign roles for content, design, and
                engineering.
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                  2
                </span>
                Assemble pages with reusable blocks, data sources, and QA
                environments.
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                  3
                </span>
                Publish to the repository or export a production-ready bundle
                for your framework.
              </li>
            </ol>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
              <p className="font-medium">Need a walkthrough?</p>
              <p>
                Book a 30-minute onboarding session with a product specialist.
              </p>
            </div>
          </aside>
        </div>
        <section className="mt-24 grid gap-6 md:grid-cols-3">
          <article className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-xl shadow-emerald-500/10 dark:border-slate-800 dark:bg-slate-900/70">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Visual orchestration
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Drag-and-drop modules, connect APIs, and preview responsive
              layouts before they hit production.
            </p>
          </article>
          <article className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-xl shadow-emerald-500/10 dark:border-slate-800 dark:bg-slate-900/70">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Integrated workflow
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Manage copy reviews, creative approvals, and deployment windows
              with native tasks and automations.
            </p>
          </article>
          <article className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-xl shadow-emerald-500/10 dark:border-slate-800 dark:bg-slate-900/70">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Enterprise ready
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Single sign-on, audit trails, and compliance exports keep your
              governance teams confident.
            </p>
          </article>
        </section>
        <footer className="mt-20 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/70 p-8 text-sm text-slate-600 md:flex-row md:items-center md:justify-between dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
          <div>
            <p className="font-medium text-slate-900 dark:text-slate-100">
              Start building with Nixora Studio today
            </p>
            <p>
              Spin up a workspace in minutes or reconnect with your existing
              production setup.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <NixoraButton>Create workspace</NixoraButton>
            <NixoraButton variant="ghost">Contact sales</NixoraButton>
          </div>
        </footer>
      </div>
    </main>
  );
}
