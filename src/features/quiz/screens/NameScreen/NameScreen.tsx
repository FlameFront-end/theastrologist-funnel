import { useState } from 'react'
import { ContinueButton } from '../../../../shared/ui/ContinueButton'
import type { QuizAnswers } from '../../../../domain/quiz'
import { CurvedProgress, QuizNavigation } from '../QuizChrome/QuizChrome'
import styles from './NameScreen.module.css'

interface NameScreenProps { answers: QuizAnswers; onContinue: (name: string) => void; onBack: () => void; progress: number }

export function NameScreen({ answers, onContinue, onBack, progress }: NameScreenProps) {
  const [name, setName] = useState(answers.fullName ?? '')
  return <section className={styles.screen}><QuizNavigation onBack={onBack} /><div className={styles.questionShell}><h1>Как к тебе обращаться?</h1><p>Мы используем твоё имя, чтобы персонализировать разбор.</p><label className={styles.textField}><span>Твоё имя</span><input autoComplete="name" placeholder={answers.gender === 'male' ? 'Например, Иван' : 'Например, Анна'} value={name} onChange={event => setName(event.target.value)} /></label><ContinueButton disabled={name.trim().length < 2} onClick={() => onContinue(name.trim())} /></div><CurvedProgress progress={progress} /></section>
}
