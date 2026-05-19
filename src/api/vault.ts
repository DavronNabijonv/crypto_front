export type EncryptResult = { blob: Blob; filename: string }
export type DecryptResult = { blob: Blob; filename: string; contentType: string }
export type ShareResult = { blob: Blob; filename: string; shareKey: string }

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export async function encryptFile(file: File, deviceId: string): Promise<EncryptResult> {
  const form = new FormData()
  form.append('file', file)
  form.append('device_id', deviceId)

  const res = await fetch('/encrypt', { method: 'POST', body: form })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail ?? 'Encryption failed')
  }

  const blob = await res.blob()
  const filename = file.name + '.vaultx'
  return { blob, filename }
}

export async function decryptFile(file: File, key: string): Promise<DecryptResult> {
  const form = new FormData()
  form.append('file', file)
  form.append('key', key)

  const res = await fetch('/decrypt', { method: 'POST', body: form })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail ?? 'Decryption failed')
  }

  const contentType = res.headers.get('content-type') ?? 'application/octet-stream'
  const disposition = res.headers.get('content-disposition') ?? ''
  const match = disposition.match(/filename="([^"]+)"/)
  const filename = match ? match[1] : file.name.replace(/\.vaultx$/, '')

  const blob = await res.blob()
  return { blob, filename, contentType }
}

export async function shareFile(file: File): Promise<ShareResult> {
  const form = new FormData()
  form.append('file', file)

  const res = await fetch('/share', { method: 'POST', body: form })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail ?? 'Share failed')
  }

  const shareKey = res.headers.get('x-share-key') ?? ''
  const blob = await res.blob()
  const filename = file.name + '.vaultx'
  return { blob, filename, shareKey }
}

export { downloadBlob }


// for