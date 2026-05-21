import { useRef, useState } from 'react'
import type { DragEvent } from 'react'

const MAX_BYTES = 100 * 1024 * 1024 // 100 MB — matches nginx client_max_body_size

interface Props {
  file: File | null
  onChange: (f: File | null) => void
  accept?: string
  label?: string
  variant?: 'cyan' | 'violet' | 'fuchsia'
}

const RING: Record<string, string> = {
  cyan:    'border-cyan-500/50 bg-cyan-500/5',
  violet:  'border-violet-500/50 bg-violet-500/5',
  fuchsia: 'border-fuchsia-500/50 bg-fuchsia-500/5',
}

const DRAG: Record<string, string> = {
  cyan:    'border-cyan-400 bg-cyan-500/8',
  violet:  'border-violet-400 bg-violet-500/8',
  fuchsia: 'border-fuchsia-400 bg-fuchsia-500/8',
}

export default function FileDropzone({
  file,
  onChange,
  accept,
  label = 'Drop file here or click to browse',
  variant = 'cyan',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [sizeError, setSizeError] = useState(false)

  function pick(f: File | undefined) {
    if (!f) return
    if (f.size > MAX_BYTES) { setSizeError(true); return }
    setSizeError(false)
    onChange(f)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    pick(e.dataTransfer.files[0])
  }

  const borderClass = dragging
    ? `border-solid ${DRAG[variant]}`
    : file
      ? `border-solid ${RING[variant]}`
      : 'border-dashed border-zinc-700 bg-transparent hover:border-zinc-500 hover:bg-zinc-800/40'

  return (
    <>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`cursor-pointer rounded-xl border-2 transition-all duration-200 ${borderClass}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={e => pick(e.target.files?.[0])}
          onClick={e => e.stopPropagation()}
        />

        {file ? <FilledState file={file} variant={variant} onRemove={() => { onChange(null); setSizeError(false) }} /> : <EmptyState label={label} dragging={dragging} />}
      </div>
      {sizeError && (
        <p className="mt-1.5 pl-1 text-xs text-red-400">File exceeds the 100 MB limit.</p>
      )}
    </>
  )
}

/* ── Empty state ──────────────────────────────── */
function EmptyState({ label, dragging }: { label: string; dragging: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-8 select-none">
      <div className="relative flex h-12 w-12 items-center justify-center">
        <div className={`absolute inset-0 rounded-full border border-dashed transition-colors duration-200 spin-slow ${dragging ? 'border-cyan-400/60' : 'border-zinc-600'}`} />
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800">
          <UploadIcon className={`h-4 w-4 transition-colors duration-200 ${dragging ? 'text-cyan-400' : 'text-zinc-400'}`} />
        </div>
      </div>
      <div className="text-center">
        <p className={`text-sm font-medium transition-colors duration-200 ${dragging ? 'text-cyan-300' : 'text-zinc-400'}`}>
          {dragging ? 'Release to upload' : label}
        </p>
        <p className="mt-1 text-xs text-zinc-600">All file types supported</p>
      </div>
    </div>
  )
}

/* ── Filled state ─────────────────────────────── */
const ICON_COLORS: Record<string, string> = {
  cyan:    'text-cyan-400 bg-cyan-500/10',
  violet:  'text-violet-400 bg-violet-500/10',
  fuchsia: 'text-fuchsia-400 bg-fuchsia-500/10',
  emerald: 'text-emerald-400 bg-emerald-500/10',
  blue:    'text-blue-400 bg-blue-500/10',
  amber:   'text-amber-400 bg-amber-500/10',
  red:     'text-red-400 bg-red-500/10',
  slate:   'text-zinc-400 bg-zinc-700/60',
}

function FilledState({ file, onRemove }: { file: File; variant?: string; onRemove: () => void }) {
  const { icon, colorKey } = getFileStyle(file)
  const cls = ICON_COLORS[colorKey] ?? ICON_COLORS.slate

  return (
    <div className="flex items-center gap-3.5 px-4 py-4" onClick={e => e.stopPropagation()}>
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] ${cls}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-200">{file.name}</p>
        <p className="mt-0.5 text-xs text-zinc-600">{fmtBytes(file.size)} · {ext(file.name)}</p>
      </div>
      <button
        type="button"
        onClick={e => { e.stopPropagation(); onRemove() }}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-red-500/10 hover:text-red-400"
        title="Remove"
      >
        <XIcon className="h-4 w-4" />
      </button>
    </div>
  )
}

/* ── Helpers ─────────────────────────────────── */
function fmtBytes(b: number) {
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1024 / 1024).toFixed(2)} MB`
}
function ext(name: string) {
  const e = name.split('.').pop()?.toUpperCase()
  return e ? `.${e}` : 'File'
}
function getFileStyle(file: File): { icon: React.ReactElement; colorKey: string } {
  const e = file.name.split('.').pop()?.toLowerCase() ?? ''
  const t = file.type
  if (e === 'vaultx') return { icon: <LockIcon className="h-5 w-5" />, colorKey: 'cyan' }
  if (t.startsWith('image/')) return { icon: <PhotoIcon className="h-5 w-5" />, colorKey: 'emerald' }
  if (t.startsWith('video/')) return { icon: <FilmIcon className="h-5 w-5" />, colorKey: 'blue' }
  if (t.startsWith('audio/')) return { icon: <MusicIcon className="h-5 w-5" />, colorKey: 'violet' }
  if (t === 'application/pdf') return { icon: <DocIcon className="h-5 w-5" />, colorKey: 'red' }
  if (['zip','rar','7z','tar','gz','bz2'].includes(e)) return { icon: <ArchiveIcon className="h-5 w-5" />, colorKey: 'amber' }
  return { icon: <FileIcon className="h-5 w-5" />, colorKey: 'slate' }
}

/* ── Icons ───────────────────────────────────── */
function UploadIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
}
function XIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
}
function LockIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
}
function PhotoIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
}
function FilmIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75.125-.938-.938M5.25 19.5V18.375A1.125 1.125 0 016.375 17.25M5.25 19.5h13.5M18.75 19.5v-1.125c0-.621.504-1.125 1.125-1.125m-1.125 2.25h1.5c.621 0 1.125-.504 1.125-1.125M18.75 18.375V4.875m0 13.5h-13.5m0-13.5h13.5M5.25 4.875A1.125 1.125 0 016.375 3.75h11.25c.621 0 1.125.504 1.125 1.125M5.25 4.875v1.5A1.125 1.125 0 016.375 7.5H17.625c.621 0 1.125-.504 1.125-1.125v-1.5" /></svg>
}
function MusicIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" /></svg>
}
function DocIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
}
function ArchiveIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
}
function FileIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
}
