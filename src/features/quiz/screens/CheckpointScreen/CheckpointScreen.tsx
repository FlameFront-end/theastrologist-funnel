import type { CSSProperties } from 'react'
import { CurvedProgress, QuizNavigation } from '../QuizChrome/QuizChrome'
import styles from './CheckpointScreen.module.css'

const LABEL_POSITIONS = [
  { left: '1%', top: '3%', rotate: -9, opacity: 0.85, duration: 6, delay: 0 },
  { right: '1%', top: '1%', rotate: 6, opacity: 0.8, duration: 7, delay: 0.6 },
  { left: '2%', top: '17%', rotate: 9, opacity: 0.9, duration: 6.5, delay: 1.1 },
  { right: '2%', top: '20%', rotate: -8, opacity: 0.62, duration: 7.5, delay: 0.3 },
  { left: '2%', top: '64%', rotate: -15, opacity: 0.5, duration: 6.2, delay: 0.9 },
  { right: '1%', top: '62%', rotate: -4, opacity: 0.42, duration: 7.2, delay: 1.4 },
  { left: '4%', top: '80%', rotate: 10, opacity: 0.32, duration: 6.8, delay: 0.5 },
  { right: '5%', top: '82%', rotate: 17, opacity: 0.22, duration: 7.8, delay: 1.2 },
]

export function CheckpointScreen({ title, subtitle, labels, image, onContinue, onBack, progress }) {
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

        <div className={styles.originalCheckpointArt}>
          <img className={styles.originalCheckpointPerson} src={image} alt="" aria-hidden="true" />
          {labels.map((label, index) => {
            const position = LABEL_POSITIONS[index]
            if (!position) return null

            return (
              <div
                className={styles.originalCheckpointLabelPosition}
                style={{
                  top: position.top,
                  left: position.left,
                  right: position.right,
                  '--float-duration': `${position.duration}s`,
                  '--float-delay': `${position.delay}s`,
                } as CSSProperties}
                key={label}
              >
                <div
                  className={styles.originalCheckpointLabel}
                  style={{
                    transform: `rotate(${position.rotate}deg)`,
                    background: `linear-gradient(200deg, rgba(41,35,79,${position.opacity}) 4%, rgba(67,47,125,${position.opacity}) 47%, rgba(40,33,78,${position.opacity}) 95%)`,
                  }}
                >
                  {label}
                </div>
              </div>
            )
          })}
        </div>

        <div className={styles.originalCheckpointAction}>
          <button type="button" onClick={onContinue} className={styles.tap}>
            <span>ПРОДОЛЖИТЬ</span>
            <svg className={styles.originalCheckpointArrow} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M16 7.83333L0.5 7.83333C1.29667 7.83333 2.28667 7.35417 3.10333 6.855C4.1925 6.18917 5.1425 5.31667 5.9375 4.31667C6.55583 3.54167 7.16667 2.61833 7.16667 2M0.5 7.83333C1.29667 7.83333 2.2875 8.3125 3.10333 8.81167C4.1925 9.47833 5.1425 10.3508 5.9375 11.3492C6.55583 12.125 7.16667 13.05 7.16667 13.6667" stroke="#fff" strokeWidth="1.2" />
            </svg>
          </button>
        </div>
        <CurvedProgress progress={progress} />
      </div>
    </div>
  )
}
