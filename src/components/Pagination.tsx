import { ArrowLeft, ArrowRight } from 'lucide-react'

export function Pagination({ page, pages, total, start, end, onChange }: {
  page: number; pages: number; total: number; start: number; end: number; onChange: (page: number) => void
}) {
  const numbers = Array.from(new Set([1, ...Array.from({ length: 5 }, (_, i) => page - 2 + i), pages])).filter(n => n >= 1 && n <= pages).sort((a, b) => a - b)
  const button = 'inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-[#dfe5d7] px-2 text-xs transition hover:bg-[#e8eedf] disabled:opacity-30'
  return <nav aria-label="Stranice proizvoda" className="flex flex-wrap items-center justify-between gap-4 py-5">
    <p aria-live="polite" className="text-xs text-[#7b8970]">Prikaz {start}–{end} od {total} · Stranica {page} od {pages}</p>
    {pages > 1 && <div className="flex flex-wrap items-center gap-1">
      <button type="button" className={button} disabled={page === 1} aria-label="Prethodna stranica" onClick={() => onChange(page - 1)}><ArrowLeft size={15}/></button>
      {numbers.map((n, i) => <span key={n} className="inline-flex items-center gap-1">{i > 0 && n > numbers[i - 1] + 1 && <span className="px-1" aria-hidden="true">…</span>}<button type="button" className={`${button} ${n === page ? 'bg-[#294f41] text-white' : ''}`} aria-label={`Stranica ${n}`} aria-current={n === page ? 'page' : undefined} onClick={() => onChange(n)}>{n}</button></span>)}
      <button type="button" className={button} disabled={page === pages} aria-label="Sljedeća stranica" onClick={() => onChange(page + 1)}><ArrowRight size={15}/></button>
    </div>}
  </nav>
}
