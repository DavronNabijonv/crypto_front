import { useState } from 'react'
import EncryptTab from './components/EncryptTab'
import DecryptTab from './components/DecryptTab'
import ShareTab from './components/ShareTab'

type Tab = 'encrypt' | 'decrypt' | 'share'

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: 'encrypt', label: 'Encrypt', emoji: '🔒' },
  { id: 'decrypt', label: 'Decrypt', emoji: '🔓' },
  { id: 'share',   label: 'Share',   emoji: '🔑' },
]

const TAB_ACTIVE: Record<Tab, string> = {
  encrypt: 'bg-zinc-800 text-cyan-300 shadow-sm ring-1 ring-zinc-700',
  decrypt: 'bg-zinc-800 text-violet-300 shadow-sm ring-1 ring-zinc-700',
  share:   'bg-zinc-800 text-fuchsia-300 shadow-sm ring-1 ring-zinc-700',
}

const CHIPS = [ 'Zero-storage', 'Share keys']

export default function App() {
  const [tab, setTab] = useState<Tab>('encrypt')

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Subtle radial glow — inline style, no positioning bugs */}
      <div
        className="min-h-screen"
        style={{
          background:
            'radial-gradient(ellipse 80% 40% at 10% 10%, rgba(34,211,238,0.07) 0%, transparent 60%),' +
            'radial-gradient(ellipse 70% 50% at 90% 90%, rgba(139,92,246,0.08) 0%, transparent 60%),' +
            '#09090b',
        }}
      >
        {/* ── Centred column ───────────────────────── */}
        <div className="mx-auto w-full max-w-lg px-4 py-10 sm:py-14">

          {/* Header */}
          <header className="anim-0 mb-10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-cyan-500 to-violet-600 shadow-lg shadow-cyan-900/40">
                <LockIcon className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold tracking-tight text-zinc-100">VaultX</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-500">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                Zero-storage
              </span>
              <span className="rounded border border-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-600">
                v3.0
              </span>
            </div>
          </header>

          {/* Hero */}
          <div className="anim-1 mb-8 text-center">
            <h1 className="mb-3 text-4xl font-black tracking-tight sm:text-5xl">
              <span className="text-zinc-100">Secure</span>{' '}
              <span className="grad-text">File Vault</span>
            </h1>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {CHIPS.map(c => (
                <span
                  key={c}
                  className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-[11px] text-zinc-500"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* ── Main card ────────────────────────────── */}
          <div className="anim-2 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/60">

            {/* Tab nav */}
            <div className="flex gap-1 border-b border-zinc-800 bg-zinc-950/60 p-1.5">
              {TABS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-medium transition-all duration-200 ${
                    tab === t.id
                      ? TAB_ACTIVE[t.id]
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40'
                  }`}
                >
                  <span className="text-base leading-none">{t.emoji}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* Tab content — key triggers re-mount fade */}
            <div key={tab} className="anim-0 p-5 sm:p-6">
              {tab === 'encrypt' && <EncryptTab />}
              {tab === 'decrypt' && <DecryptTab />}
              {tab === 'share'   && <ShareTab />}
            </div>
          </div>

          {/* Security note */}
          <div className="anim-3 mt-4 flex items-start gap-3 rounded-xl border border-zinc-800/60 bg-zinc-900/50 px-4 py-3.5">
            <ShieldIcon className="mt-0.5 h-4 w-4 shrink-0 text-zinc-600" />
            <p className="text-xs leading-relaxed text-zinc-600">
              <span className="font-medium text-zinc-400">Zero-knowledge</span> — Keys are
              computed in-memory per request and never logged. Files are processed in isolated
              temp directories deleted after each response.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
    </svg>
  )
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}
