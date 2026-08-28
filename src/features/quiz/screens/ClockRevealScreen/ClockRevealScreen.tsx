import { useEffect } from 'react'
import { CurvedProgress, QuizNavigation } from '../QuizChrome/QuizChrome'
import styles from './ClockRevealScreen.module.css'

interface ClockRevealScreenProps {
  onContinue: () => void
  onBack: () => void
  progress: number
}

export function ClockRevealScreen({ onContinue, onBack, progress }: ClockRevealScreenProps) {
  useEffect(() => {
    const timer = window.setTimeout(onContinue, 4000)
    return () => window.clearTimeout(timer)
  }, [onContinue])

  return (
    <section className={styles.root}>
      <div className={styles.background} aria-hidden="true"><div /><img src="/images/quiz/checkpoint-bg.webp" alt="" /><span /></div>
      <div className={styles.screen}>
        <QuizNavigation onBack={onBack} />
        <div className={styles.body}>
          <div className={styles.copy}>
            <h2>Ничего страшного.</h2>
            <p>Даже одной даты рождения достаточно, чтобы составить большую часть твоей натальной карты. Когда узнаешь время рождения, его можно будет добавить в приложении Astrologist.</p>
          </div>
          <div className={styles.clock} aria-hidden="true">
            <img src="/images/quiz/q18-clock-base.webp" alt="" />
            <img src="/images/quiz/q18-clock-ring.webp" alt="" />
          </div>
        </div>
        <div className={styles.loading}><span /></div>
        <CurvedProgress progress={progress} />
      </div>
    </section>
  )
}
