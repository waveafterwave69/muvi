'use client'

import { motion } from 'motion/react'
import styles from './HomeContent.module.scss'
import { Button } from '@/shared/ui'
import { LogIn, MoveRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

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
            router.push('/register')
        } else {
            router.push('/login')
        }
    }

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
                <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Button
                        onClick={() => handleRedirectAuth('login')}
                        className={styles.button__border}
                        variant="secondary"
                    >
                        <LogIn size={22} /> Войти
                    </Button>
                </motion.div>

                <motion.div whileHover="hover" whileTap={{ scale: 0.98 }}>
                    <Button onClick={() => handleRedirectAuth('register')}>
                        Зарегистрироваться
                        <motion.div
                            variants={{
                                hover: { x: 5 },
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 300,
                                damping: 20,
                            }}
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            <MoveRight size={24} />
                        </motion.div>
                    </Button>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}

export default HomeContent
