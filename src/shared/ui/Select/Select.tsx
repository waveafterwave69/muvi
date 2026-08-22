'use client'

import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { classNames } from '@/shared/helpers/className'
import type { Size } from '@/shared/types/size'
import type { Variant } from '@/shared/types/variant'
import styles from './Select.module.scss'

type SelectValue = string | number

export interface SelectOption<T extends SelectValue = SelectValue> {
  value: T
  label: ReactNode
  description?: ReactNode
}

export interface SelectProps<T extends SelectValue = SelectValue> {
  label: ReactNode
  options: readonly SelectOption<T>[]
  value: T
  onChange: (value: T) => void
  icon?: ReactNode
  size?: Size
  variant?: Variant
  className?: string
  disabled?: boolean
}

const Select = <T extends SelectValue>({
  label,
  options,
  value,
  onChange,
  icon,
  size = 'md',
  variant = 'primary',
  className = '',
  disabled = false,
}: SelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const generatedId = useId()
  const labelId = `${generatedId}-label`
  const optionsId = `${generatedId}-options`
  const activeOption = options.find((option) => option.value === value)

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div
      ref={rootRef}
      className={classNames(styles.root, {}, [className, styles[`root__${size}`]])}
    >
      <span id={labelId}>{label}</span>
      <button
        type="button"
        className={classNames(
          styles.control,
          { [styles.control__open]: isOpen },
          [styles[`control__${variant}`]],
        )}
        aria-labelledby={labelId}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={optionsId}
        disabled={disabled}
        onClick={() => setIsOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            setIsOpen(true)
          }
        }}
      >
        {icon && (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )}
        <span className={styles.value}>
          {activeOption?.label ?? value}
          {activeOption?.description != null && <small>· {activeOption.description}</small>}
        </span>
        <ChevronDown
          className={classNames(styles.chevron, {
            [styles.chevron__open]: isOpen,
          })}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div id={optionsId} className={styles.menu} role="listbox" aria-labelledby={labelId}>
          {options.map((option) => {
            const isActive = option.value === value

            return (
              <button
                key={option.value}
                type="button"
                className={classNames(styles.option, {
                  [styles.option__active]: isActive,
                })}
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
              >
                <span className={styles.optionLabel}>{option.label}</span>
                {option.description != null && (
                  <span className={styles.optionDescription}>{option.description}</span>
                )}
                <span className={styles.optionCheck}>
                  {isActive && <Check aria-hidden="true" />}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Select
