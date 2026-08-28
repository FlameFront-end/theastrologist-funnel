import { useEffect, useState } from 'react'
import { QuizNavigation } from '../QuizChrome/QuizChrome'
import type { BirthPlaceValue } from '../../../../domain/quiz'
import styles from './BirthPlaceScreen.module.css'

interface BirthPlaceScreenProps {
  initialValue?: BirthPlaceValue
  onContinue: (value: BirthPlaceValue) => void
  onBack: () => void
}

const FALLBACK_PLACE: BirthPlaceValue = {
  name: 'Moscow, Russia',
  lat: 55.7558,
  lon: 37.6173,
  tz: 'Europe/Moscow',
}

export function BirthPlaceScreen({ initialValue, onContinue, onBack }: BirthPlaceScreenProps) {
  const [value, setValue] = useState(initialValue?.name || '')
  const [selected, setSelected] = useState(initialValue || null)
  const [suggestions, setSuggestions] = useState<BirthPlaceValue[]>([])
  const [searching, setSearching] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    const query = value.trim()
    if (query.length < 2 || selected?.name === query) {
      setSuggestions([])
      setSearching(false)
      setSearched(false)
      return
    }
    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setSearching(true)
      setSearched(false)
      try {
        const response = await fetch(`/api/birth-profile/search-places?q=${encodeURIComponent(query)}`, { signal: controller.signal })
        if (!response.ok) throw new Error(`Place search failed: ${response.status}`)
        const data = await response.json() as { results?: BirthPlaceValue[] }
        setSuggestions(Array.isArray(data.results) ? data.results : [])
        setSearched(true)
      } catch (error) {
        if ((error as DOMException).name !== 'AbortError') {
          console.error('[place-search]', error)
          setSuggestions([])
          setSearched(true)
        }
      } finally {
        if (!controller.signal.aborted) setSearching(false)
      }
    }, 300)
    return () => { window.clearTimeout(timer); controller.abort() }
  }, [value, selected])

  const visible = value.trim().length >= 2 && !selected ? suggestions : []

  return (
    <div className={styles.originalPlaceScreen}>
      <QuizNavigation onBack={onBack} />
      <div className={styles.originalPlaceBody}>
        <h1>Укажи место рождения</h1>
        <p>Место рождения точно показывает, каким было небо в момент твоего рождения. От него зависят Асцендент и астрологические дома.</p>
        <div className={styles.originalPlaceField}>
          <input value={value} onChange={event => { setValue(event.target.value); setSelected(null) }} placeholder="Начни вводить город…" autoComplete="off" />
          {searching && <p className={styles.originalPlaceStatus}>Ищем…</p>}
          {visible.length > 0 && <ul>{visible.map(item => <li key={item.name}><button type="button" onClick={() => { setValue(item.name); setSelected(item) }}><span>{item.name}</span><small>{item.tz} · {item.lat.toFixed(2)}°, {item.lon.toFixed(2)}°</small></button></li>)}</ul>}
          {!searching && searched && !visible.length && !selected && (
            <div className={styles.originalPlaceEmpty}>
              <p className={styles.originalPlaceStatus}>Совпадений нет</p>
              <button type="button" onClick={() => onContinue({ ...FALLBACK_PLACE, name: value.trim() || FALLBACK_PLACE.name })}>Пропустить</button>
            </div>
          )}
          {selected && <div className={styles.originalPlaceSelected}>Выбрано: <strong>{selected.name}</strong> · {selected.tz}</div>}
        </div>
        <div className={styles.originalPlaceSpacer} />
        <button className={styles.originalPlaceContinue} type="button" disabled={!selected} onClick={() => { if (selected) onContinue(selected) }}>ПРОДОЛЖИТЬ</button>
      </div>
    </div>
  )
}
