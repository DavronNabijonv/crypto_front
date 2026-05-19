import { useState } from 'react'
import FileDropzone from './FileDropzone'
import { decryptFile, downloadBlob } from '../api/vault'

type KeyType = 'device' | 'share'

export default function DecryptTab() {
  const [file, setFile]       = useState<File | null>(null)
  const [key, setKey]         = useState('')
  const [kt, setKt]           = useState<KeyType>('device')
  const [show, setShow]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  function switchType(t: KeyType) {
    setKt(t); setKey(''); setError(null); setSuccess(null)
  }

  async function submit() {
    if (!file || !key.trim()) return
    setLoading(true); setError(null); setSuccess(null)
    try {
      const { blob, filename, contentType } = await decryptFile(file, key.trim())
      downloadBlob(blob, filename)
      setSuccess(`${filename} · ${contentType}`)
      setFile(null); setKey('')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Decryption failed')
    } finally {
      setLoading(false)
    }
  }

  const isDevice = kt === 'device'

  return (
    <div className="space-y-4">

      {/* Info banner */}
      <div className="flex gap-2.5 rounded-xl border border-zinc-800 bg-zinc-800/40 px-4 py-3">
        <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-violet-500/60" />
        <p className="text-xs leading-relaxed text-zinc-500">
          Accepts <span className="text-cyan-400 font-medium">device-locked</span> and{' '}
          <span className="text-fuchsia-400 font-medium">share-key</span> files. The format is
          auto-detected — choose the key type that matches how the file was encrypted.
        </p>
      </div>

      <FileDropzone file={file} onChange={setFile} accept=".vaultx" variant="violet" label="Drop your .vaultx file here" />

      {/* Key type selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Key Type</label>
        <div className="flex gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950/70 p-1.5">
          {(['device', 'share'] as KeyType[]).map(t => (
            <button
              key={t}
              onClick={() => switchType(t)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-medium transition-all duration-200 ${
                kt === t
                  ? t === 'device'
                    ? 'bg-zinc-800 text-cyan-300 ring-1 ring-zinc-700 shadow-sm'
                    : 'bg-zinc-800 text-fuchsia-300 ring-1 ring-zinc-700 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40'
              }`}
            >
              {t === 'device'
                ? <><DeviceIcon className="h-3.5 w-3.5" />Device ID</>
                : <><KeyIcon className="h-3.5 w-3.5" />Share Key</>}
            </button>
          ))}
        </div>
      </div>

      {/* Key input */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          {isDevice ? 'Device ID' : 'Share Key (hex)'}{' '}
          <span className="text-red-500 normal-case tracking-normal font-normal">*</span>
        </label>
        <div className="relative">
          <input
            key={kt}
            type={isDevice && !show ? 'password' : 'text'}
            value={key}
            onChange={e => setKey(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder={isDevice ? 'Your device identifier' : '64-character hex share key…'}
            className={`w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 transition-all focus:outline-none focus:ring-2 ${
              isDevice
                ? 'pr-12 focus:border-cyan-500/60 focus:ring-cyan-500/20'
                : 'font-mono text-xs focus:border-fuchsia-500/60 focus:ring-fuchsia-500/20'
            }`}
            autoComplete="off"
            spellCheck={false}
          />
          {isDevice && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShow(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-zinc-600 transition-colors hover:text-zinc-300"
            >
              {show ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Feedback */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-400">
          <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />{error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-4 py-3 text-sm text-emerald-400">
          <CheckIcon className="h-4 w-4 shrink-0" />
          <span className="font-mono text-[11px] text-emerald-300 truncate">{success}</span>
        </div>
      )}

      <button
        onClick={submit}
        disabled={!file || !key.trim() || loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition-all hover:from-violet-500 hover:to-violet-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? <><Spinner />Decrypting…</> : <><UnlockIcon className="h-4 w-4" />Decrypt &amp; Download</>}
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
function DeviceIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"/></svg>
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
function CheckIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
}
function AlertIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>
}
function UnlockIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>
}
