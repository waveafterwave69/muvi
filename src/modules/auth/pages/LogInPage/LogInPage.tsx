import { LogInForm } from '../../components'
import SideContent from '../../components/SideContent/SideContent'
import styles from './LogInPage.module.scss'

export const LogInPage = () => {
  return (
    <div className={styles.root}>
      <SideContent />
      <div className={styles.form}>
        <LogInForm />
      </div>
    </div>
  )
}
