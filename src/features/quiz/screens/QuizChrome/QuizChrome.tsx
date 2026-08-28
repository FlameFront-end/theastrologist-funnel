const ARC_PATH = 'M0 60 Q187.5 -12 375 60'
import styles from './QuizChrome.module.css'

const ARC_LENGTHS = (() => {
  const y = value => 60 * ((1 - value) ** 2 + value ** 2) - 24 * value * (1 - value)
  const lengths = [0]

  for (let index = 1; index <= 64; index += 1) {
    lengths.push(
      lengths[index - 1]
        + Math.hypot(5.859375, y(index / 64) - y((index - 1) / 64)),
    )
  }

  return lengths.map(length => length / lengths[64])
})()

const STARS = [
  { x: 40, y: 52, radius: 1.1, opacity: 0.7 },
  { x: 96, y: 64, radius: 0.8, opacity: 0.5 },
  { x: 150, y: 48, radius: 1.3, opacity: 0.8 },
  { x: 205, y: 60, radius: 0.9, opacity: 0.6 },
  { x: 250, y: 50, radius: 1.1, opacity: 0.75 },
  { x: 300, y: 62, radius: 0.8, opacity: 0.5 },
  { x: 338, y: 54, radius: 1.2, opacity: 0.7 },
  { x: 120, y: 58, radius: 0.7, opacity: 0.45 },
  { x: 272, y: 66, radius: 0.7, opacity: 0.5 },
]

export function QuizNavigation({ onBack, backLabel = 'Назад' }) {
  return (
    <nav className={styles.originalQuizNav}>
      <button type="button" onClick={onBack} aria-label={backLabel} className={styles.tap}>
        <svg className={styles.originalQuizBack} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M16 7.83333L0.5 7.83333C1.29667 7.83333 2.28667 7.35417 3.10333 6.855C4.1925 6.18917 5.1425 5.31667 5.9375 4.31667C6.55583 3.54167 7.16667 2.61833 7.16667 2M0.5 7.83333C1.29667 7.83333 2.2875 8.3125 3.10333 8.81167C4.1925 9.47833 5.1425 10.3508 5.9375 11.3492C6.55583 12.125 7.16667 13.05 7.16667 13.6667"
            stroke="#B57DFF"
            strokeWidth="1.2"
          />
        </svg>
      </button>

      <svg width="23" height="34" viewBox="0 0 35 40.1819" fill="none" aria-hidden="true" className={styles.originalQuizLogo}>
        <path d="M12.2063 13.9566L22.8301 13.9566L24.6555 8.77244L29 8.77244L19.9095 34.1819H15.0905L6 8.77243L10.3809 8.77243L12.2063 13.9566ZM13.3746 17.3518L17.5 29.1438L21.6619 17.3518L13.3746 17.3518Z" fill="#B57DFF" />
        <path d="M16.9458 3.03608L14.2135 4.03065C14.1509 4.05344 14.0969 4.09492 14.0587 4.14948C14.0205 4.20403 14 4.26902 14 4.33562C14 4.40221 14.0205 4.4672 14.0587 4.52175C14.0969 4.57631 14.1509 4.61779 14.2135 4.64058L16.9452 5.6345L17.9397 8.36744C17.9625 8.43002 18.004 8.48407 18.0586 8.52226C18.1131 8.56046 18.1781 8.58094 18.2447 8.58094C18.3113 8.58094 18.3763 8.56046 18.4308 8.52226C18.4854 8.48407 18.5269 8.43002 18.5497 8.36744L19.5436 5.63515L22.2765 4.64058C22.3391 4.61779 22.3931 4.57631 22.4313 4.52175C22.4695 4.4672 22.49 4.40221 22.49 4.33562C22.49 4.26902 22.4695 4.20403 22.4313 4.14948C22.3931 4.09492 22.3391 4.05344 22.2765 4.03065L19.5442 3.03673L18.5497 0.304446C18.5269 0.241869 18.4854 0.187817 18.4308 0.149623C18.3763 0.111429 18.3113 0.0909424 18.2447 0.0909424C18.1781 0.0909424 18.1131 0.111429 18.0586 0.149623C18.004 0.187817 17.9625 0.241869 17.9397 0.304446L16.9458 3.03608Z" fill="#B57DFF" />
      </svg>

      <span className={styles.originalQuizNavSpacer} aria-hidden="true" />
    </nav>
  )
}

function progressAtDistance(progress) {
  const position = 0.08 + 0.84 * Math.max(0, Math.min(1, progress)) ** 0.7
  const scaled = 64 * Math.max(0, Math.min(1, position))
  const index = Math.min(63, Math.floor(scaled))
  const distance = ARC_LENGTHS[index] + (ARC_LENGTHS[index + 1] - ARC_LENGTHS[index]) * (scaled - index)

  return { position, distance }
}

export function CurvedProgress({ progress }) {
  const { position, distance } = progressAtDistance(progress)
  const top = (60 * ((1 - position) ** 2 + position ** 2) - 24 * position * (1 - position)) / 72 * 100

  return (
    <div className={styles.originalCurvedProgress}>
      <svg viewBox="0 0 375 72" preserveAspectRatio="none" width="100%" height="100%" aria-hidden="true">
        <defs>
          <linearGradient id="quiz-progress-dome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#241048" />
            <stop offset="1" stopColor="#150a2e" />
          </linearGradient>
          <filter id="quiz-progress-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path d="M0 60 Q187.5 -12 375 60 L375 72 L0 72 Z" fill="url(#quiz-progress-dome)" />
        {STARS.map((star, index) => <circle key={index} cx={star.x} cy={star.y} r={star.radius} fill="#fff" opacity={star.opacity} />)}
        <path d={ARC_PATH} fill="none" stroke="rgba(58,37,102,0.45)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        <path d={ARC_PATH} fill="none" stroke="#b57dff" strokeWidth="2.6" strokeLinecap="round" vectorEffect="non-scaling-stroke" pathLength="100" strokeDasharray="100" strokeDashoffset={100 * (1 - distance)} filter="url(#quiz-progress-glow)" />
      </svg>
      <div className={styles.originalProgressMarker} style={{ left: `${100 * position}%`, top: `${top}%` }}>
        <svg width="17" height="17" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path fillRule="evenodd" clipRule="evenodd" d="M7.34467 1.868C6.1875 1.99173 5.08896 2.44037 4.17601 3.16208C3.26306 3.88379 2.57297 4.84911 2.18548 5.94647C1.79799 7.04383 1.72894 8.22843 1.98628 9.36338C2.24363 10.4983 2.81689 11.5373 3.63979 12.3602C4.4627 13.1831 5.50166 13.7564 6.63661 14.0137C7.77156 14.2711 8.95617 14.202 10.0535 13.8145C11.1509 13.427 12.1162 12.7369 12.8379 11.824C13.5596 10.911 14.0083 9.8125 14.132 8.65533C13.7096 9.19204 13.1782 9.63314 12.5729 9.94954C11.9676 10.2659 11.3022 10.4505 10.6204 10.491C9.93857 10.5314 9.25594 10.427 8.61746 10.1844C7.97898 9.94187 7.39915 9.56675 6.9162 9.0838C6.43324 8.60085 6.05813 8.02102 5.81558 7.38254C5.57303 6.74406 5.46856 6.06142 5.50904 5.37962C5.54953 4.69783 5.73405 4.03235 6.05046 3.42706C6.36686 2.82177 6.80795 2.29041 7.34467 1.868ZM0.833333 8C0.833333 4.042 4.042 0.833333 8 0.833333C8.478 0.833333 8.71666 1.214 8.758 1.51733C8.79733 1.80933 8.68933 2.18067 8.354 2.38333C7.85596 2.68391 7.43287 3.09388 7.11676 3.58221C6.80065 4.07053 6.59983 4.62439 6.5295 5.20183C6.45917 5.77927 6.52118 6.36514 6.71083 6.91506C6.90048 7.46499 7.21281 7.96453 7.62413 8.37586C8.03546 8.78719 8.53501 9.09951 9.08493 9.28916C9.63486 9.47882 10.2207 9.54083 10.7982 9.4705C11.3756 9.40017 11.9295 9.19934 12.4178 8.88324C12.9061 8.56713 13.3161 8.14403 13.6167 7.646C13.8193 7.31066 14.1907 7.20267 14.4827 7.242C14.786 7.28333 15.1667 7.522 15.1667 8C15.1667 11.958 11.958 15.1667 8 15.1667C4.042 15.1667 0.833333 11.958 0.833333 8Z" fill="#fff" />
        </svg>
      </div>
    </div>
  )
}
