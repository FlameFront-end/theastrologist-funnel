import { useEffect, type CSSProperties } from 'react'
import { CurvedProgress, QuizNavigation } from '../QuizChrome/QuizChrome'
import styles from './IconCheckpointScreen.module.css'

const POSITIONS = [
  { left: '2%', top: '4%', rotate: -4 }, { left: '39%', top: '0%', rotate: 5 }, { right: '2%', top: '14%', rotate: -3 },
  { left: '2%', top: '30%', rotate: 6 }, { right: '2%', top: '46%', rotate: 4 }, { left: '2%', top: '49%', rotate: -5 },
  { left: '5%', bottom: '2%', rotate: -4 }, { right: '4%', bottom: '3%', rotate: 13 },
]
const ICON_POSITIONS = [
  { left: '2%', top: '5%', size: 58 }, { right: '5%', top: '1%', size: 54 }, { left: '-2%', top: '25%', size: 60 }, { right: '-2%', top: '29%', size: 56 },
  { left: '0%', top: '57%', size: 58 }, { right: '1%', top: '60%', size: 54 }, { left: '11%', top: '82%', size: 56 }, { right: '12%', top: '84%', size: 60 },
]
const CONCEPT_LABELS = ['Лунный знак', 'Транзиты', 'Дома', 'Асцендент', 'Солнечный знак', 'Планеты', 'Колесо натальной карты', 'Аспекты']

interface IconCheckpointScreenProps { title: string; subtitle: string; image: string; icons: string[]; concepts?: boolean; onContinue: () => void; onBack: () => void; progress: number }

export function IconCheckpointScreen({ title, subtitle, image, icons, concepts = false, onContinue, onBack, progress }: IconCheckpointScreenProps) {
  useEffect(() => {
    if (concepts) return undefined
    const timer = window.setTimeout(onContinue, 5500)
    return () => window.clearTimeout(timer)
  }, [onContinue, concepts])

  return (
    <div className={styles.originalCheckpointRoot}>
      <div className={styles.originalCheckpointBackground} aria-hidden="true"><div /><img src="/images/quiz/checkpoint-bg.webp" alt="" /><span /></div>
      <div className={styles.originalCheckpointScreen}>
        <QuizNavigation onBack={onBack} />
        <div className={styles.originalCheckpointCopy}><h2>{title}</h2><p>{subtitle}</p></div>
        <div className={styles.originalIconCheckpointArt}>
          <img className={`${styles.originalIconCheckpointCenter} ${concepts ? '' : styles.originalIconsCenter}`} src={image} alt="" aria-hidden="true" />
          {icons.map((icon, index) => {
            const position = concepts ? POSITIONS[index % POSITIONS.length] : ICON_POSITIONS[index % ICON_POSITIONS.length]
            const rotate = 'rotate' in position ? position.rotate : 0
            const size = 'size' in position ? position.size : undefined
            return <div className={styles.originalIconCheckpointPosition} style={{ ...position, '--icon-rotate': `${rotate}deg`, '--icon-delay': `${index * .15}s` } as CSSProperties} key={icon}>{concepts ? <div className={styles.originalConceptPill}><span>{CONCEPT_LABELS[index]}</span><img src={icon} alt="" aria-hidden="true" /></div> : <img src={icon} alt="" aria-hidden="true" style={{ width: size, height: size }} />}</div>
          })}
        </div>
        {concepts ? <div className={styles.originalConceptAction}><button type="button" onClick={onContinue}><span>Продолжить</span><svg className={styles.originalConceptArrow} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M16 7.83333L0.5 7.83333C1.29667 7.83333 2.28667 7.35417 3.10333 6.855C4.1925 6.18917 5.1425 5.31667 5.9375 4.31667C6.55583 3.54167 7.16667 2.61833 7.16667 2M0.5 7.83333C1.29667 7.83333 2.2875 8.3125 3.10333 8.81167C4.1925 9.47833 5.1425 10.3508 5.9375 11.3492C6.55583 12.125 7.16667 13.05 7.16667 13.6667" stroke="#fff" strokeWidth="1.2" /></svg></button></div> : <div className={styles.originalLoadingTrack} aria-hidden="true"><span /></div>}
        <CurvedProgress progress={progress} />
      </div>
    </div>
  )
}
