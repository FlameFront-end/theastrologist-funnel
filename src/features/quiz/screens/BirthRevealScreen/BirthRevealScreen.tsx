import { useEffect } from 'react'
import { CurvedProgress, QuizNavigation } from '../QuizChrome/QuizChrome'
import type { BirthDateValue } from '../../../../domain/quiz'
import styles from './BirthRevealScreen.module.css'

interface BirthRevealScreenProps { birthDate?: BirthDateValue; birthTime?: string; onContinue: () => void; onBack: () => void; progress: number }

export function BirthRevealScreen({ birthDate, birthTime, onContinue, onBack, progress }: BirthRevealScreenProps) {
  useEffect(() => {
    const timer = window.setTimeout(onContinue, 4000)
    return () => window.clearTimeout(timer)
  }, [onContinue])

  const date = birthDate ? `${birthDate.day} ${birthDate.month} ${birthDate.year} г.` : ''

  return (
    <div className={styles.originalSelectScreen}>
      <QuizNavigation onBack={onBack} />
      <div className={styles.originalBirthRevealBody}>
        <div className={styles.originalBirthRevealCopy}>
          <h2>{birthTime ? <>Дата рождения: <span>{date}</span>, время: <span>{birthTime}</span></> : <>Дата рождения: <span>{date}</span></>}</h2>
          <p>Это твоё личное расположение планет — теперь мы можем узнать, что оно значит именно для тебя.</p>
        </div>
        <div className={styles.originalBirthOrbit} aria-hidden="true">
          <img src="/images/quiz/q19-galaxy.webp" alt="" />
          <img src="/images/quiz/q19-orbits.webp" alt="" />
        </div>
      </div>
      <div className={styles.originalLoadingTrack} aria-hidden="true"><span /></div>
      <CurvedProgress progress={progress} />
    </div>
  )
}
