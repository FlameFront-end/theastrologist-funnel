import type { MouseEventHandler, ReactNode } from 'react'
import styles from './ContinueButton.module.css'

interface ContinueButtonProps { children?: ReactNode; onClick: MouseEventHandler<HTMLButtonElement>; disabled?: boolean }

export function ContinueButton({ children = 'ПРОДОЛЖИТЬ', onClick, disabled = false }: ContinueButtonProps) {
  return (
    <button className={styles.button} type="button" onClick={onClick} disabled={disabled}>
      {children}<span aria-hidden="true">→</span>
    </button>
  )
}
