import styles from './ContinueButton.module.css'

export function ContinueButton({ children = 'ПРОДОЛЖИТЬ', onClick, disabled = false }) {
  return (
    <button className={styles.button} type="button" onClick={onClick} disabled={disabled}>
      {children}<span aria-hidden="true">→</span>
    </button>
  )
}
