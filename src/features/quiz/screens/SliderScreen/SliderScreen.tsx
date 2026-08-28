import { useRef, useState } from 'react'
import { CurvedProgress, QuizNavigation } from '../QuizChrome/QuizChrome'
import styles from './SliderScreen.module.css'

const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value))

export function SliderScreen({ question, states, initialValue, onContinue, onBack, progress }) {
  const lastIndex = states.length - 1
  const initialIndex = Math.max(0, states.findIndex(state => state.value === initialValue))
  const [index, setIndex] = useState(initialIndex || Math.floor(lastIndex / 2))
  const trackRef = useRef(null)
  const dragging = useRef(false)
  const state = states[index]
  const percentage = lastIndex > 0 ? index / lastIndex * 100 : 0

  const updateFromPointer = clientX => {
    const bounds = trackRef.current?.getBoundingClientRect()
    if (!bounds) return
    setIndex(clamp(Math.round((clientX - bounds.left) / bounds.width * lastIndex), 0, lastIndex))
  }

  const handleKeyDown = event => {
    const direction = event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? -1 : event.key === 'ArrowRight' || event.key === 'ArrowUp' ? 1 : 0
    if (!direction) return
    event.preventDefault()
    setIndex(current => clamp(current + direction, 0, lastIndex))
  }

  return (
    <div className={styles.screen}>
      <QuizNavigation onBack={onBack} />
      <div className={styles.originalSliderHeading}><h2 id="original-slider-question">{question}</h2></div>
      <div className={styles.originalSliderBody}>
        <div className={styles.originalSliderPicture}>
          {states.map((item, itemIndex) => <img src={item.image} alt="" aria-hidden="true" data-visible={itemIndex === index || undefined} key={item.value} />)}
        </div>
        <div className={styles.originalSliderControls}>
          <div className={styles.originalSliderLabel}><span>{state.label}</span></div>
          <div
            ref={trackRef}
            role="slider"
            tabIndex={0}
            aria-valuemin={0}
            aria-valuemax={lastIndex}
            aria-valuenow={index}
            aria-valuetext={state.label}
            aria-labelledby="original-slider-question"
            className={`${styles.tap} ${styles.originalSliderTrack}`}
            onPointerDown={event => { dragging.current = true; event.currentTarget.setPointerCapture?.(event.pointerId); updateFromPointer(event.clientX) }}
            onPointerMove={event => { if (dragging.current) updateFromPointer(event.clientX) }}
            onPointerUp={() => { dragging.current = false }}
            onKeyDown={handleKeyDown}
          >
            <div className={styles.originalSliderRail} />
            <div className={styles.originalSliderFill} style={{ width: `calc((100% - 40px) * ${percentage / 100})` }} />
            {states.map((item, itemIndex) => <span className={styles.originalSliderDot} data-passed={itemIndex <= index || undefined} style={{ left: `calc(20px + (100% - 40px) * ${itemIndex / lastIndex})` }} key={item.value} />)}
            <span className={styles.originalSliderThumb} style={{ left: `calc(20px + (100% - 40px) * ${percentage / 100})` }} />
          </div>
        </div>
      </div>
      <div className={styles.originalPillAction}><button type="button" onClick={() => onContinue(state.value)}><span>ПРОДОЛЖИТЬ</span><b aria-hidden="true">→</b></button></div>
      <CurvedProgress progress={progress} />
    </div>
  )
}
