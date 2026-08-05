'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LogIn, MoveRight } from 'lucide-react'
import styles from './HomeContent.module.scss'
import { Button } from '@/shared/ui'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
} as const

const HomeContent = () => {
  const router = useRouter()

  const handleRedirectAuth = (type: 'register' | 'login') => {
    if (type === 'register') {
      router.push('/signup')
    } else {
      router.push('/login')
    }
  } // Скобка функции handleRedirectAuth

  return (
    <motion.div
      className={styles.container}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.p variants={itemVariants} className={styles.brand__text}>
        Ваш маленький киноуголок
      </motion.p>
      <motion.h1 variants={itemVariants} className={styles.title}>
        Кино, вечер, мы.
      </motion.h1>
      <motion.p variants={itemVariants} className={styles.subtitle}>
        Тёплое место для любимых фильмов и общих планов.
      </motion.p>
      <motion.div variants={itemVariants} className={styles.buttons}>
        <Button
          onClick={() => handleRedirectAuth('login')}
          className={styles.button__border}
          variant="secondary"
        >
          <LogIn size={22} /> Войти
        </Button>
        <Button onClick={() => handleRedirectAuth('register')}>
          Зарегистрироваться <MoveRight size={24} />
        </Button>
      </motion.div>
    </motion.div>
  )
}

export default HomeContent
