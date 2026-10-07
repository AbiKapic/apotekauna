import { useEffect, useState, type FormEvent, type ReactNode } from "react"
import type { Session } from "@supabase/supabase-js"
import { Link } from "react-router"
import { supabase } from "../lib/supabase"

export function AdminAccess({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)
  const [allowed, setAllowed] = useState(false)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next); setReady(true); setAllowed(false); setError("")
    })
    return () => subscription.unsubscribe()
  }, [])
  useEffect(() => {
    if (!session) return
    let active = true
    setChecking(true)
    supabase.from("admin_users").select("user_id").eq("user_id", session.user.id).maybeSingle()
      .then(({ data, error: failure }) => {
        if (!active) return
        setAllowed(Boolean(data) && !failure)
        setError(failure ? "Provjerite da je Supabase SQL postavka izvršena." : data ? "" : "Ovaj račun nema administratorski pristup.")
        setChecking(false)
      })
    return () => { active = false }
  }, [session])
  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("")
    const form = new FormData(event.currentTarget)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: String(form.get("email")).trim(), password: String(form.get("password")) })
      if (error) setError("Prijava nije uspjela. Provjerite e-mail i lozinku.")
    } catch { setError("Veza nije dostupna. Pokušajte ponovo.") }
    finally { setBusy(false) }
  }
  async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) setError("Odjava nije uspjela. Pokušajte ponovo.")
  }
  if (!ready || checking || (session && !allowed && !error)) return <div className="p-8">Provjera pristupa…</div>
  if (session && allowed) return <><div className="flex items-center justify-end gap-4 border-b border-border bg-white px-6 py-3 text-xs"><span>{session.user.email}</span><button onClick={logout} className="rounded-lg border border-border px-4 py-2">Odjavi se</button>{error && <span role="alert">{error}</span>}</div>{children}</>
  return <main className="grid min-h-screen place-items-center px-6"><section className="w-full max-w-md rounded-2xl border border-border bg-white p-8"><p className="mb-2 text-xs text-[#789575]">APOTEKA UNA</p><h1 className="mb-6 text-2xl font-medium">Administratorska prijava</h1>{session ? <button onClick={logout} className="rounded-lg border border-border px-4 py-3">Odjavi se</button> : <form onSubmit={login} className="space-y-5"><label className="block text-sm">E-mail<input name="email" type="email" autoComplete="username" required className="mt-2 w-full rounded-lg border border-border p-3" /></label><label className="block text-sm">Lozinka<input name="password" type="password" autoComplete="current-password" required className="mt-2 w-full rounded-lg border border-border p-3" /></label><button disabled={busy} className="w-full rounded-lg bg-[#294f41] p-3 text-white disabled:opacity-50">{busy ? "Prijava…" : "Prijavi se"}</button></form>}{error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}<Link to="/" className="mt-6 block text-sm">← Povratak na stranicu</Link></section></main>
}
