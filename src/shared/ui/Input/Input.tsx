'use client'

import { Eye, EyeOff } from 'lucide-react'
import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from 'react'
import type { Size } from '@/shared/types/size'
import type { Variant } from '@/shared/types/variant'
import { classNames } from '@/shared/helpers/className'
import styles from './Input.module.scss'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: ReactNode
  error?: ReactNode
  icon?: ReactNode
  size?: Size
  variant?: Variant
  rootClassName?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    icon,
    size = 'md',
    variant = 'primary',
    rootClassName = '',
    className = '',
    id,
    type = 'text',
    disabled,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    ...props
  },
  ref,
) {
  const generatedId = useId()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`
  const isPassword = type === 'password'
  const hasError = Boolean(error)
  const inputType = isPassword && isPasswordVisible ? 'text' : type
  const describedBy =
    [ariaDescribedBy, hasError ? errorId : undefined].filter(Boolean).join(' ') || undefined

  return (
    <div className={classNames(styles.root, {}, [rootClassName, styles[`root__${size}`]])}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}

      <div
        className={classNames(
          styles.field,
          {
            [styles.field__error]: hasError,
            [styles.field__disabled]: Boolean(disabled),
          },
          [styles[`field__${size}`], styles[`field__${variant}`]],
        )}
      >
        {icon && (
          <span className={styles.leadingIcon} aria-hidden="true">
            {icon}
          </span>
        )}

        <input
          {...props}
          ref={ref}
          id={inputId}
          type={inputType}
          disabled={disabled}
          aria-describedby={describedBy}
          aria-invalid={hasError ? true : ariaInvalid}
          className={classNames(styles.input, {}, [className])}
        />

        {isPassword && (
          <button
            className={styles.passwordToggle}
            type="button"
            disabled={disabled}
            aria-label={isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'}
            aria-pressed={isPasswordVisible}
            onClick={() => setIsPasswordVisible((visible) => !visible)}
          >
            {isPasswordVisible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
          </button>
        )}
      </div>

      {hasError && (
        <span className={styles.error} id={errorId} role="alert">
          {error}
        </span>
      )}
    </div>
  )
})
