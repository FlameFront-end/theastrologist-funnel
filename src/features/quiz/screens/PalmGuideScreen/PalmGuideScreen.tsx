import { useRef, useState } from 'react'
import { CurvedProgress, QuizNavigation } from '../QuizChrome/QuizChrome'
import styles from './PalmGuideScreen.module.css'

function StatusIcon({ wrong = false, circle = false }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {circle && <circle cx="12" cy="12" r="12" fill={wrong ? '#fa5252' : '#37b24d'} />}
      <path d={wrong ? 'M7 7l10 10M17 7L7 17' : 'M5 12.5l4.2 4.2L19 7'} stroke={circle ? '#fff' : wrong ? '#fa5252' : '#37b24d'} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function HandExample({ image, wrong = false, transform = 'none', large = false }) {
  return (
    <div className={styles.originalHandExample} data-large={large || undefined}>
      <img src={image} alt="" aria-hidden="true" style={{ transform }} />
      {wrong && <span><StatusIcon wrong circle /></span>}
    </div>
  )
}

export function PalmGuideScreen({ onContinue, onBack, progress }) {
  const inputRef = useRef(null)
  const [error, setError] = useState('')

  const handleFile = event => {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    if (!file) return
    if (!file.type.startsWith('image/') || file.size === 0) return setError('Выбери изображение ладони.')
    if (file.size > 15 * 1024 * 1024) return setError('Изображение слишком большое.')
    setError('')
    onContinue(file)
  }

  const tips = [
    ['flat', 'Держи ладонь ровно, повернув её к камере'],
    ['spread', 'Естественно разведи пальцы'],
    ['lighting', 'Убедись, что ладонь хорошо освещена'],
    ['shadows', 'Избегай теней и размытого изображения'],
  ]

  return (
    <div className={styles.originalPalmScreen}>
      <QuizNavigation onBack={onBack} />
      <div className={styles.originalPalmExamples}>
        <h2>Сфотографируй левую ладонь, как показано ниже</h2>
        <div className={styles.originalPalmCorrectCard}>
          <HandExample image="/images/quiz/q21-hand.webp" large />
          <div><StatusIcon circle /><span>Правильно</span></div>
        </div>
        <div className={styles.originalPalmWrongRow}>
          <HandExample image="/images/quiz/q21-hand.webp" wrong transform="scale(1.55) translate(-6%, 6%)" />
          <HandExample image="/images/quiz/q21-hand.webp" wrong transform="rotate(180deg)" />
          <HandExample image="/images/quiz/q21-hand.webp" wrong transform="rotate(-45deg)" />
        </div>
      </div>
      <div className={styles.originalPalmPanel}>
        <div className={styles.originalPalmTips}>
          <strong>Как получить лучший результат</strong>
          {tips.map(([key, label]) => <div key={key}><StatusIcon wrong={key === 'shadows'} /><p>{label}</p></div>)}
        </div>
        <div className={styles.originalPalmActions}>
          <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleFile} />
          <button className={styles.originalPalmUpload} type="button" onClick={() => inputRef.current?.click()}>Загрузить из галереи</button>
          {error && <p role="alert">{error}</p>}
          <button className={styles.originalPalmCamera} type="button" onClick={() => onContinue(null)}><span>СДЕЛАТЬ ФОТО</span><b aria-hidden="true">◎</b></button>
        </div>
      </div>
      <CurvedProgress progress={progress} />
    </div>
  )
}
