import { useEffect } from 'react'

export default function HowItWorksModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-zinc-950/75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/80 animate-guide-in">

        {/* ── Header ── */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-700 bg-gradient-to-br from-cyan-500/10 to-violet-500/10">
              <BookIcon className="h-3.5 w-3.5 text-zinc-300" />
            </div>
            <span className="text-sm font-semibold text-zinc-100">How it works</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-600 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="max-h-[65vh] space-y-3.5 overflow-y-auto p-5">

          <Section
            color="cyan"
            emoji="🔒"
            title="Encrypt a file"
            subtitle="Lock any file with your personal Device ID"
            steps={[
              'Drop any file into the upload zone',
              'Enter a Device ID — this is your secret key, pick something you will remember',
              'Hit Encrypt & Download — you receive a .vaultx file ready to store safely',
            ]}
          />

          <Section
            color="violet"
            emoji="🔓"
            title="Decrypt a file"
            subtitle="Restore any .vaultx file back to the original"
            steps={[
              'Drop the .vaultx file into the upload zone',
              'Select the key type: Device ID for files you encrypted, Share Key for files sent to you',
              'Enter the matching key and click Decrypt & Download',
            ]}
          />

          <Section
            color="fuchsia"
            emoji="🔑"
            title="Share a file securely"
            subtitle="Send encrypted files without sharing your Device ID"
            steps={[
              'Drop the file you want to send to someone',
              'Click Encrypt & Get Share Key — a random 256-bit key is created for this file only',
              'Copy and save the Share Key immediately — it is shown once and never stored',
              'Send the .vaultx file to the recipient along with the Share Key',
            ]}
          />

          {/* Zero-knowledge note */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3">
            <p className="text-[11px] leading-relaxed text-zinc-500">
              <span className="font-medium text-zinc-400">Nothing is ever stored.</span>{' '}
              Files are processed in isolated server memory and deleted the moment the response is
              sent. Your keys exist only in your browser session.
            </p>
          </div>

        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between border-t border-zinc-800 px-5 py-4">
          <span className="text-[11px] text-zinc-600">
            Press{' '}
            <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1 py-0.5 font-mono text-[10px] text-zinc-500">
              Esc
            </kbd>{' '}
            to close
          </span>
          <button
            onClick={onClose}
            className="rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-cyan-900/20 transition-all hover:from-cyan-500 hover:to-violet-500 active:scale-[0.97]"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Section block ────────────────────────────── */
const ACCENT = {
  cyan:    'border-cyan-500/25 bg-cyan-500/5',
  violet:  'border-violet-500/25 bg-violet-500/5',
  fuchsia: 'border-fuchsia-500/25 bg-fuchsia-500/5',
}
const BADGE = {
  cyan:    'bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-500/25',
  violet:  'bg-violet-500/15 text-violet-400 ring-1 ring-violet-500/25',
  fuchsia: 'bg-fuchsia-500/15 text-fuchsia-400 ring-1 ring-fuchsia-500/25',
}
const TITLE_CLS = {
  cyan:    'text-cyan-300',
  violet:  'text-violet-300',
  fuchsia: 'text-fuchsia-300',
}

function Section({
  color, emoji, title, subtitle, steps,
}: {
  color: 'cyan' | 'violet' | 'fuchsia'
  emoji: string
  title: string
  subtitle: string
  steps: string[]
}) {
  return (
    <div className={`rounded-xl border p-4 ${ACCENT[color]}`}>
      <div className="mb-3 flex items-center gap-2.5">
        <span className="text-lg leading-none">{emoji}</span>
        <div>
          <p className={`text-sm font-semibold ${TITLE_CLS[color]}`}>{title}</p>
          <p className="mt-0.5 text-[11px] text-zinc-500">{subtitle}</p>
        </div>
      </div>
      <ol className="space-y-2.5">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span
              className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${BADGE[color]}`}
            >
              {i + 1}
            </span>
            <span className="text-xs leading-relaxed text-zinc-400">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

/* ── Icons ────────────────────────────────────── */
function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  )
}
function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
