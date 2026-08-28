import { useEffect } from 'react'
import { CurvedProgress, QuizNavigation } from '../QuizChrome/QuizChrome'
import styles from './SymbolCheckpointScreen.module.css'

interface SymbolCheckpointScreenProps { title: string; subtitle: string; image: string; symbols: string[]; onContinue: () => void; onBack: () => void; progress: number }

export function SymbolCheckpointScreen({ title, subtitle, image, symbols, onContinue, onBack, progress }: SymbolCheckpointScreenProps) {
  useEffect(() => {
    const timer = window.setTimeout(onContinue, 4000)
    return () => window.clearTimeout(timer)
  }, [onContinue])

  return (
    <div className={styles.root}>
      <div className={styles.originalCheckpointBackground} aria-hidden="true">
        <div />
        <img src="/images/quiz/checkpoint-bg.webp" alt="" />
        <span />
      </div>

      <div className={styles.originalCheckpointScreen}>
        <QuizNavigation onBack={onBack} />
        <div className={styles.originalCheckpointCopy}>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <div className={styles.originalSymbolArt}>
          <img className={styles.originalCheckpointPerson} src={image} alt="" aria-hidden="true" />
          <div className={styles.originalSymbolWindow} aria-hidden="true">
            <div className={styles.originalSymbolTrack}>
              {[...symbols, ...symbols].map((symbol, index) => (
                <div className={styles.originalSymbolCard} key={`${symbol}-${index}`}>
                  <img src={symbol} alt="" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.originalLoadingTrack} aria-hidden="true"><span /></div>
        <CurvedProgress progress={progress} />
      </div>
    </div>
  )
}
