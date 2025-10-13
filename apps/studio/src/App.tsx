import { Button } from "@nixora/ui";

function App() {
  return (
    <main className="flex min-h-screen flex-col gap-12 bg-slate-950 p-12 text-slate-50">
      <section className="max-w-3xl space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">Studio</p>
        <h1 className="text-4xl font-semibold">Nixora Studio Workspace</h1>
        <p className="text-lg text-slate-300">
          A single Vite-powered surface for assembling marketing experiences, managing
          campaigns, and exporting production-ready projects into the shared repository.
        </p>
        <Button variant="primary">Enter Studio</Button>
      </section>
      <section className="grid gap-6 md:grid-cols-2">
        <article className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-emerald-500/10">
          <h2 className="text-xl font-semibold">Page Builder</h2>
          <p className="text-slate-300">
            Drag, drop, and configure reusable blocks. Connect data sources and preview exactly
            what will be compiled into framework-specific projects such as Next.js.
          </p>
        </article>
        <article className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-emerald-500/10">
          <h2 className="text-xl font-semibold">Campaign Operations</h2>
          <p className="text-slate-300">
            Manage variants, publishing windows, and performance insights without leaving the
            Studio. Publish jobs will sync with the NestJS backend and deposit builds in
            <code className="rounded bg-slate-800 px-1.5 py-0.5">/exports</code>.
          </p>
        </article>
      </section>
    </main>
  );
}

export default App;
