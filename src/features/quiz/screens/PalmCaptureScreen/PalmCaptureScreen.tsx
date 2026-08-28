import { useEffect, useRef, useState } from 'react'
import styles from './PalmCaptureScreen.module.css'

interface PalmCaptureScreenProps {
  onCapture: (file: File) => Promise<void>
  onSkip: () => void
  onBack: () => void
}

export function PalmCaptureScreen({ onCapture, onSkip, onBack }: PalmCaptureScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [error, setError] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    void navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      .then(stream => {
        if (cancelled) return stream.getTracks().forEach(track => track.stop())
        streamRef.current = stream
        if (videoRef.current) videoRef.current.srcObject = stream
      })
      .catch(() => setError(true))
    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach(track => track.stop())
    }
  }, [])

  const capture = async () => {
    const video = videoRef.current
    if (!video?.videoWidth || !video.videoHeight) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', .9))
    if (!blob) return setError(true)
    setSaving(true)
    try {
      await onCapture(new File([blob], 'palm-photo.jpg', { type: 'image/jpeg' }))
    } catch {
      setError(true)
      setSaving(false)
    }
  }

  return (
    <div className={styles.screen}>
      <button className={styles.close} type="button" onClick={onBack} aria-label="Отмена">×</button>
      {!error && <video ref={videoRef} autoPlay muted playsInline />}
      <div className={styles.guide} aria-hidden="true"><span /></div>
      <div className={styles.copy}>
        <strong>{error ? 'Нет доступа к камере' : 'Помести левую ладонь в рамку и разведи пальцы.'}</strong>
        {error && <p>Разреши доступ к камере в настройках браузера, затем обнови страницу и попробуй снова. Этот шаг также можно пропустить.</p>}
      </div>
      {!error && <button className={styles.capture} type="button" disabled={saving} onClick={capture} aria-label="Сфотографировать"><span /></button>}
      <button className={styles.skip} type="button" onClick={onSkip}>Пропустить</button>
    </div>
  )
}
