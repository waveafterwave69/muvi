import type { FC, ReactNode } from 'react'
import styles from './Card.module.scss'
import { Size } from '@/shared/types/size'

interface CardProps {
  className?: string
  size?: Size
  children: ReactNode
}

const Card: FC<CardProps> = ({ className, size = 'md', children, ...props }) => {
  return (
    <div className={`${styles.card} ${className}  ${styles[size]}`} {...props}>
      {children}
    </div>
  )
}

export default Card
