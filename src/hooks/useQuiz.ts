import { useCallback, useEffect, useState } from 'react'
import type { QuizAnswers, QuizDirection, QuizPatch, QuizState } from '../domain/quiz'

const STORAGE_KEY = 'theastrologist-quiz-state-v1'
const SESSION_KEY = 'theastrologist-demo-session-v1'
export const initialQuizState: QuizState = { step: 0, history: [], answers: {} }

function loadState(): QuizState {
  if (typeof window === 'undefined') return initialQuizState
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null') as Partial<QuizState> | null
    if (typeof parsed?.step === 'number' && Number.isInteger(parsed.step) && parsed.step >= 0 && parsed.step <= 28 && parsed.answers && typeof parsed.answers === 'object') {
      const history = Array.isArray(parsed.history)
        ? parsed.history.filter((item): item is number => Number.isInteger(item) && item >= 0 && item <= 28)
        : []
      const answers = { ...parsed.answers }
      // File objects cannot be restored from JSON. Never keep a misleading empty object.
      if (answers.photo && typeof answers.photo !== 'object') delete answers.photo
      if (answers.photo && typeof answers.photo === 'object' && !('name' in answers.photo && 'size' in answers.photo)) delete answers.photo
      return { ...initialQuizState, ...parsed, answers, history }
    }
  } catch {
    // Ignore malformed or unavailable local storage.
  }
  return initialQuizState
}

export function useQuiz(): QuizState & { direction: QuizDirection; go: (nextStep: number, patch?: QuizPatch) => void; back: () => void; restart: () => void } {
  const [state, setState] = useState(() => loadState())
  const [direction, setDirection] = useState<QuizDirection>('forward')

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { /* storage is optional */ }
  }, [state])

  useEffect(() => {
    if (state.step === 0) return
    try {
      const sessionId = window.sessionStorage.getItem(SESSION_KEY) || crypto.randomUUID()
      window.sessionStorage.setItem(SESSION_KEY, sessionId)
      const { photo: _photo, ...serializableAnswers } = state.answers
      void fetch('/api/session/persist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, currentStepId: `step${state.step}`, answers: serializableAnswers, source: 'quiz' }),
        keepalive: true,
      }).catch(() => undefined)
    } catch { /* server persistence is optional in demo mode */ }
  }, [state])

  const go = useCallback((nextStep: number, patch: QuizPatch = {}) => {
    if (!Number.isInteger(nextStep) || nextStep < 0 || nextStep > 28) return
    setDirection('forward')
    setState(current => ({
      step: nextStep,
      history: [...current.history, current.step],
      answers: { ...current.answers, ...patch },
    }))
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  const back = useCallback(() => {
    setState(current => {
      if (!current.history.length) return current
      setDirection('back')
      return {
        ...current,
        step: current.history.at(-1),
        history: current.history.slice(0, -1),
      }
    })
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  const restart = useCallback(() => {
    setDirection('back')
    setState(initialQuizState)
    try { window.localStorage.removeItem(STORAGE_KEY) } catch { /* storage is optional */ }
  }, [])

  return { ...state, direction, go, back, restart }
}
