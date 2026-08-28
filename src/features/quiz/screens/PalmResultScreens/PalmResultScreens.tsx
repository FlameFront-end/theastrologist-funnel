import { useEffect, useState } from 'react'
import { CurvedProgress, QuizNavigation } from '../QuizChrome/QuizChrome'
import styles from './PalmResultScreens.module.css'

const PHRASES = [
  'Подготавливаем фото ладони…',
  'Размещаем визуальные направляющие…',
  'Находим основные линии ладони…',
  'Отмечаем линию сердца…',
  'Отмечаем линию притяжения…',
  'Анализируем глубину и направление линий…',
  'Отмечаем традиционные знаки отношений…',
]

function PalmVisual({ compact = false }: { compact?: boolean }) {
  return (
    <div className={styles.originalPalmResultVisual} data-compact={compact || undefined}>
      <img src="/images/quizfunnel/palm-correct.png" alt="" aria-hidden="true" />
      <svg viewBox="0 0 345 280" fill="none" aria-hidden="true">
        <path d="M96 118 C 150 96, 214 104, 250 128" stroke="#90d98e" strokeWidth="3" strokeLinecap="round" />
        <path d="M104 150 C 150 138, 196 146, 232 168" stroke="#7f9cf5" strokeWidth="3" strokeLinecap="round" />
        <path d="M110 108 C 128 150, 132 196, 150 236" stroke="#f6c945" strokeWidth="3" strokeLinecap="round" />
        <path d="M198 120 C 206 160, 214 200, 214 240" stroke="#b57be0" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  )
}

interface PalmResultScreenProps { onContinue: () => void; onBack: () => void; progress: number }

export function PalmAnalysingScreen({ onContinue, onBack, progress }: PalmResultScreenProps) {
  const [phrase, setPhrase] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => setPhrase(current => Math.min(current + 1, PHRASES.length - 1)), 1600)
    const timer = window.setTimeout(onContinue, PHRASES.length * 1600)
    return () => { window.clearInterval(interval); window.clearTimeout(timer) }
  }, [onContinue])

  return (
    <div className={styles.originalPalmResultRoot}>
      <div className={styles.originalPalmResultBackground} />
      <div className={styles.originalPalmResultScreen}>
        <QuizNavigation onBack={onBack} />
        <div className={styles.originalPalmAnalysisPhoto}><PalmVisual /></div>
        <div className={styles.originalPalmAnalysisCopy}>
          <img className={styles.originalPalmSpinner} src="/images/quiz/q23-spiral.webp" alt="" aria-hidden="true" />
          <h2 role="status" aria-live="polite">{PHRASES[phrase]}</h2>
        </div>
        <CurvedProgress progress={progress} />
      </div>
    </div>
  )
}

export function PalmRevealScreen({ onContinue, onBack, progress }: PalmResultScreenProps) {
  useEffect(() => {
    const timer = window.setTimeout(onContinue, 4500)
    return () => window.clearTimeout(timer)
  }, [onContinue])

  return (
    <div className={styles.originalPalmResultRoot}>
      <div className={styles.originalPalmResultBackground} />
      <div className={styles.originalPalmResultScreen}>
        <QuizNavigation onBack={onBack} />
        <div className={styles.originalPalmRevealBody}>
          <PalmVisual compact />
          <div className={styles.originalPalmRevealCopy}>
            <h2>Визуализация твоей ладони готова</h2>
            <img className={styles.originalPalmRevealSpinner} src="/images/quiz/q24-spiral.webp" alt="" aria-hidden="true" />
            <p>Теперь мы используем твои предыдущие ответы, чтобы персонализировать путь изучения астрологии. Результаты почти готовы.</p>
          </div>
        </div>
        <CurvedProgress progress={progress} />
      </div>
    </div>
  )
}
