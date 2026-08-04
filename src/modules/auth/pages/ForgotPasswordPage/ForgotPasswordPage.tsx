import styles from './ForgotPasswordPage.module.scss'
import SideContent from '../../components/SideContent/SideContent'
import { ForgotPasswordForm } from '../../components/form/ForgotPassword/ForgotPasswordForm'

export function ForgotPasswordPage() {
  return (
    <div className={styles.root}>
      <SideContent variant={'forgotPassword'} />
      <div className={styles.form}>
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
