import { useState } from 'react'
import FileDropzone from './FileDropzone'
import { shareFile, downloadBlob } from '../api/vault'

export default function ShareTab() {
  const [file, setFile]       = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [shareKey, setShareKey] = useState<string | null>(null)
  const [copied, setCopied]   = useState(false)
  const [revealed, setRevealed] = useState(false)

  async function submit() {
    if (!file) return
    setLoading(true); setError(null); setShareKey(null); setRevealed(false)
    try {
      const { blob, filename, shareKey: k } = await shareFile(file)
      downloadBlob(blob, filename)
      setShareKey(k)
      setFile(null)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Share failed')
    } finally {
      setLoading(false)
    }
  }

  async function copyKey() {
    if (!shareKey) return
    await navigator.clipboard.writeText(shareKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  /* Break key into 8-char groups for readability */
  const fmtKey = shareKey?.match(/.{1,8}/g)?.join(' ') ?? shareKey

  return (
    <div className="space-y-4">

      {/* Info banner */}
      <div className="flex gap-2.5 rounded-xl border border-zinc-800 bg-zinc-800/40 px-4 py-3">
        <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-fuchsia-500/60" />
        <p className="text-xs leading-relaxed text-zinc-500">
          Generates a random <span className="text-fuchsia-400 font-medium">256-bit key</span> server-side
          and returns it to you once. Nothing is ever stored — treat this key like a password.
        </p>
      </div>

      <FileDropzone file={file} onChange={setFile} variant="fuchsia" label="Drop the file you want to share" />

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-400">
          <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />{error}
        </div>
      )}

      {/* Share key result */}
      {shareKey && (
        <div className="rounded-xl border border-fuchsia-500/20 bg-fuchsia-500/5 p-4 space-y-3">

          {/* Header row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-fuchsia-500/15">
                <KeyIcon className="h-4 w-4 text-fuchsia-400" />
              </div>
              <span className="text-sm font-semibold text-fuchsia-300">Share Key Generated</span>
            </div>
            <span className="rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-2 py-0.5 font-mono text-[10px] text-fuchsia-400/80">256-bit</span>
          </div>

          {/* Key box */}
          <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
            {!revealed && (
              <div
                className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center rounded-xl bg-zinc-950/80 backdrop-blur-[3px] hover:bg-zinc-950/60 transition-colors"
                onClick={() => setRevealed(true)}
              >
                <span className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-400">
                  <EyeIcon className="h-3.5 w-3.5" />Click to reveal
                </span>
              </div>
            )}
            <p className="select-all break-all p-3.5 font-mono text-[11px] leading-7 tracking-widest text-fuchsia-300/90">
              {fmtKey}
            </p>
          </div>

          {/* Action row */}
          <div className="flex items-center gap-2">
            <button
              onClick={copyKey}
              className={`flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-medium transition-all duration-200 ${
                copied
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : 'border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-300 hover:bg-fuchsia-500/15'
              }`}
            >
              {copied ? <CheckIcon className="h-3.5 w-3.5" /> : <CopyIcon className="h-3.5 w-3.5" />}
              {copied ? 'Copied!' : 'Copy key'}
            </button>
            <button
              onClick={() => setRevealed(v => !v)}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-800/60 px-3.5 py-2 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-300"
            >
              {revealed ? <EyeOffIcon className="h-3.5 w-3.5" /> : <EyeIcon className="h-3.5 w-3.5" />}
              {revealed ? 'Hide' : 'Reveal'}
            </button>
          </div>

          <p className="border-t border-zinc-800/60 pt-3 text-[11px] leading-relaxed text-zinc-600">
            ⚠️ This key is shown <span className="text-zinc-500">once</span> and cannot be recovered. Save it before closing.
          </p>
        </div>
      )}

      <button
        onClick={submit}
        disabled={!file || loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-fuchsia-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-900/30 transition-all hover:from-fuchsia-500 hover:to-fuchsia-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? <><Spinner />Encrypting for sharing…</> : <><ShareIcon className="h-4 w-4" />Encrypt &amp; Get Share Key</>}
      </button>
    </div>
  )
}

function Spinner() {
  return <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/><path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
}
function InfoIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/></svg>
}
function KeyIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"/></svg>
}
function EyeIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
}
function EyeOffIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>
}
function CopyIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"/></svg>
}
function CheckIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
}
function AlertIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>
}
function ShareIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"/></svg>
}
