import { useEffect, useState } from 'react'
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

function ActionButton({ children, onClick, disabled = false }) {
  return <button type="button" className={styles.originalFinalAction} onClick={onClick} disabled={disabled}>{children}</button>
}

export function ExpertScreen({ onContinue, onBack }) {
  return (
    <div className={styles.originalFinalScreen}>
      <QuizNavigation onBack={onBack} />
      <div className={styles.originalExpertBody}>
        <div className={styles.originalExpertCard}>
          <img className={styles.originalExpertHero} src="/images/quiz/q24b-main.webp" alt="" />
          <div className={styles.originalExpertPerson}><img src="/images/quiz/q24b-expert.webp" alt="Sophie Novak" /><div><span>✓ Проверено экспертом</span><strong>Sophie Novak</strong><small>Специалист по астрологии</small></div></div>
        </div>
        <h1>Наша программа создана вместе со <span>специалистами по астрологии</span></h1>
        <p>В основе системы - метод астрологических архетипов, который помогает проще понять натальные карты, планеты, дома, Асцендент, транзиты и связи между ними.</p>
      </div>
      <div className={styles.originalFinalActionWrap}><ActionButton onClick={onContinue}>ПРОДОЛЖИТЬ</ActionButton></div>
      <CurvedProgress progress={24 / 28} />
    </div>
  )
}

export function SocialWallScreen({ onContinue, onBack }) {
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

export function EmailScreen({ onContinue, onBack }) {
  const [email, setEmail] = useState('')
  const valid = /^\S+@\S+\.\S+$/.test(email)
  return (
    <div className={`${styles.originalFinalScreen} ${styles.originalEmailScreen}`}>
      <QuizNavigation onBack={onBack} />
      <div className={styles.originalEmailBody}><div className={styles.originalEmailOrbit}>✦<span>✉</span></div><h1>Куда отправить твой персональный результат?</h1><p>Укажи email, чтобы сохранить результаты и получить доступ к персональной программе.</p><label><span>Email</span><input type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@email.com" /></label><small>🔒 Мы не отправляем спам и не передаём данные третьим лицам</small></div>
      <div className={styles.originalFinalActionWrap}><ActionButton disabled={!valid} onClick={() => onContinue(email)}>ПОЛУЧИТЬ РЕЗУЛЬТАТ</ActionButton></div>
      <CurvedProgress progress={26 / 28} />
    </div>
  )
}

export function AnalysisScreen({ onContinue, onBack }) {
  const [percent, setPercent] = useState(3)
  useEffect(() => { const interval = window.setInterval(() => setPercent(value => Math.min(100, value + 2)), 180); const timer = window.setTimeout(onContinue, 9000); return () => { window.clearInterval(interval); window.clearTimeout(timer) } }, [onContinue])
  return <div className={styles.originalAnalysisScreen}><QuizNavigation onBack={onBack} /><div className={styles.originalAnalysisBody}><div className={styles.originalAnalysisArt}><img src="/images/quiz/q24-spiral.webp" alt="" /><img src="/images/quiz/q25-orbit.webp" alt="" /><img src="/images/quiz/q25-question.webp" alt="" /></div><h1>Создаём твой путь в астрологии</h1><strong>{percent}%</strong><div className={styles.originalAnalysisProgress}><span style={{ width: `${percent}%` }} /></div><ul><li className={percent > 20 ? styles.done : ''}>Анализируем твои сильные стороны</li><li className={percent > 48 ? styles.done : ''}>Определяем стиль восприятия людей</li><li className={percent > 76 ? styles.done : ''}>Собираем персональный путь обучения</li></ul></div></div>
}

export function TrialScreen({ onContinue, onBack }) {
  const [tier, setTier] = useState('trial4')
  const tiers = [['trial1', '3 дня', '99 ₽'], ['trial2', '7 дней', '199 ₽'], ['trial3', '14 дней', '299 ₽'], ['trial4', '28 дней', '499 ₽']]
  return <div className={styles.originalTrialScreen}><QuizNavigation onBack={onBack} /><div className={styles.originalTrialBody}><p>THEASTROLOGIST</p><h1>Начни персональный путь в астрологии</h1><div className={styles.originalTrialDivider} /><div className={styles.originalTrialCopy}><span>ТВОЯ ПРОГРАММА ГОТОВА</span><p>Полный доступ к урокам, натальной карте и ежедневным рекомендациям.</p></div><div className={styles.originalTrialTiers}>{tiers.map(([value, label, price]) => <button type="button" className={tier === value ? styles.active : ''} onClick={() => setTier(value)} key={value}>{label}<strong>{price}</strong></button>)}</div><p className={styles.originalTrialNote}>После пробного периода подписка продлевается автоматически. Отменить можно в любой момент.</p></div><div className={styles.originalFinalActionWrap}><ActionButton onClick={() => onContinue(tier)}>ПРОДОЛЖИТЬ&nbsp; →</ActionButton></div></div>
}
