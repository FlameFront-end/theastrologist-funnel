import { ContinueButton } from '../../../../shared/ui/ContinueButton'
import styles from './FinishScreen.module.css'

interface FinishScreenProps { onRestart: () => void }

export function FinishScreen({ onRestart }: FinishScreenProps) {
  return <section className={styles.questionShell}><div className={styles.finishSymbol}>✦</div><h1>Тестовая воронка завершена</h1><p>В боевой версии здесь открывается безопасная страница оплаты. Для тестового задания сервер и платежи отключены.</p><ContinueButton onClick={onRestart}>ПРОЙТИ ЕЩЁ РАЗ</ContinueButton></section>
}
