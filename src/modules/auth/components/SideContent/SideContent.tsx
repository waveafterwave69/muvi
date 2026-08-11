import { Heart } from 'lucide-react'
import styles from './SideContent.module.scss'

const ContentValues = {
  signup: {
    tag: 'MUVI · personal cinema',
    title: 'Собери свой уютный киновечер',
    description:
      'Создавай списки фильмов, отмечай просмотренное и выбирай, что посмотреть одному или вместе.',
  },
  login: {
    tag: 'MUVI · personal cinema',
    title: 'Собери свой уютный киновечер',
    description:
      'Создавай списки фильмов, отмечай просмотренное и выбирай, что посмотреть одному или вместе.',
  },
  forgotPassword: {
    tag: 'MUVI · account recovery',
    title: 'Вернем доступ к твоему киновечеру',
    description: 'Укажи почту аккаунта — мы отправим ссылку для восстановления пароля.',
  },
  resetPassword: {
    tag: 'MUVI · secure access',
    title: 'Придумай новый надежный пароль',
    description: 'Поменяй пароль и получи доступ к фильмам.',
  },
}

interface SideContentProps {
  variant: 'signup' | 'login' | 'forgotPassword' | 'resetPassword'
}

const SideContent = ({ variant }: SideContentProps) => {
  return (
    <section className={styles.intro}>
      <div className={styles.badge}>
        <Heart aria-hidden="true" />
        <span>{ContentValues[variant].tag}</span>
      </div>

      <h1 className={styles.title}>{ContentValues[variant].title}</h1>

      <p className={styles.description}>{ContentValues[variant].description}</p>
    </section>
  )
}

export default SideContent
