import { Heart } from 'lucide-react'
import styles from './SideContent.module.scss'

const SideContent = () => {
  return (
    <section className={styles.intro}>
      <div className={styles.badge}>
        <Heart aria-hidden="true" />
        <span>MUVI · personal cinema</span>
      </div>

      <h1 className={styles.title}>Собери свой уютный киновечер</h1>

      <p className={styles.description}>
        Создавай списки фильмов, отмечай просмотренное и выбирай, что посмотреть одному или вместе.
      </p>
    </section>
  )
}

export default SideContent
