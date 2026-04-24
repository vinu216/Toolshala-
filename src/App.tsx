export default function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-6">
      <section className="w-full max-w-2xl rounded-3xl border border-indigo-100 bg-white/90 p-8 shadow-xl shadow-indigo-100 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-700">ToolShala</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Multi-page website is ready</h1>
        <p className="mt-4 text-slate-600">AI Tools, Career Help, Opportunities and Templates for students, freshers and creators.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white" href="/index.html">
            Open Homepage
          </a>
          <a className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700" href="/tools.html">
            Browse Tools
          </a>
        </div>
      </section>
    </main>
  );
}
