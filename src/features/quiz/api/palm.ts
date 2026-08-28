interface PalmUploadResponse {
  path: string
}

export async function uploadPalmPhoto(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('sessionId', window.sessionStorage.getItem('theastrologist-demo-session-v1') ?? crypto.randomUUID())
  const response = await fetch('/api/quiz/upload-palm', { method: 'POST', body: formData })
  if (!response.ok) throw new Error(`Palm upload failed: ${response.status}`)
  const data = await response.json() as Partial<PalmUploadResponse>
  if (!data.path) throw new Error('Palm upload response is missing path')
  return data.path
}
