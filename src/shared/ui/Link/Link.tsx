import styles from './Link.module.scss'
import Link from 'next/link'
import { ReactNode } from 'react'
import { classNames } from '@/shared/helpers/className'

interface Props {
  href: string
  children: ReactNode
  className?: string
  variant?: 'primary' | 'secondary' | 'muted'
}

const Lnk = ({ href, children, className, variant = 'primary' }: Props) => {
  return (
    <Link href={href} className={classNames(styles.link, {}, [className ?? '', styles[variant]])}>
      {children}
    </Link>
  )
}

export default Lnk
