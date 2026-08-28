import { useEffect, useState, type CSSProperties } from 'react'
import styles from './StartScreen.module.css'

const ASSET_ROOT = '/assets/'
const CONSTELLATION_MAIN = [
  { x: 120, y: 110, r: 2.6 }, { x: 185, y: 128, r: 2.2 }, { x: 240, y: 148, r: 4, focal: true }, { x: 285, y: 172, r: 2.2 },
  { x: 395, y: 205, r: 2.4 }, { x: 470, y: 222, r: 2 }, { x: 530, y: 232, r: 2.2 }, { x: 610, y: 228, r: 2 },
  { x: 685, y: 205, r: 2.4 }, { x: 745, y: 172, r: 2.2 }, { x: 790, y: 135, r: 2 }, { x: 818, y: 95, r: 3.6, focal: true }, { x: 852, y: 108, r: 2.6 },
]
const CONSTELLATION_BRANCHES = [
  [{ x: 105, y: 55, r: 2.8 }, CONSTELLATION_MAIN[0]],
  [{ x: 60, y: 70, r: 2.4 }, CONSTELLATION_MAIN[0]],
  CONSTELLATION_MAIN,
]

function constellationPath(points: Array<{ x: number; y: number }>) {
  let path = `M${points[0].x} ${points[0].y}`
  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[index - 1] ?? points[index]
    const current = points[index]
    const next = points[index + 1]
    const after = points[index + 2] ?? next
    path += ` C${(current.x + (next.x - previous.x) * .04).toFixed(1)} ${(current.y + (next.y - previous.y) * .04).toFixed(1)} ${(next.x - (after.x - current.x) * .04).toFixed(1)} ${(next.y - (after.y - current.y) * .04).toFixed(1)} ${next.x} ${next.y}`
  }
  return path
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return reduced
}
const STARS = Array.from({ length: 46 }, (_, index) => {
  const shine = index % 7 === 0
  return {
    top: (17.73 * index) % 100,
    left: (39.31 * index + (index % 3) * 7) % 100,
    size: shine ? 2.4 : .8 + ((7 * index) % 3) * .5,
    shine,
    delay: `${(index % 9 * .5).toFixed(2)}s`,
    duration: `${(3.2 + index % 5 * .8).toFixed(2)}s`,
    opacity: shine ? .9 : .22 + index % 5 * .1,
  }
})

interface StartScreenProps {
  onPick: (gender: 'female' | 'male') => void
}

function StarIcon() {
  return <svg width="15" height="17" viewBox="0 0 17 20" fill="none" aria-hidden="true"><path d="M8.50027 14.3917L12.0278 16.4833C12.6738 16.8667 13.4643 16.3 13.2943 15.5833L12.3593 11.65L15.4788 9.00001C16.0483 8.51668 15.7423 7.60001 14.9943 7.54168L10.8888 7.20001L9.28227 3.48334C8.99327 2.80834 8.00727 2.80834 7.71827 3.48334L6.11177 7.19168L2.00627 7.53334C1.25827 7.59168 0.952269 8.50834 1.52177 8.99168L4.64127 11.6417L3.70627 15.575C3.53627 16.2917 4.32677 16.8583 4.97277 16.475L8.50027 14.3917Z" fill="#f1cf7c" /></svg>
}

function AccuracyIcon() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 11.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0-6.5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 1a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0-4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 1a7 7 0 1 1 0 14 7 7 0 0 1 0-14Z" fill="#c9b1ff" /></svg>
}

function ClockIcon() {
  return <svg width="15" height="15" viewBox="0 0 15.0607 14.75" fill="none" aria-hidden="true"><path d="M11.5303.6667l3 3m-14 0 3-3M1.5303 8a6 6 0 1 0 12 0 6 6 0 0 0-12 0Z" stroke="rgba(245,242,255,.7)" strokeWidth="1.5" /><path d="M7.5303 4.6667V8h2.3334M7.5303 2V0" stroke="rgba(245,242,255,.7)" strokeWidth="1.5" /></svg>
}

function DownArrowIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M16 7.8333H.5c.7967 0 1.7867-.4791 2.6033-.9783 1.0892-.6658 2.0392-1.5383 2.8342-2.5383C6.5558 3.5417 7.1667 2.6183 7.1667 2M.5 7.8333c.7967 0 1.7875.4792 2.6033.9784 1.0892.6666 2.0392 1.5391 2.8342 2.5375.6183.7758 1.2292 1.7008 1.2292 2.3175" stroke="#c9b1ff" strokeWidth="1.2" /></svg>
}

function ConstellationPath() {
  const reduced = useReducedMotion()
  const stars = [
    { star: CONSTELLATION_BRANCHES[0][0], pop: .15 },
    { star: CONSTELLATION_BRANCHES[1][0], pop: .17 },
    ...CONSTELLATION_MAIN.map((star, index) => ({ star, pop: .12 + index / (CONSTELLATION_MAIN.length - 1) * .32 })),
  ]
  const drawWindows = [[.04, .15], [.06, .17], [.12, .44]]
  const sparklePath = 'M12 1.6c.55 5.2 2.4 7.05 7.6 7.6 -5.2.55 -7.05 2.4 -7.6 7.6 -.55 -5.2 -2.4 -7.05 -7.6 -7.6 5.2 -.55 7.05 -2.4 7.6 -7.6z'

  return (
    <div className={styles.constellation} aria-hidden="true">
      <svg viewBox="0 0 900 280" preserveAspectRatio="xMidYMid meet" fill="none">
        <defs>
          <linearGradient id="constellation-stroke" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e7d6ff" /><stop offset=".5" stopColor="#c9b1ff" /><stop offset="1" stopColor="#f1cf7c" /></linearGradient>
          <filter id="constellation-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3.4" /></filter>
        </defs>
        <g>
          {!reduced && <animate attributeName="opacity" values="0;1;1;1;0" keyTimes="0;.04;.6;.93;1" dur="13s" repeatCount="indefinite" />}
          {CONSTELLATION_BRANCHES.map((branch, index) => (
            <g key={index}>
              {[{ className: styles.constellationGlow, opacity: .26 }, { className: styles.constellationLine, opacity: .9 }].map(layer => (
                <path className={layer.className} pathLength="1" strokeOpacity={reduced ? .85 * layer.opacity : layer.opacity} strokeDasharray="1" strokeDashoffset={reduced ? 0 : 1} d={constellationPath(branch)} key={layer.className}>
                  {!reduced && <animate attributeName="stroke-dashoffset" values="1;1;0;0" keyTimes={`0;${drawWindows[index][0]};${drawWindows[index][1]};1`} dur="13s" repeatCount="indefinite" />}
                </path>
              ))}
            </g>
          ))}
          {stars.map(({ star, pop }, index) => {
            const keyTimes = `0;${Math.max(pop - .03, .001)};${pop};1`
            if ('focal' in star && star.focal) {
              const scale = 6.2 * star.r / 24
              return <g transform={`translate(${star.x} ${star.y}) scale(${scale}) translate(-12 -12)`} key={index}><path d={sparklePath} fill="#f1cf7c" className={styles.constellationFocal}>{!reduced && <><animate attributeName="opacity" values="0;0;1;1" keyTimes={keyTimes} dur="13s" repeatCount="indefinite" /><animateTransform attributeName="transform" type="scale" values=".2;1;1.2;1" keyTimes={keyTimes} dur="13s" repeatCount="indefinite" /></>}</path></g>
            }
            return <circle key={index} cx={star.x} cy={star.y} r={reduced ? star.r : .3 * star.r} fill="#fffdf7">{!reduced && <><animate attributeName="opacity" values="0;0;1;1" keyTimes={keyTimes} dur="13s" repeatCount="indefinite" /><animate attributeName="r" values={`${.3 * star.r};${.3 * star.r};${1.2 * star.r};${star.r}`} keyTimes={keyTimes} dur="13s" repeatCount="indefinite" /></>}</circle>
          })}
        </g>
      </svg>
    </div>
  )
}

export function StartScreen({ onPick }: StartScreenProps) {
  return (
    <section className={styles.genderStep}>
      <div className={styles.stars} aria-hidden="true">
        {STARS.map((star, index) => <span key={index} className={styles.star} style={{ top: `${star.top}%`, left: `${star.left}%`, width: star.size, height: star.size, '--star-opacity': star.opacity, animationDelay: star.delay, animationDuration: star.duration, boxShadow: star.shine ? '0 0 6px 1px rgba(241,207,124,.55)' : undefined, background: star.shine ? '#f1cf7c' : '#fffdf7' } as CSSProperties} />)}
      </div>
      <div className={styles.ratingRow}><span className={styles.ratingStars}>{Array.from({ length: 5 }, (_, index) => <StarIcon key={index} />)}</span><b>4,8/5</b><i />Лучшее астрологическое приложение</div>
      <div className={styles.proof}>Оценено реальными пользователями <span><AccuracyIcon /></span><b>Точность 93,6 %</b></div>
      <ConstellationPath />
      <div className={styles.genderLabel}><span className={styles.promptText}>ЧТОБЫ НАЧАТЬ, УКАЖИ СВОЙ ГЕНДЕР</span><span className={styles.promptArrow}><DownArrowIcon /></span></div>
      <div className={styles.genderGrid} role="radiogroup" aria-label="Чтобы начать, укажи свой гендер"><button type="button" role="radio" onClick={() => onPick('female')}><img src={`${ASSET_ROOT}gender-female.webp`} alt="" /><b>Женский</b></button><button type="button" role="radio" onClick={() => onPick('male')}><img src={`${ASSET_ROOT}gender-male.webp`} alt="" /><b>Мужской</b></button></div>
      <div className={styles.minute}><ClockIcon /><span>Тест на 1 минуту</span></div>
    </section>
  )
}
