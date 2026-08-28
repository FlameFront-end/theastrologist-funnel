import { QuizFlow } from './QuizFlow'
import styles from './App.module.css'

/** Application composition root. The quiz flow owns navigation and screen selection. */
export default function App() {
  return <div className={styles.root}><QuizFlow /></div>
}
