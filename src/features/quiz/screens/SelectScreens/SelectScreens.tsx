import { useEffect, useRef, useState } from 'react'
import { CurvedProgress, QuizNavigation } from '../QuizChrome/QuizChrome'
import styles from './SelectScreens.module.css'

const INK = '#0e0f23'
const ACCENT = '#7f4cf2'

export interface SelectOption { value: string; label: string; icon?: string; image?: string }
export interface SelectStep { stepId: string; question: string; subtitle?: string; options: SelectOption[] }
interface SelectScreenProps { step: SelectStep; selectedValue?: string; onSelect: (option: SelectOption) => void; onBack: () => void; progress: number }

function useDelayedSelection(stepId: string, options: SelectOption[], onSelect: (option: SelectOption) => void) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [selection, setSelection] = useState<string | null>(null)

  useEffect(() => {
    setSelection(null)
  }, [stepId])

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  const select = (value: string) => {
    const option = options.find(item => item.value === value)
    if (!option) return

    if (timer.current) clearTimeout(timer.current)
    setSelection(value)
    timer.current = setTimeout(() => onSelect(option), 200)
  }

  return [selection, select] as const
}

export function PictureSelectScreen({ step, selectedValue, onSelect, onBack, progress }: SelectScreenProps) {
  const [pendingValue, select] = useDelayedSelection(step.stepId, step.options, onSelect)

  return (
    <div className={styles.screen}>
      <QuizNavigation onBack={onBack} />
      <div className={styles.originalPictureContent}>
        <h2 id={`step-${step.stepId}`}>{step.question}</h2>
        <div className={styles.originalPictureGrid} role="radiogroup" aria-labelledby={`step-${step.stepId}`}>
          {step.options.map(option => {
            const active = pendingValue !== null ? pendingValue === option.value : selectedValue === option.value

            return (
              <button
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => select(option.value)}
                className={`${styles.tap} ${styles.originalPictureOption}`}
                data-active={active || undefined}
                key={option.value}
              >
                <img src={option.image ?? ''} alt="" aria-hidden="true" />
                <span className={styles.originalPictureShade} />
                <span className={styles.originalPictureLabel}>{option.label}</span>
              </button>
            )
          })}
        </div>
      </div>
      <CurvedProgress progress={progress} />
    </div>
  )
}

function TextSelectArrow({ color }: { color: string }) {
  return (
    <svg className={styles.originalTextArrow} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M16 7.83333L0.5 7.83333C1.29667 7.83333 2.28667 7.35417 3.10333 6.855C4.1925 6.18917 5.1425 5.31667 5.9375 4.31667C6.55583 3.54167 7.16667 2.61833 7.16667 2M0.5 7.83333C1.29667 7.83333 2.2875 8.3125 3.10333 8.81167C4.1925 9.47833 5.1425 10.3508 5.9375 11.3492C6.55583 12.125 7.16667 13.05 7.16667 13.6667" stroke={color} strokeWidth="1.2" />
    </svg>
  )
}

export function TextSelectScreen({ step, selectedValue, onSelect, onBack, progress }: SelectScreenProps) {
  const [pendingValue, select] = useDelayedSelection(step.stepId, step.options, onSelect)

  return (
    <div className={styles.screen}>
      <QuizNavigation onBack={onBack} />
      <div className={styles.originalTextContent}>
        <div className={styles.originalQuestionCopy}>
          <h2 id={`step-${step.stepId}`}>{step.question}</h2>
          {step.subtitle && <p>{step.subtitle}</p>}
        </div>
        <div className={styles.originalTextOptions} role="radiogroup" aria-labelledby={`step-${step.stepId}`}>
          {step.options.map(option => {
            const active = pendingValue !== null ? pendingValue === option.value : selectedValue === option.value

            return (
              <button
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => select(option.value)}
                className={`${styles.tap} ${styles.originalTextOption}`}
                data-active={active || undefined}
                key={option.value}
              >
                <span className={styles.originalTextOptionCopy}>
                  {option.icon && <span className={styles.originalTextIcon} aria-hidden="true">{option.icon}</span>}
                  <span className={styles.originalTextLabel}>{option.label}</span>
                </span>
                <TextSelectArrow color={active ? '#fff' : ACCENT} />
              </button>
            )
          })}
        </div>
      </div>
      <CurvedProgress progress={progress} />
    </div>
  )
}

export function ChipSelectScreen({ step, selectedValue, onSelect, onBack, progress }: SelectScreenProps) {
  const [pendingValue, select] = useDelayedSelection(step.stepId, step.options, onSelect)

  return (
    <div className={styles.screen}>
      <QuizNavigation onBack={onBack} />
      <div className={styles.originalChipContent}>
        <div className={styles.originalChipCopy}>
          <h2 id={`step-${step.stepId}`}>{step.question}</h2>
          {step.subtitle && <p>{step.subtitle}</p>}
        </div>
        <div className={styles.originalChipOptions} role="radiogroup" aria-labelledby={`step-${step.stepId}`}>
          {step.options.map(option => {
            const active = pendingValue !== null ? pendingValue === option.value : selectedValue === option.value
            return <button type="button" role="radio" aria-checked={active} onClick={() => select(option.value)} className={styles.originalChipOption} data-active={active || undefined} key={option.value}>{option.icon && <span className={styles.originalChipIcon} aria-hidden="true">{option.icon}</span>}<span className={styles.originalChipLabel}>{option.label}</span></button>
          })}
        </div>
      </div>
      <CurvedProgress progress={progress} />
    </div>
  )
}

export { INK }
