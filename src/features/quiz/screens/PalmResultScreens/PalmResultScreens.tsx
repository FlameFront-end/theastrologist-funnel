import { useEffect, useState } from 'react'
import { CurvedProgress, QuizNavigation } from '../QuizChrome/QuizChrome'
import styles from './PalmResultScreens.module.css'

const PHRASES = [
  'Подготавливаем фото ладони…',
  'Размещаем визуальные направляющие…',
  'Находим основные линии ладони…',
  'Отмечаем линию сердца…',
  'Анализируем глубину и направление линий…',
]

function PalmVisual({ compact = false }) {
  return (
    <div className={styles.originalPalmResultVisual} data-compact={compact || undefined}>
      <img src="/images/quiz/q21-hand.webp" alt="" aria-hidden="true" />
      <svg viewBox="0 0 240 300" fill="none" aria-hidden="true">
        <path d="M76 86C94 118 102 158 98 209M106 79C128 117 141 156 144 207M62 137C99 150 137 148 179 129M67 174C105 183 137 178 168 155" stroke="#d8a7ff" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </div>
  )
}

export function PalmAnalysingScreen({ onContinue, onBack, progress }) {
  const [phrase, setPhrase] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => setPhrase(current => Math.min(current + 1, PHRASES.length - 1)), 650)
    const timer = window.setTimeout(onContinue, PHRASES.length * 650 + 700)
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

export function PalmRevealScreen({ onContinue, onBack, progress }) {
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
