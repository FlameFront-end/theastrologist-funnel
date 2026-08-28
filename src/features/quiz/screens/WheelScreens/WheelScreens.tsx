import { useEffect, useRef, useState } from 'react'
import { CurvedProgress, QuizNavigation } from '../QuizChrome/QuizChrome'
import type { BirthDateValue } from '../../../../domain/quiz'
import styles from './WheelScreens.module.css'

const clamp = (value: number, minimum: number, maximum: number) => Math.max(minimum, Math.min(maximum, value))
const ZODIAC_ICONS = ['aries', 'taurus', 'gemini', 'cancer', 'libra'].map(icon => `/images/quiz/q15-zo-${icon}.webp`)

interface WheelColumnProps { items: string[]; index: number; onChange: (index: number) => void; onTouch: () => void; touched: boolean; placeholder: string; width: number | string; radius: string; ariaLabel: string }

function WheelColumn({ items, index, onChange, onTouch, touched, placeholder, width, radius, ariaLabel }: WheelColumnProps) {
  const scroller = useRef<HTMLDivElement>(null)
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const frame = useRef<number | null>(null)
  const [visibleIndex, setVisibleIndex] = useState(index)

  useEffect(() => {
    if (!scroller.current) return
    scroller.current.scrollTop = 40 * index
    setVisibleIndex(index)
  }, [index])

  useEffect(() => () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current)
    if (settleTimer.current) clearTimeout(settleTimer.current)
  }, [])

  const handleScroll = () => {
    const element = scroller.current
    if (!element) return
    if (frame.current !== null) cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => setVisibleIndex(clamp(Math.round(element.scrollTop / 40), 0, items.length - 1)))
    if (settleTimer.current) clearTimeout(settleTimer.current)
    settleTimer.current = setTimeout(() => {
      const nextIndex = clamp(Math.round(element.scrollTop / 40), 0, items.length - 1)
      onChange(nextIndex)
      if (Math.abs(element.scrollTop - 40 * nextIndex) > 1) element.scrollTo({ top: 40 * nextIndex, behavior: 'smooth' })
    }, 140)
  }

  const touch = () => { if (!touched) onTouch() }

  return (
    <div className={styles.originalWheelColumn} style={{ width, borderRadius: radius }}>
      <div className={styles.originalWheelHighlight} aria-hidden="true" />
      <div
        ref={scroller}
        className={styles.originalWheelScroll}
        role="listbox"
        aria-label={ariaLabel}
        tabIndex={0}
        onScroll={handleScroll}
        onPointerDown={touch}
        onWheel={touch}
        onTouchStart={touch}
        onKeyDown={event => {
          if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return
          event.preventDefault()
          touch()
          const nextIndex = clamp(visibleIndex + (event.key === 'ArrowDown' ? 1 : -1), 0, items.length - 1)
          scroller.current?.scrollTo({ top: 40 * nextIndex, behavior: 'smooth' })
        }}
      >
        {items.map((item, itemIndex) => {
          const active = itemIndex === visibleIndex
          return <div role="option" aria-selected={active} data-active={active || undefined} data-far={Math.abs(itemIndex - visibleIndex) >= 2 || undefined} onClick={() => { touch(); scroller.current?.scrollTo({ top: 40 * itemIndex, behavior: 'smooth' }) }} key={`${item}-${itemIndex}`}>{active && !touched ? placeholder : item}</div>
        })}
      </div>
    </div>
  )
}

function WheelAction({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return <div className={styles.originalWheelAction}><button type="button" disabled={disabled} onClick={onClick}><span>ПРОДОЛЖИТЬ</span><b aria-hidden="true">→</b></button></div>
}

interface DateWheelScreenProps { question: string; subtitle?: string; initialValue?: BirthDateValue; onContinue: (value: BirthDateValue) => void; onBack: () => void; progress: number }

export function DateWheelScreen({ question, subtitle, initialValue, onContinue, onBack, progress }: DateWheelScreenProps) {
  const now = new Date()
  const currentYear = now.getFullYear()
  const years = Array.from({ length: currentYear - 1919 }, (_, index) => 1920 + index)
  const months = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']
  const initialYear = Number(initialValue?.year) || 2000
  const [yearIndex, setYearIndex] = useState(clamp(years.indexOf(initialYear), 0, years.length - 1))
  const savedMonthIndex = months.indexOf(initialValue?.month ?? '')
  const [monthIndex, setMonthIndex] = useState(savedMonthIndex >= 0 ? savedMonthIndex : 5)
  const daysInMonth = new Date(years[yearIndex], monthIndex + 1, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, index) => String(index + 1).padStart(2, '0'))
  const [dayIndex, setDayIndex] = useState(clamp((Number(initialValue?.day) || 15) - 1, 0, days.length - 1))
  const [touched, setTouched] = useState({ day: Boolean(initialValue), month: Boolean(initialValue), year: Boolean(initialValue) })
  const ready = touched.day && touched.month && touched.year

  useEffect(() => setDayIndex(current => clamp(current, 0, days.length - 1)), [days.length])

  return (
    <div className={styles.screen}>
      <QuizNavigation onBack={onBack} />
      <div className={styles.originalDateBody}>
        <div className={styles.originalDateIntro}><div className={styles.originalWheelCopy}><h2>{question}</h2>{subtitle && <p>{subtitle}</p>}</div><div className={styles.originalZodiacIcons} aria-hidden="true">{ZODIAC_ICONS.map((icon, index) => <div key={icon} data-lowered={index % 2 === 1 || undefined}><img src={icon} alt="" /></div>)}</div></div>
        <div className={styles.originalDateColumns}>
          <WheelColumn items={days} index={dayIndex} onChange={setDayIndex} onTouch={() => setTouched(value => ({ ...value, day: true }))} touched={touched.day} placeholder="День" width={83} radius="8px 0 0 8px" ariaLabel="День" />
          <WheelColumn items={months} index={monthIndex} onChange={setMonthIndex} onTouch={() => setTouched(value => ({ ...value, month: true }))} touched={touched.month} placeholder="Месяц" width={169} radius="0" ariaLabel="Месяц" />
          <WheelColumn items={years.map(String)} index={yearIndex} onChange={setYearIndex} onTouch={() => setTouched(value => ({ ...value, year: true }))} touched={touched.year} placeholder="Год" width={83} radius="0 8px 8px 0" ariaLabel="Год" />
        </div>
      </div>
      <WheelAction disabled={!ready} onClick={() => onContinue({ day: dayIndex + 1, month: months[monthIndex], year: years[yearIndex] })} />
      <CurvedProgress progress={progress} />
    </div>
  )
}

interface TimeWheelScreenProps { question: string; subtitle?: string; initialValue?: string; onContinue: (value: string) => void; onBack: () => void; progress: number }

export function TimeWheelScreen({ question, subtitle, initialValue, onContinue, onBack, progress }: TimeWheelScreenProps) {
  const match = typeof initialValue === 'string' ? initialValue.match(/^(\d{2}):(\d{2})$/) : null
  const hours = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, '0'))
  const minutes = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0'))
  const [hour, setHour] = useState(match ? Number(match[1]) : 12)
  const [minute, setMinute] = useState(match ? Number(match[2]) : 30)
  const [touched, setTouched] = useState({ hour: Boolean(match), minute: Boolean(match) })
  const ready = touched.hour && touched.minute

  return (
    <div className={styles.screen}>
      <QuizNavigation onBack={onBack} />
      <div className={styles.originalTimeBody}>
        <div className={styles.originalWheelCopy}><h2>{question}</h2>{subtitle && <p>{subtitle}</p>}</div>
        <div className={styles.originalTimeColumns}>
          <WheelColumn items={hours} index={hour} onChange={setHour} onTouch={() => setTouched(value => ({ ...value, hour: true }))} touched={touched.hour} placeholder="Час" width={160} radius="8px 0 0 8px" ariaLabel="Час" />
          <WheelColumn items={minutes} index={minute} onChange={setMinute} onTouch={() => setTouched(value => ({ ...value, minute: true }))} touched={touched.minute} placeholder="Минута" width={160} radius="0 8px 8px 0" ariaLabel="Минута" />
        </div>
      </div>
      <WheelAction disabled={!ready} onClick={() => onContinue(`${hours[hour]}:${minutes[minute]}`)} />
      <CurvedProgress progress={progress} />
    </div>
  )
}
