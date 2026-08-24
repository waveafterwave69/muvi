'use client'

import { useId } from 'react'
import { motion } from 'framer-motion'
import styles from './Tabs.module.scss'
import { TabVariant } from '@/shared/types/variant'
import { Size } from '@/shared/types/size'
import { Tab } from '@/shared/types/tab'

interface TabsProps<T extends Tab['id']> {
  variant?: TabVariant
  className?: string
  size?: Size
  tabs: Tab[]
  value: T
  onChange: (id: T) => void
}

const Tabs = <T extends Tab['id'],>({
  className = '',
  tabs,
  variant = 'primary',
  size = 'md',
  value,
  onChange,
}: TabsProps<T>) => {
  const layoutId = useId()

  return (
    <div
      role="tablist"
      className={`${styles.tabs} ${className} ${styles[variant]} ${styles[size]}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === value

        return (
          <button
            key={String(tab.id)}
            type="button"
            onClick={() => onChange(tab.id as T)}
            className={`${styles.tab} ${isActive ? styles.is__active : ''}`}
          >
            <span className={styles.tab__text}>{tab.label}</span>

            {isActive && (
              <motion.span
                layoutId={`active-pill-${layoutId}`}
                className={styles.tab__bg}
                transition={{
                  type: 'spring',
                  stiffness: 380,
                  damping: 30,
                }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

export default Tabs
