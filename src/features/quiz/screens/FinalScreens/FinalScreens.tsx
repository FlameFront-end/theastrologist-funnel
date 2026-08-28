import { useEffect, useState, type ReactNode } from 'react'
import { CurvedProgress, QuizNavigation } from '../QuizChrome/QuizChrome'
import styles from './FinalScreens.module.css'

const CHIPS = [
  'Наконец-то всё сложилось', 'Спасибо, очень помогло', 'Точность удивила', 'Пока всё отлично',
  'Стал(а) лучше понимать себя', 'Узнал(а) очень много', 'Это открыло мне глаза', 'Совпадает до мелочей',
  'Снова появилась надежда', 'Правда глубоко', 'Рекомендую всем', 'Стоит каждой минуты',
  'Наконец есть направление', 'Читаю каждый вечер', 'Объяснило мои привычки', 'Не ожидал(а) такой точности',
  'Помогло принять решение', 'Всё объяснено просто', 'Нашёл(ла) настоящие ответы', 'Лучше понимаю близких',
  'Затянуло с первого дня', 'Понятнее, чем ожидал(а)', 'Стало утренним ритуалом', 'Наконец понял(а) асцендент',
]

interface BaseScreenProps { onBack: () => void }
interface ContinueScreenProps extends BaseScreenProps { onContinue: () => void }
interface EmailPayload { email: string; consentGivenAt: string; consentVersion: string; marketingConsent: boolean }
interface EmailScreenProps extends BaseScreenProps { onContinue: (payload: EmailPayload) => void }
type AnalysisAnswer = 'yes' | 'no'
type AnalysisResponses = Record<string, AnalysisAnswer>
interface AnalysisScreenProps extends BaseScreenProps { onContinue: (responses: AnalysisResponses) => void }
interface TrialScreenProps extends BaseScreenProps { onContinue: (tier: string) => void }

function ActionButton({ children, onClick, disabled = false }: { children: ReactNode; onClick: () => void; disabled?: boolean }) {
  return <button type="button" className={styles.originalFinalAction} onClick={onClick} disabled={disabled}>{children}</button>
}

export function ExpertScreen({ onContinue, onBack }: ContinueScreenProps) {
  return (
    <div className={styles.originalFinalScreen}>
      <QuizNavigation onBack={onBack} />
      <div className={styles.originalExpertBody}>
        <div className={styles.originalExpertCard}>
          <img className={styles.originalExpertHero} src="/images/quiz/q24b-main.webp" alt="" />
          <div className={styles.originalExpertPerson}><img src="/images/quiz/q24b-expert.webp" alt="Sophie Novak" /><div><span>✓ Проверено экспертом</span><strong>Sophie Novak</strong><small>Специалист по астрологии</small></div></div>
        </div>
        <h1>Наша программа создана вместе со <span>специалистами по астрологии</span> и превращает их опыт в понятный, практичный и легко применимый путь обучения.</h1>
        <p>В основе системы - метод астрологических архетипов, который помогает проще понять натальные карты, планеты, дома, Асцендент, транзиты и связи между ними.</p>
      </div>
      <div className={styles.originalFinalActionWrap}><ActionButton onClick={onContinue}>ПРОДОЛЖИТЬ</ActionButton></div>
      <CurvedProgress progress={24 / 28} />
    </div>
  )
}

export function SocialWallScreen({ onContinue, onBack }: ContinueScreenProps) {
  const rows = Array.from({ length: 4 }, (_, row) => CHIPS.filter((_, index) => index % 4 === row))
  return (
    <div className={styles.originalFinalScreen}>
      <QuizNavigation onBack={onBack} />
      <div className={styles.originalSocialBody}>
        <div className={styles.originalSocialRows} aria-hidden="true">
          {rows.map((row, rowIndex) => <div className={styles.originalSocialRow} key={rowIndex}><div className={styles.originalSocialTrack} style={{ animationDirection: rowIndex % 2 ? 'reverse' : 'normal', animationDuration: `${28 + rowIndex * 6}s` }}>{[...row, ...row].map((chip, index) => <span className={styles.originalSocialChip} key={`${chip}-${index}`}><img src={`/images/quiz/wall-avatar-${(rowIndex * 4 + index % 4) % 24}.webp`} alt="" /><span>{chip}</span></span>)}</div></div>)}
        </div>
        <div className={styles.originalSocialCopy}><h1>Присоединяйся к <span>250 000+</span> людей</h1><p>Присоединяйся к людям со всего мира, которые учатся читать свою натальную карту и яснее видеть себя.</p></div>
      </div>
      <div className={styles.originalFinalActionWrap}><ActionButton onClick={onContinue}>ПРОДОЛЖИТЬ</ActionButton></div>
      <CurvedProgress progress={25 / 28} />
    </div>
  )
}

export function EmailScreen({ onContinue, onBack }: EmailScreenProps) {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(true)
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const valid = /^\S+@\S+\.\S+$/.test(email)
  const submit = () => {
    setSubmitted(true)
    if (!valid || !consent) return
    onContinue({ email: email.trim(), consentGivenAt: new Date().toISOString(), consentVersion: '1.0', marketingConsent })
  }
  return (
    <div className={`${styles.originalFinalScreen} ${styles.originalEmailScreen}`}>
      <QuizNavigation onBack={onBack} />
      <div className={styles.originalEmailBody}><div className={styles.originalEmailOrbit}>✦<span>✉</span></div><h1>На какую почту отправить твой персональный анализ?</h1><label className={styles.originalEmailField}><span>Адрес электронной почты</span><input type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="name@example.ru" autoComplete="email" aria-invalid={submitted && !valid} /></label>{submitted && !valid && <p className={styles.originalEmailError} role="alert">Введи корректный адрес электронной почты</p>}<label className={styles.originalConsent}><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} /><span>Даю согласие на обработку адреса электронной почты для сохранения результатов и отправки информации об аккаунте. Подробнее - в политике конфиденциальности.</span></label><label className={styles.originalConsent}><input type="checkbox" checked={marketingConsent} onChange={event => setMarketingConsent(event.target.checked)} /><span>Хочу иногда получать новости и астрологические материалы (необязательно).</span></label><small>🔒 Данные зашифрованы · требования GDPR соблюдены</small></div>
      <div className={styles.originalFinalActionWrap}><ActionButton disabled={!consent} onClick={submit}>ПОЛУЧИТЬ АНАЛИЗ</ActionButton></div>
      <CurvedProgress progress={26 / 28} />
    </div>
  )
}

const ANALYSIS_PHRASES = [
  'Обобщаем твои ответы о сильных сторонах в чтении натальных карт…',
  'Обобщаем твои ответы о том, как ты понимаешь людей…',
  'Просматриваем твои ответы об интуиции и закономерностях…',
  'Подтверждаем, что визуализация ладони завершена…',
  'Определяем, как тебе удобнее изучать астрологию…',
  'Обобщаем твои ответы об интересе к изучению астрологии…',
  'Составляем твой личный путь к чтению натальных карт…',
  'Готовим твой персональный астрологический профиль…',
]

const ANALYSIS_QUESTIONS = [
  { trigger: 20, key: 'readerPatterns', text: 'Замечаешь ли ты закономерности в жизни людей?' },
  { trigger: 48, key: 'readerSense', text: 'Умеешь ли ты считывать эмоции человека?' },
  { trigger: 76, key: 'readerOpenUp', text: 'Часто ли люди неожиданно откровенничают с тобой?' },
]

export function AnalysisScreen({ onContinue, onBack }: AnalysisScreenProps) {
  const [percent, setPercent] = useState(0)
  const [questionIndex, setQuestionIndex] = useState<number | null>(null)
  const [answered, setAnswered] = useState<number[]>([])
  const [responses, setResponses] = useState<AnalysisResponses>({})
  useEffect(() => {
    if (questionIndex !== null) return
    const interval = window.setInterval(() => setPercent(value => Math.min(100, value + 1)), 120)
    return () => window.clearInterval(interval)
  }, [questionIndex])
  useEffect(() => {
    const nextQuestion = ANALYSIS_QUESTIONS.findIndex((question, index) => percent >= question.trigger && !answered.includes(index))
    if (nextQuestion >= 0) setQuestionIndex(nextQuestion)
    else if (percent >= 100) onContinue(responses)
  }, [answered, onContinue, percent, responses])
  const answer = (value: AnalysisAnswer) => {
    if (questionIndex === null) return
    const question = ANALYSIS_QUESTIONS[questionIndex]
    setResponses(current => ({ ...current, [question.key]: value }))
    setAnswered(current => [...current, questionIndex])
    setQuestionIndex(null)
  }
  const phrase = ANALYSIS_PHRASES[Math.min(ANALYSIS_PHRASES.length - 1, Math.floor(percent / (100 / ANALYSIS_PHRASES.length)))]
  return <div className={styles.originalAnalysisScreen}><QuizNavigation onBack={onBack} /><div className={styles.originalAnalysisBody}><div className={styles.originalAnalysisArt}><img src="/images/quiz/q24-spiral.webp" alt="" /><img src="/images/quiz/q25-orbit.webp" alt="" /><img src="/images/quiz/q25-question.webp" alt="" /></div><h1>Создаём твой путь в астрологии</h1><strong>{percent}%</strong><div className={styles.originalAnalysisProgress}><span style={{ width: `${percent}%` }} /></div><p className={styles.originalAnalysisPhrase} role="status" aria-live="polite">{phrase}</p>{questionIndex !== null && <div className={styles.originalAnalysisQuestion}><h2>{ANALYSIS_QUESTIONS[questionIndex].text}</h2><div><button type="button" onClick={() => answer('yes')}>Да</button><button type="button" onClick={() => answer('no')}>Нет</button></div></div>}</div></div>
}

export function TrialScreen({ onContinue, onBack }: TrialScreenProps) {
  const [tier, setTier] = useState('trial4')
  const tiers = [['trial1', '5,00 €'], ['trial2', '9,00 €'], ['trial3', '13,00 €'], ['trial4', '17,67 €']] as const
  const referencePrice = tiers.at(-1)?.[1] ?? ''
  return <div className={styles.originalTrialScreen}><QuizNavigation onBack={onBack} /><div className={styles.originalTrialBody}><p>THEASTROLOGIST</p><h1>Выбери стоимость пробного периода</h1><div className={styles.originalTrialDivider} /><div className={styles.originalTrialCopy}><span>ДЛЯ НАС ВАЖЕН ТВОЙ ОПЫТ</span><p>Мы помогли <strong>тысячам людей яснее понять себя</strong> через персональную астрологию и хотим сделать то же самое для тебя.</p></div><div className={styles.originalTrialCopy}><span>НАШ ПРИОРИТЕТ - СДЕЛАТЬ ЭТО ДОСТУПНЫМ ДЛЯ КАЖДОГО</span><p>Хотя подготовка каждой интерпретации на самом деле обходится нам в {referencePrice}*, мы предлагаем выбрать сумму, которая тебе подходит.</p></div><div className={styles.originalTrialTiers}>{tiers.map(([value, label]) => <button type="button" className={tier === value ? styles.active : ''} aria-pressed={tier === value} onClick={() => setTier(value)} key={value}>{label}</button>)}</div><p className={styles.originalTrialNote}>Выбор {referencePrice} помогает нам поддерживать людей, которым нужно выбрать самую низкую цену пробного периода.</p></div><div className={styles.originalFinalActionWrap}><ActionButton onClick={() => onContinue(tier)}>ПОСМОТРЕТЬ МОЙ АНАЛИЗ&nbsp; →</ActionButton></div></div>
}
