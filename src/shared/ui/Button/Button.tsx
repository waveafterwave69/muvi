import styles from './Button.module.scss'
import { ComponentProps, FC, ReactNode } from 'react'

interface Props extends ComponentProps<'button'> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  className?: string
  size?: 'sm' | 'md' | 'lg'
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const Button: FC<Props> = ({
  children,
  variant = 'primary',
  className,
  size = 'md',
  leftIcon,
  rightIcon,
  type = 'button',
  disabled = false,
  ...props
}) => {
  return (
    <button
      className={`${styles.button} ${className} ${styles[variant]} ${styles[size]}`}
      type={type}
      disabled={disabled}
      {...props}
    >
      {leftIcon && leftIcon}
      {children}
      {rightIcon && rightIcon}
    </button>
  )
}
