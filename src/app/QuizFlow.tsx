import type { CSSProperties } from 'react'
import type { BirthDateValue, BirthPlaceValue } from '../domain/quiz'
import { useQuiz } from '../hooks/useQuiz'
import { astrologyCheckpointVariants, astrologyDrawVariantByLabel, optionSteps, optionValuesByStep } from '../data/steps'
import { QuizNavigation } from '../features/quiz/screens/QuizChrome/QuizChrome'
import { ChipSelectScreen, PictureSelectScreen, TextSelectScreen } from '../features/quiz/screens/SelectScreens/SelectScreens'
import { CheckpointScreen } from '../features/quiz/screens/CheckpointScreen/CheckpointScreen'
import { SymbolCheckpointScreen } from '../features/quiz/screens/SymbolCheckpointScreen/SymbolCheckpointScreen'
import { SliderScreen } from '../features/quiz/screens/SliderScreen/SliderScreen'
import { LikertScreen } from '../features/quiz/screens/LikertScreen/LikertScreen'
import { DateWheelScreen, TimeWheelScreen } from '../features/quiz/screens/WheelScreens/WheelScreens'
import { BirthRevealScreen } from '../features/quiz/screens/BirthRevealScreen/BirthRevealScreen'
import { PalmGuideScreen } from '../features/quiz/screens/PalmGuideScreen/PalmGuideScreen'
import { PalmAnalysingScreen, PalmRevealScreen } from '../features/quiz/screens/PalmResultScreens/PalmResultScreens'
import { IconCheckpointScreen } from '../features/quiz/screens/IconCheckpointScreen/IconCheckpointScreen'
import { AnalysisScreen, EmailScreen, ExpertScreen, SocialWallScreen, TrialScreen } from '../features/quiz/screens/FinalScreens/FinalScreens'
import { BirthPlaceScreen } from '../features/quiz/screens/BirthPlaceScreen/BirthPlaceScreen'
import { StartScreen } from '../features/quiz/screens/StartScreen/StartScreen'
import { NameScreen } from '../features/quiz/screens/NameScreen/NameScreen'
import { FinishScreen } from '../features/quiz/screens/FinishScreen/FinishScreen'
import { ClockRevealScreen } from '../features/quiz/screens/ClockRevealScreen/ClockRevealScreen'
import { PalmCaptureScreen } from '../features/quiz/screens/PalmCaptureScreen/PalmCaptureScreen'
import { uploadPalmPhoto } from '../features/quiz/api/palm'
import styles from './QuizFlow.module.css'

const ASSET_ROOT = '/assets/'
const optionStepPositions: Record<number, number> = { 4: 5, 7: 8, 9: 10, 11: 12 }
const DARK_STEPS = new Set([3, 5, 8, 12, 19, 20, 24, 25, 28, 29])

function splitOption(option: string, value?: string) {
  const [icon, ...labelParts] = option.includes('|') ? option.split('|') : ['', option]
  const label = labelParts.join('|')
  return { icon, label, value: value ?? label }
}

function OptionStep({ step, answers, onSelect, onBack }: { step: number; answers: Record<string, unknown>; onSelect: (value: string) => void; onBack: () => void }) {
  const config = optionSteps[step]
  if (!config) return null
  const position = optionStepPositions[step] ?? step + 1
  const Screen = step === 9 ? ChipSelectScreen : TextSelectScreen
  return <Screen step={{ stepId: `step-${position}`, question: config.title, options: config.options.map((option, index) => splitOption(option, optionValuesByStep[step]?.[index])) }} selectedValue={answers[`step${step}`] as string | undefined} onSelect={option => onSelect(option.value)} onBack={onBack} progress={position / 28} />
}

function renderStep(step: number, answers: Record<string, unknown>, go: (step: number, patch?: Record<string, unknown>) => void, back: () => void, backWithPatch: (patch: Record<string, unknown>) => void, restart: () => void) {
  if (step === 1) {
    const config = optionSteps[1]
    const options = config.options.map((label, index) => ({ label, value: ['little', 'teen', 'adulthood', 'recently', 'cant_remember', 'cant_read'][index], image: `${ASSET_ROOT}${config.images?.[index]}` }))
    return <PictureSelectScreen step={{ stepId: 'step3', question: config.title, options }} selectedValue={answers.step1 as string | undefined} onSelect={option => go(2, { step1: option.value })} onBack={back} progress={2 / 28} />
  }
  if (step === 2) return <OptionStep step={2} answers={answers} onSelect={value => go(3, { step2: value })} onBack={back} />
  if (optionSteps[step]) return <OptionStep step={step} answers={answers} onSelect={value => go(step + 1, { [`step${step}`]: value })} onBack={back} />
  switch (step) {
    case 3: {
      const storedValue = String(answers.step2)
      const variantKey = astrologyCheckpointVariants[storedValue] ? storedValue : astrologyDrawVariantByLabel[storedValue] ?? 'all'
      const variant = astrologyCheckpointVariants[variantKey]
      return <CheckpointScreen {...variant} image="/images/quiz/checkpoint-central.webp" onContinue={() => go(4)} onBack={back} progress={4 / 28} />
    }
    case 5: return <SymbolCheckpointScreen title="Эта мечта ближе, чем кажется" subtitle="Ты ближе, чем думаешь. Талант у тебя уже есть - не хватает лишь подходящего инструмента, который поможет понять натальные карты без многолетней учёбы." image="/images/quiz/checkpoint2-central.webp" symbols={Array.from({ length: 8 }, (_, index) => `/images/quiz/q7-sym-${index + 1}.webp`)} onContinue={() => go(6)} onBack={back} progress={6 / 28} />
    case 6: return <SliderScreen question="Какими обычно бывают твои отношения с другими людьми?" states={['Очень изматывающими', 'Часто непростыми', 'Вызывающими смешанные чувства', 'В основном лёгкими', 'Полными поддержки'].map((label, index) => ({ label, value: ['draining', 'difficult', 'mixed', 'easy', 'supportive'][index], image: `/images/quiz/q8-fig-${index + 1}.webp` }))} initialValue={answers.relationship as string | undefined} onContinue={value => go(7, { relationship: value })} onBack={back} progress={7 / 28} />
    case 8: return <IconCheckpointScreen title="Научись разбирать реальные натальные карты" subtitle="Кому бы тебе ни хотелось помогать в первую очередь, мы шаг за шагом научим тебя понимать ключевые элементы натальной карты. Ты сможешь разбирать собственную карту, лучше понимать других и уверенно пользоваться астрологией." image="/images/quiz/q10-central.webp" icons={['moon', 'transits', 'houses', 'rising', 'sun', 'planets', 'wheel', 'aspects'].map(icon => `/images/quiz/q10-ic-${icon}.webp`)} concepts onContinue={() => go(9)} onBack={back} progress={9 / 28} />
    case 10: return <LikertScreen question="Согласишься ли ты с этим утверждением?" statement="Я часто замечаю закономерности в поведении людей, чувствах и жизненных событиях ещё до того, как могу их объяснить." points={[{ value: 'strong_disagree', icon: '👎' }, { value: 'disagree', icon: '👎', emphasis: 'soft' }, { value: 'neutral', icon: '🤷', emphasis: 'soft' }, { value: 'agree', icon: '👍', emphasis: 'soft' }, { value: 'strong_agree', icon: '👍' }]} minLabel="Полное несогласие" maxLabel="Полное согласие" initialValue={answers.patterns as string | undefined} onSelect={value => go(11, { patterns: value })} onBack={back} progress={11 / 28} />
    case 12: return <IconCheckpointScreen title="Каждый твой ответ дополняет общую картину." subtitle="Она показывает не только, кто ты, но и как ты будешь использовать астрологию. Каждый астролог видит натальные карты по-своему. Скоро мы покажем, как видишь их ты." image="/images/quiz/q14-central.webp" icons={['sun', 'moon', 'chiron', 'prism', 'aries', 'scorpio', 'caduceus', 'venus'].map(icon => `/images/quiz/q14-gl-${icon}.webp`)} onContinue={() => go(13)} onBack={back} progress={13 / 28} />
    case 13: return <DateWheelScreen question="Когда у тебя день рождения?" subtitle="По дате рождения мы составим твою натальную карту - основу всего, что покажет тебе Astrologist." initialValue={answers.birthDate as BirthDateValue | undefined} onContinue={birthDate => go(14, { birthDate })} onBack={back} progress={14 / 28} />
    case 14: return <TextSelectScreen step={{ stepId: 'step16', question: 'Ты знаешь точное время своего рождения?', subtitle: 'Не знаешь точно? Ничего страшного - можно уточнить позже.', options: [{ label: 'Да', value: 'yes', icon: '👍' }, { label: 'Нет', value: 'no', icon: '👎' }] }} selectedValue={answers.knowsBirthTime as string | undefined} onSelect={option => go(option.value === 'yes' ? 15 : 28, { knowsBirthTime: option.value })} onBack={back} progress={15 / 28} />
    case 15: return <TimeWheelScreen question="Каково точное время твоего рождения?" subtitle="Время рождения определяет твой Асцендент. Через эту призму ты научишься разбирать любые натальные карты - начиная со своей." initialValue={answers.birthTime as string | undefined} onContinue={birthTime => go(16, { birthTime })} onBack={back} progress={16 / 28} />
    case 16: return <BirthPlaceScreen initialValue={answers.birthPlace as BirthPlaceValue | undefined} onContinue={birthPlace => go(17, { birthPlace })} onBack={back} />
    case 17: return <BirthRevealScreen birthDate={answers.birthDate as BirthDateValue | undefined} birthTime={answers.birthTime as string | undefined} onContinue={() => go(18)} onBack={back} progress={18 / 28} />
    case 18: return <PalmGuideScreen onUpload={async photo => go(19, { photo, photoPath: await uploadPalmPhoto(photo) })} onCamera={() => go(29)} onSkip={() => go(21, { photo: null, photoPath: '' })} cameraAborted={answers.palmCameraAborted === 'yes'} onBack={back} progress={19 / 28} />
    case 19: return <PalmAnalysingScreen onContinue={() => go(20)} onBack={back} progress={21 / 28} />
    case 20: return <PalmRevealScreen onContinue={() => go(21)} onBack={back} progress={22 / 28} />
    case 21: return <NameScreen answers={answers} onContinue={fullName => go(22, { fullName })} onBack={back} progress={23 / 28} />
    case 22: return <ExpertScreen onContinue={() => go(23)} onBack={back} />
    case 23: return <SocialWallScreen onContinue={() => go(24)} onBack={back} />
    case 24: return <EmailScreen onContinue={emailData => go(25, { ...emailData })} onBack={back} />
    case 25: return <AnalysisScreen onContinue={responses => go(26, responses)} onBack={back} />
    case 26: return <TrialScreen onContinue={tier => go(27, { tier })} onBack={back} />
    case 28: return <ClockRevealScreen onContinue={() => go(16)} onBack={back} progress={16 / 28} />
    case 29: return <PalmCaptureScreen onCapture={async photo => go(19, { photo, photoPath: await uploadPalmPhoto(photo) })} onSkip={() => go(21, { photo: null, photoPath: '' })} onBack={() => backWithPatch({ palmCameraAborted: 'yes' })} />
    default: return <FinishScreen onRestart={restart} />
  }
}

export function QuizFlow() {
  const { step, answers, direction, go, back, backWithPatch, restart } = useQuiz()
  const content = step === 0 ? <StartScreen onPick={gender => go(1, { gender })} /> : renderStep(step, answers, go, back, backWithPatch, restart)
  const theme = step === 0 ? styles.startTheme : DARK_STEPS.has(step) ? styles.darkTheme : styles.lightTheme
  return <main className={`${styles.root} ${theme}`}>{step === 0 && <div className={styles.startNav}><QuizNavigation onBack={back} /></div>}<div key={step} className={`${styles.screen} ${step === 0 ? styles.startScreen : ''} ${direction === 'back' ? styles.screenBack : ''}`}>{content}</div>{step === 0 && <div className={styles.today}><span>☾</span><b>6 000+</b> тестов пройдено сегодня</div>}</main>
}
