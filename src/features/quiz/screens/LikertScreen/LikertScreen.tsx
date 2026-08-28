import { useEffect, useRef, useState } from 'react'
import { CurvedProgress, QuizNavigation } from '../QuizChrome/QuizChrome'
import styles from './LikertScreen.module.css'

export function LikertScreen({ question, statement, points, minLabel, maxLabel, initialValue, onSelect, onBack, progress }) {
  const timer = useRef(null)
  const [selected, setSelected] = useState(initialValue ?? null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const select = value => {
    clearTimeout(timer.current)
    setSelected(value)
    timer.current = setTimeout(() => onSelect(value), 200)
  }

  return (
    <div className={styles.originalSelectScreen}>
      <QuizNavigation onBack={onBack} />
      <div className={styles.originalLikertBody}>
        <div className={styles.originalLikertCopy}>
          <h2 id="original-likert-question">{question}</h2>
          <p>{statement}</p>
        </div>
        <div className={styles.originalLikertControl}>
          <div role="radiogroup" aria-labelledby="original-likert-question" className={styles.originalLikertScale}>
            {points.map(point => {
              const active = selected === point.value
              return <button type="button" role="radio" aria-checked={active} aria-label={String(point.value)} onClick={() => select(point.value)} className={`${styles.tap} ${styles.originalLikertCell}`} data-active={active || undefined} key={point.value}><span aria-hidden="true" data-soft={point.emphasis === 'soft' || undefined}>{point.icon}</span></button>
            })}
          </div>
          <div className={styles.originalLikertLabels}><span>{minLabel}</span><span>{maxLabel}</span></div>
        </div>
      </div>
      <CurvedProgress progress={progress} />
    </div>
  )
}
